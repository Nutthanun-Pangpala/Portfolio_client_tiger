import { cache } from "react";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

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
};

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