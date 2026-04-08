import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email(),
  company: z.string().max(200).optional(),
  phone: z.string().max(30).optional(),
  message: z.string().min(10).max(5000),
});

export const revalidateSchema = z.object({
  secret: z.string().min(1),
  type: z.enum(["post", "product", "siteSettings"]),
  slug: z.string().min(1).optional(),
});
