"use client";

import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  Code2,
  Copy,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { IconType } from "react-icons";
import {
  SiCloudflare,
  SiDart,
  SiDocker,
  SiFigma,
  SiFirebase,
  SiFlutter,
  SiGit,
  SiGitlab,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPostman,
  SiPrisma,
  SiPython,
  SiReact,
  SiTypescript,
} from "react-icons/si";
import GithubIcon from "./components/GithubIcon";
import SiteNav from "./components/Sitenav";
import {
  coverOf,
  localizeExperience,
  localizeProject,
  type Experience,
  type Project,
} from "./lib/api";
import { useLang } from "./lib/i18n";
import { trackPointer } from "./lib/Pointer";

import dynamic from "next/dynamic";

const Lanyard = dynamic(() => import("./components/Lanyard"), {
  ssr: false,
  loading: () => <div className="lanyard" aria-hidden="true" />,
});

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const EMAIL = "nutthanunpengpala@gmail.com";
const GITHUB_URL = "https://github.com/Nutthanun-Pangpala";

// Internal value for the "show everything" filter. Shown as t.projects.all.
const ALL = "All";

type Skill = { name: string; Icon: IconType; color: string };
type SkillGroupKey = "frontend" | "backend" | "mobile" | "tools";

const skillGroups: { key: SkillGroupKey; items: Skill[] }[] = [
  {
    key: "frontend",
    items: [
      { name: "TypeScript", Icon: SiTypescript, color: "#3178c6" },
      { name: "JavaScript", Icon: SiJavascript, color: "#f7df1e" },
      { name: "React", Icon: SiReact, color: "#61dafb" },
      { name: "Next.js", Icon: SiNextdotjs, color: "#ffffff" },
    ],
  },
  {
    key: "backend",
    items: [
      { name: "Node.js", Icon: SiNodedotjs, color: "#5fa04e" },
      { name: "NestJS", Icon: SiNestjs, color: "#e0234e" },
      { name: "PostgreSQL", Icon: SiPostgresql, color: "#5b8dd9" },
      { name: "MySQL", Icon: SiMysql, color: "#4f9fcf" },
      { name: "Prisma", Icon: SiPrisma, color: "#7c8cf8" },
      { name: "MongoDB", Icon: SiMongodb, color: "#47a248" },
      { name: "Python", Icon: SiPython, color: "#4b8bbe" },
    ],
  },
  {
    key: "mobile",
    items: [
      { name: "Flutter", Icon: SiFlutter, color: "#54c5f8" },
      { name: "Dart", Icon: SiDart, color: "#2bb7f6" },
      { name: "Firebase", Icon: SiFirebase, color: "#ffca28" },
    ],
  },
  {
    key: "tools",
    items: [
      { name: "Git", Icon: SiGit, color: "#f05032" },
      { name: "Docker", Icon: SiDocker, color: "#2496ed" },
      { name: "GitLab", Icon: SiGitlab, color: "#fc6d26" },
      { name: "Figma", Icon: SiFigma, color: "#f24e1e" },
      { name: "Postman", Icon: SiPostman, color: "#ff6c37" },
      { name: "Cloudflare", Icon: SiCloudflare, color: "#f38020" },
    ],
  },
];

