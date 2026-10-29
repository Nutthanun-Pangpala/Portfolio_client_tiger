import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import GithubIcon from "../../components/GithubIcon";
import ProjectGallery from "../../components/ProjectGallery";
import SiteNav from "../../components/Sitenav";
import { galleryOf, getProject } from "../../lib/api";

type Props = {
  params: Promise<{ slug: string }>;
};

// Static on purpose: fetching data here would block prerendering.
export const metadata: Metadata = {
  title: "Project | Nutthanun Pengpala",
};

// The page shell (nav + loading state) is prerendered; the project data is
// fetched at request time inside <Suspense> and streamed in.
export default function ProjectPage({ params }: Props) {
  return (
    <main>
      <SiteNav />

      <Suspense
        fallback={
          <div className="container detail">
            <div className="empty-state">Loading project...</div>
          </div>
        }
      >
        <ProjectContent params={params} />
      </Suspense>
    </main>
  );
}

async function ProjectContent({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const images = galleryOf(project);
  const paragraphs = project.description
    .split(/\n{2,}/)
    .map((text) => text.trim())
    .filter(Boolean);

  return (
    <div className="container detail">
      <Link href="/#projects" className="back-link">
        <ArrowLeft size={16} /> All projects
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
              Visit live site <ArrowUpRight size={17} />
            </a>
          )}
          {project.githubUrl && (
            <a
              className="button button-secondary"
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              <GithubIcon size={17} /> Source code
            </a>
          )}
        </div>
      )}

      <ProjectGallery images={images} title={project.title} />

      <div className="detail-body">
        <div className="detail-text">
          <h2>About this project</h2>
          {paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>

        <dl className="detail-meta">
          {project.role && (
            <div>
              <dt>Role</dt>
              <dd>{project.role}</dd>
            </div>
          )}
          <div>
            <dt>Tech stack</dt>
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