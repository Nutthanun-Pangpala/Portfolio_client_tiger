"use client";

import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { galleryOf, localizeProject, type Project } from "../lib/api";
import { useLang } from "../lib/i18n";
import GithubIcon from "./GithubIcon";
import ProjectGallery from "./ProjectGallery";

export function ProjectLoading() {
  const { t } = useLang();
  return (
    <div className="container detail">
      <div className="empty-state">{t.detail.loading}</div>
    </div>
  );
}

// Receives the raw project (English + Thai fields) from the server page and
// picks the right language here, so switching language needs no refetch.
export default function ProjectDetail({ project: raw }: { project: Project }) {
  const { lang, t } = useLang();

  const project = localizeProject(raw, lang);
  const images = galleryOf(project);
  const paragraphs = project.description
    .split(/\n{2,}/)
    .map((text) => text.trim())
    .filter(Boolean);

  return (
    <div className="container detail">
      <Link href="/#projects" className="back-link">
        <ArrowLeft size={16} /> {t.detail.back}
      </Link>

      <h1 className="detail-title">{project.title}</h1>

      {(project.demoUrl || project.githubUrl) && (
        <div className="detail-actions">
          {project.demoUrl && (
            <a
              className="button button-primary"
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
            >
              {t.detail.visitLive} <ArrowUpRight size={17} />
            </a>
          )}
          {project.githubUrl && (
            <a
              className="button button-secondary"
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              <GithubIcon size={17} /> {t.detail.sourceCode}
            </a>
          )}
        </div>
      )}

      <ProjectGallery images={images} title={project.title} />

      <div className="detail-body">
        <div className="detail-text">
          <h2>{t.detail.aboutProject}</h2>
          {paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>

        <dl className="detail-meta">
          {project.role && (
            <div>
              <dt>{t.detail.role}</dt>
              <dd>{project.role}</dd>
            </div>
          )}
          <div>
            <dt>{t.detail.techStack}</dt>
            <dd>
              <ul className="chips">
                {project.technologies.map((technology) => (
                  <li className="chip" key={technology}>
                    {technology}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}