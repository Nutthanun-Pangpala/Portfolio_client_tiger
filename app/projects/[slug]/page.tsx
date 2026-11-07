import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProjectDetail, { ProjectLoading } from "../../components/ProjectDetail";
import SiteNav from "../../components/Sitenav";
import { getProject } from "../../lib/api";

type Props = {
  params: Promise<{ slug: string }>;
};

// Static on purpose: fetching data here would block prerendering.
export const metadata: Metadata = {
  title: "Project | Nutthanun Pengpala",
};

// The page shell (nav + loading state) is prerendered; `params` and the
// project data are read at request time inside <Suspense> and streamed in.
export default function ProjectPage({ params }: Props) {
  return (
    <main>
      <SiteNav />

      <Suspense fallback={<ProjectLoading />}>
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

  return <ProjectDetail project={project} />;
}