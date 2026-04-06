export type ProductStatus = "prototype" | "in-development" | "released" | "concept";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: string[];
  techStack: string[];
  status: ProductStatus;
  links: {
    github?: string;
    demo?: string;
    website?: string;
    download?: string;
  };
  features: string[];
  dateCreated: string;
  order: number;
  gradient: string; // CSS gradient for card visual
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  readingTime: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  company?: string;
}
