import { z } from "zod";

export const searchQuerySchema = z.object({
  q: z.string().min(1, "Search query must not be empty"),
  limit: z.coerce.number().int().min(1).max(20).optional().default(8),
});

export type SearchQueryInput = z.infer<typeof searchQuerySchema>;
