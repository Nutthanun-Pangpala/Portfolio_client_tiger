import { cache } from "react";
import type { Lang } from "./dictionary";

export const API_URL =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5555";

export type Project = {
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
  // Thai versions. Empty / null means "fall back to English".
  titleTh?: string | null;
  descriptionTh?: string | null;
  roleTh?: string | null;
};

export type Experience = {
  id: string;
  company: string;
  position: string;
  employmentType?: string | null;
  description: string;
  startDate: string;
  endDate?: string | null;
  technologies: string[];
  companyTh?: string | null;
  positionTh?: string | null;
  employmentTypeTh?: string | null;
  descriptionTh?: string | null;
};

// Thai value if we are in Thai and it is filled in, otherwise the English one.
function pick(lang: Lang, en: string, th?: string | null): string {
  return lang === "th" && th && th.trim() ? th : en;
}

function pickOptional(
  lang: Lang,
  en?: string | null,
  th?: string | null,
): string | null {
  return lang === "th" && th && th.trim() ? th : (en ?? null);
}

export function localizeProject(project: Project, lang: Lang): Project {
  return {
    ...project,
    title: pick(lang, project.title, project.titleTh),
    description: pick(lang, project.description, project.descriptionTh),
    role: pickOptional(lang, project.role, project.roleTh),
  };
}

export function localizeExperience(
  experience: Experience,
  lang: Lang,
): Experience {
  return {
    ...experience,
    company: pick(lang, experience.company, experience.companyTh),
    position: pick(lang, experience.position, experience.positionTh),
    employmentType: pickOptional(
      lang,
      experience.employmentType,
      experience.employmentTypeTh,
    ),
    description: pick(lang, experience.description, experience.descriptionTh),
  };
}

// Cover image for cards: the explicit cover, otherwise the first gallery image.
export function coverOf(project: Project) {
  return project.imageUrl ?? project.images?.[0] ?? null;
}

// Every image of a project for the gallery (cover first, no duplicates).
export function galleryOf(project: Project) {
  const all = [project.imageUrl, ...(project.images ?? [])].filter(
    (src): src is string => Boolean(src),
  );
  return Array.from(new Set(all));
}

// Uses the existing GET /projects endpoint, so no backend change is needed.
// Wrapped in cache() so the page and its metadata share one request.
export const getProject = cache(async (slug: string) => {
  const response = await fetch(`${API_URL}/projects`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Unable to load projects");
  }

  const projects: Project[] = await response.json();
  return projects.find((project) => project.slug === slug) ?? null;
});