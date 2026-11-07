export type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  role: string | null;
  imageUrl: string | null;
  images: string[];
  demoUrl: string | null;
  githubUrl: string | null;
  technologies: string[];
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Experience = {
  id: string;
  company: string;
  position: string;
  employmentType: string | null;
  description: string;
  startDate: string;
  endDate: string | null;
  technologies: string[];
  isPublished: boolean;
};