function formatDate(date: string, lang: "en" | "th") {
  // th-TH shows Buddhist Era years (e.g. มิ.ย. 2568), which is what Thai
  // readers expect. Use "th-TH-u-ca-gregory" if you prefer CE years.
  return new Intl.DateTimeFormat(lang === "th" ? "th-TH" : "en", {
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function Home() {
  const { lang, t } = useLang();

  const [rawProjects, setRawProjects] = useState<Project[]>([]);
  const [rawExperiences, setRawExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [filter, setFilter] = useState(ALL);
  const [copied, setCopied] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPortfolio() {
      try {
        const [projectsResponse, experiencesResponse] = await Promise.all([
          fetch(`${API_URL}/projects`, { signal: controller.signal }),
          fetch(`${API_URL}/experiences`, { signal: controller.signal }),
        ]);

        if (!projectsResponse.ok || !experiencesResponse.ok) {
          throw new Error("Unable to load portfolio data");
        }

        const [projectData, experienceData] = await Promise.all([
          projectsResponse.json(),
          experiencesResponse.json(),
        ]);

        setRawProjects(projectData);
        setRawExperiences(experienceData);
        setApiError(false);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        setApiError(true);
      } finally {
        setLoading(false);
      }
    }

    loadPortfolio();
    return () => controller.abort();
  }, []);

  // Pick the Thai or English text for the current language. The data is only
  // fetched once; switching language just re-maps it.
  const projects = useMemo(
    () => rawProjects.map((project) => localizeProject(project, lang)),
    [rawProjects, lang],
  );
  const experiences = useMemo(
    () => rawExperiences.map((item) => localizeExperience(item, lang)),
    [rawExperiences, lang],
  );

  // The gold line on the timeline fills in as you read down the page.
  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const progress =
          (window.innerHeight * 0.65 - rect.top) / Math.max(rect.height, 1);
        el.style.setProperty(
          "--fill",
          String(Math.min(Math.max(progress, 0), 1)),
        );
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [experiences]);

  // Technology names are the same in both languages, so the filter keeps
  // working when the language changes.
  const technologies = useMemo(
    () => [
      ALL,
      ...Array.from(new Set(rawProjects.flatMap((p) => p.technologies))),
    ],
    [rawProjects],
  );

  const visibleProjects =
    filter === ALL
      ? projects
      : projects.filter((project) => project.technologies.includes(filter));

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  }

  return (
    <main>
      <SiteNav />

      <section className="container hero" id="home">
        <div className="hero-copy">
          <div
            className="status"
            data-enter
            style={{ "--i": 0 } as React.CSSProperties}
          >
            <span className="status-dot" />
            {t.hero.status}
          </div>

          <h1
            className="hero-title"
            data-enter
            style={{ "--i": 1 } as React.CSSProperties}
          >
            Nutthanun
            <br />
            Pengpala
          </h1>

          <p
            className="hero-role"
            data-enter
            style={{ "--i": 2 } as React.CSSProperties}
          >
            {t.hero.role}
          </p>

          <p
            className="hero-description"
            data-enter
            style={{ "--i": 3 } as React.CSSProperties}
          >
            {t.hero.description}
          </p>

          <div
            className="hero-actions"
            data-enter
            style={{ "--i": 4 } as React.CSSProperties}
          >
            <a href="#projects" className="button button-primary">
              {t.hero.seeProjects} <ArrowDownRight size={18} />
            </a>
            <a href="#contact" className="button button-secondary">
              {t.hero.contact} <ArrowUpRight size={17} />
            </a>
          </div>

          <p
            className="hero-meta"
            data-enter
            style={{ "--i": 5 } as React.CSSProperties}
          >
            {t.hero.meta}
          </p>
        </div>

        <div
          className="hero-portrait"
          data-enter
          style={{ "--i": 3 } as React.CSSProperties}
        >
          <Lanyard />
        </div>
      </section>

      <section className="section" id="about">
        <div className="container section-layout">
          <div className="section-head">
            <h2>{t.about.title}</h2>
            <p>{t.about.subtitle}</p>
          </div>

          <div className="about-body">
            <p className="about-lead">{t.about.lead}</p>
            <p>{t.about.body}</p>

            <dl className="focus-list">
              {t.about.focus.map((area) => (
                <div className="focus-item" key={area.detail}>
                  <dt>{area.title}</dt>
                  <dd>{area.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="section" id="skills">
        <div className="container section-layout">
          <div className="section-head">
            <h2>{t.skills.title}</h2>
            <p>{t.skills.subtitle}</p>
          </div>

          <div className="skill-groups">
            {skillGroups.map((group) => (
              <div className="skill-group" key={group.key}>
                <h3>{t.skills.groups[group.key]}</h3>
                <ul className="skill-icons">
                  {group.items.map(({ name, Icon, color }) => (
                    <li
                      className="skill-icon"
                      key={name}
                      tabIndex={0}
                      style={{ "--brand": color } as React.CSSProperties}
                    >
                      <Icon size={28} aria-hidden="true" />
                      <span className="skill-name">{name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="projects">
        <div className="container section-layout">
          <div className="section-head">
            <h2>{t.projects.title}</h2>
            <p>
              {loading
                ? t.projects.loading
                : t.projects.count(projects.length)}
            </p>
          </div>

          <div>
            {apiError && (
              <div className="api-notice" role="alert">
                {t.projects.apiNotice(API_URL)}
              </div>
            )}

            {technologies.length > 2 && (
              <div
                className="filters"
                role="group"
                aria-label={t.projects.filterAria}
              >
                {technologies.map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    className="filter"
                    aria-pressed={filter === tech}
                    onClick={() => setFilter(tech)}
                  >
                    {tech === ALL ? t.projects.all : tech}
                  </button>
                ))}
              </div>
            )}

            {loading ? (
              <div className="empty-state">{t.projects.loading}</div>
            ) : projects.length === 0 ? (
              <div className="empty-state">
                <Code2 size={28} />
                <h3>{t.projects.emptyTitle}</h3>
                <p>{t.projects.emptyBody}</p>
              </div>
            ) : (
              <div className="project-grid">
                {visibleProjects.map((project, index) => (
                  <article
                    className="project-card"
                    key={project.id}
                    onPointerMove={trackPointer}
                  >
                    <div className="project-cover">
                      {coverOf(project) ? (
                        <div
                          className="project-image"
                          style={{
                            backgroundImage: `url("${coverOf(project)}")`,
                          }}
                        />
                      ) : (
                        <div
                          className={`project-placeholder placeholder-${index % 3}`}
                        >
                          <Code2 size={40} strokeWidth={1.2} />
                          <span>{project.title}</span>
                        </div>
                      )}

                      {project.isFeatured && (
                        <span className="featured-label">
                          {t.projects.featured}
                        </span>
                      )}
                      {project.demoUrl && (
                        <span className="live-badge">
                          <span className="live-dot" />
                          {t.projects.live}
                        </span>
                      )}
                    </div>

                    <div className="project-info">
                      <h3>
                        <Link
                          href={`/projects/${project.slug}`}
                          className="project-link"
                        >
                          {project.title}
                        </Link>
                      </h3>
                      <p className="project-summary">{project.description}</p>

                      <ul className="chips">
                        {project.technologies.slice(0, 4).map((technology) => (
                          <li className="chip" key={technology}>
                            {technology}
                          </li>
                        ))}
                        {project.technologies.length > 4 && (
                          <li className="chip chip-more">
                            +{project.technologies.length - 4}
                          </li>
                        )}
                      </ul>

                      <div className="project-footer">
                        {project.demoUrl ? (
                          <a
                            className="project-visit"
                            href={project.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {t.projects.visitSite} <ArrowUpRight size={15} />
                          </a>
                        ) : (
                          <span />
                        )}
                        <span className="project-more">
                          {t.projects.details} <ArrowRight size={15} />
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section" id="experience">
        <div className="container section-layout">
          <div className="section-head">
            <h2>{t.experience.title}</h2>
            <p>{t.experience.subtitle}</p>
          </div>

          <div>
            {loading ? (
              <div className="empty-state">{t.experience.loading}</div>
            ) : experiences.length === 0 ? (
              <div className="empty-state">
                <BriefcaseBusiness size={28} />
                <h3>{t.experience.emptyTitle}</h3>
                <p>{t.experience.emptyBody}</p>
              </div>
            ) : (
              <div className="timeline" ref={timelineRef}>
                {experiences.map((experience) => (
                  <article className="timeline-item" key={experience.id}>
                    <span className="timeline-marker" />

                    <p className="timeline-date">
                      {formatDate(experience.startDate, lang)}
                      {" – "}
                      {experience.endDate
                        ? formatDate(experience.endDate, lang)
                        : t.experience.present}
                    </p>

                    <div className="timeline-title-row">
                      <div>
                        <h3>{experience.position}</h3>
                        <p className="timeline-company">{experience.company}</p>
                      </div>
                      {experience.employmentType && (
                        <span className="employment-type">
                          {experience.employmentType}
                        </span>
                      )}
                    </div>

                    <p className="timeline-description">
                      {experience.description}
                    </p>

                    <ul className="chips">
                      {experience.technologies.map((technology) => (
                        <li className="chip" key={technology}>
                          {technology}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section contact-section" id="contact">
        <div className="container contact-inner">
          <h2>
            {t.contact.titleLine1}
            <br />
            {t.contact.titleLine2}
          </h2>
          <p>{t.contact.body}</p>

          <div className="hero-actions">
            <a className="button button-primary" href={`mailto:${EMAIL}`}>
              {t.contact.sendEmail} <Mail size={17} />
            </a>
            <button
              type="button"
              className="button button-secondary"
              onClick={copyEmail}
            >
              {copied ? <Check size={17} /> : <Copy size={17} />}
              {copied ? t.contact.copied : EMAIL}
            </button>
            <a
              className="button button-secondary"
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
            >
              <GithubIcon size={17} /> {t.contact.github}
            </a>
          </div>
          <span className="sr-only" aria-live="polite">
            {copied ? t.contact.copiedSr : ""}
          </span>
        </div>
      </section>

      <footer className="container footer">
        <span>Nutthanun Pengpala</span>
        <a href="#home" className="back-to-top">
          {t.footer.backToTop} <ArrowUpRight size={15} />
        </a>
      </footer>
    </main>
  );
}