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
import { coverOf } from "./lib/api";
import { trackPointer } from "./lib/Pointer";

import dynamic from "next/dynamic";

const Lanyard = dynamic(() => import("./components/Lanyard"), {
  ssr: false,
  loading: () => <div className="lanyard" aria-hidden="true" />,
});

type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  role?: string | null;
  imageUrl?: string | null;
  images?: string[];
  githubUrl?: string | null;
  demoUrl?: string | null;
  technologies: string[];
  isFeatured: boolean;
};

type Experience = {
  id: string;
  company: string;
  position: string;
  employmentType?: string | null;
  description: string;
  startDate: string;
  endDate?: string | null;
  technologies: string[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const EMAIL = "nutthanunpengpala@gmail.com";
const GITHUB_URL = "https://github.com/Nutthanun-Pangpala";

type Skill = { name: string; Icon: IconType; color: string };

const skillGroups: { title: string; items: Skill[] }[] = [
  {
    title: "Frontend",
    items: [
      { name: "TypeScript", Icon: SiTypescript, color: "#3178c6" },
      { name: "JavaScript", Icon: SiJavascript, color: "#f7df1e" },
      { name: "React", Icon: SiReact, color: "#61dafb" },
      { name: "Next.js", Icon: SiNextdotjs, color: "#ffffff" },
    ],
  },
  {
    title: "Backend",
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
    title: "Mobile",
    items: [
      { name: "Flutter", Icon: SiFlutter, color: "#54c5f8" },
      { name: "Dart", Icon: SiDart, color: "#2bb7f6" },
      { name: "Firebase", Icon: SiFirebase, color: "#ffca28" },
    ],
  },
  {
    title: "Tools",
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

const focusAreas = [
  { title: "Web development", detail: "React, Next.js, TypeScript" },
  { title: "Mobile applications", detail: "Flutter, Dart, Firebase" },
  { title: "Backend and databases", detail: "NestJS, Prisma, PostgreSQL" },
];

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [filter, setFilter] = useState("All");
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

        setProjects(projectData);
        setExperiences(experienceData);
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

  const technologies = useMemo(
    () => [
      "All",
      ...Array.from(new Set(projects.flatMap((p) => p.technologies))),
    ],
    [projects],
  );

  const visibleProjects =
    filter === "All"
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
            Open to new opportunities
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
            Full-stack software developer
          </p>

          <p
            className="hero-description"
            data-enter
            style={{ "--i": 3 } as React.CSSProperties}
          >
            I design and build web applications and software that solve
            real-world problems, from the interface to the database.
          </p>

          <div
            className="hero-actions"
            data-enter
            style={{ "--i": 4 } as React.CSSProperties}
          >
            <a href="#projects" className="button button-primary">
              See my projects <ArrowDownRight size={18} />
            </a>
            <a href="#contact" className="button button-secondary">
              Contact me <ArrowUpRight size={17} />
            </a>
          </div>

          <p
            className="hero-meta"
            data-enter
            style={{ "--i": 5 } as React.CSSProperties}
          >
            Based in Thailand. Web, mobile and backend.
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
            <h2>About</h2>
            <p>Curious by nature, driven by technology.</p>
          </div>

          <div className="about-body">
            <p className="about-lead">
              I&apos;m a software engineering student at Mae Fah Luang
              University with a foundation in web design and development. I
              focus on responsive interfaces and well-documented code, from the
              UI down to the database and APIs.
            </p>
            <p>
              My goal is to keep learning, write maintainable code, and turn
              ideas into applications that people can actually use.
            </p>

            <dl className="focus-list">
              {focusAreas.map((area) => (
                <div className="focus-item" key={area.title}>
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
            <h2>Skills</h2>
            <p>The tools I use to take an idea from sketch to production.</p>
          </div>

          <div className="skill-groups">
            {skillGroups.map((group) => (
              <div className="skill-group" key={group.title}>
                <h3>{group.title}</h3>
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
            <h2>Projects</h2>
            <p>
              {loading
                ? "Loading projects..."
                : `${projects.length} ${projects.length === 1 ? "project" : "projects"}. Filter by technology to narrow them down.`}
            </p>
          </div>

          <div>
            {apiError && (
              <div className="api-notice" role="alert">
                Can&apos;t reach the API at {API_URL}. Start the NestJS server
                (port 3001) to load your projects and experience.
              </div>
            )}

            {technologies.length > 2 && (
              <div
                className="filters"
                role="group"
                aria-label="Filter projects"
              >
                {technologies.map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    className="filter"
                    aria-pressed={filter === tech}
                    onClick={() => setFilter(tech)}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            )}

            {loading ? (
              <div className="empty-state">Loading projects...</div>
            ) : projects.length === 0 ? (
              <div className="empty-state">
                <Code2 size={28} />
                <h3>No projects yet</h3>
                <p>
                  Add Project records in Prisma Studio and they will show up
                  here.
                </p>
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
                        <span className="featured-label">Featured</span>
                      )}
                      {project.demoUrl && (
                        <span className="live-badge">
                          <span className="live-dot" />
                          Live
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
                            Visit site <ArrowUpRight size={15} />
                          </a>
                        ) : (
                          <span />
                        )}
                        <span className="project-more">
                          Details <ArrowRight size={15} />
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
            <h2>Experience</h2>
            <p>
              Where I&apos;ve worked and what I&apos;ve learned along the way.
            </p>
          </div>

          <div>
            {loading ? (
              <div className="empty-state">Loading experience...</div>
            ) : experiences.length === 0 ? (
              <div className="empty-state">
                <BriefcaseBusiness size={28} />
                <h3>Nothing here yet</h3>
                <p>
                  Add Experience records in Prisma Studio and your timeline will
                  appear here.
                </p>
              </div>
            ) : (
              <div className="timeline" ref={timelineRef}>
                {experiences.map((experience) => (
                  <article className="timeline-item" key={experience.id}>
                    <span className="timeline-marker" />

                    <p className="timeline-date">
                      {formatDate(experience.startDate)}
                      {" – "}
                      {experience.endDate
                        ? formatDate(experience.endDate)
                        : "Present"}
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
            Have an idea?
            <br />
            Let&apos;s build it together.
          </h2>
          <p>
            I&apos;m always happy to talk about technology, creative ideas and
            opportunities to build something meaningful.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href={`mailto:${EMAIL}`}>
              Send an email <Mail size={17} />
            </a>
            <button
              type="button"
              className="button button-secondary"
              onClick={copyEmail}
            >
              {copied ? <Check size={17} /> : <Copy size={17} />}
              {copied ? "Copied" : EMAIL}
            </button>
            <a
              className="button button-secondary"
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
            >
              <GithubIcon size={17} /> GitHub
            </a>
          </div>
          <span className="sr-only" aria-live="polite">
            {copied ? "Email address copied" : ""}
          </span>
        </div>
      </section>

      <footer className="container footer">
        <span>Nutthanun Pengpala</span>
        <a href="#home" className="back-to-top">
          Back to top <ArrowUpRight size={15} />
        </a>
      </footer>
    </main>
  );
}
