import { z } from "zod";

export const seoZodSchema = z.object({
  metaTitle: z.string().optional().default(""),
  metaDescription: z.string().optional().default(""),
  focusKeyword: z.string().optional().default(""),
  canonicalUrl: z.string().optional().default(""),
  ogTitle: z.string().optional().default(""),
  ogDescription: z.string().optional().default(""),
  ogImage: z.string().optional().default(""),
  noindex: z.boolean().optional().default(false),
  nofollow: z.boolean().optional().default(false),
}).optional().default({});

export const loginZodSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const postZodSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().optional(),
  excerpt: z.string().optional().default(""),
  content: z.string().min(1, "Content is required"),
  featuredImage: z.object({
    url: z.string().optional().default(""),
    alt: z.string().optional().default(""),
  }).optional().default({ url: "", alt: "" }),
  category: z.string().optional().default("General"),
  tags: z.array(z.string()).optional().default([]),
  status: z.enum(["draft", "published", "scheduled"]).optional().default("draft"),
  publishedAt: z.string().datetime().optional().nullable().or(z.date().optional().nullable()),
  seo: seoZodSchema,
});

export const postUpdateZodSchema = postZodSchema.partial();

export const jobZodSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().optional(),
  department: z.string().min(1, "Department is required"),
  location: z.string().optional().default("Baddi, Himachal Pradesh"),
  employmentType: z.enum(["Full-time", "Part-time", "Contract", "Internship"]).optional().default("Full-time"),
  experience: z.string().min(1, "Experience requirement is required"),
  salaryRange: z.string().optional().default(""),
  description: z.string().min(1, "Description is required"),
  responsibilities: z.array(z.string()).optional().default([]),
  requirements: z.array(z.string()).optional().default([]),
  applyByDate: z.string().datetime().optional().nullable().or(z.date().optional().nullable()),
  status: z.enum(["open", "closed", "draft"]).optional().default("open"),
  seo: seoZodSchema,
});

export const jobUpdateZodSchema = jobZodSchema.partial();

export const pageZodSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().optional(),
  content: z.any().optional().default(""),
  seo: seoZodSchema,
});

export const pageUpdateZodSchema = pageZodSchema.partial();

export const applicationZodSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Valid phone number is required"),
  coverNote: z.string().optional().default(""),
});

