import { z } from "zod";

export const modelFilterSchema = z.object({
  search: z.string().optional().default(""),
  lab: z.string().optional(),
  type: z.string().optional(),
  capability: z.string().optional(), // single or comma-separated
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minContext: z.coerce.number().min(0).optional(),
  maxContext: z.coerce.number().min(0).optional(),
  sort: z
    .enum(["price_asc", "price_desc", "context_desc", "date_desc", "name_asc"])
    .optional()
    .default("date_desc"),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(18),
});

export type ModelFilterInput = z.infer<typeof modelFilterSchema>;
