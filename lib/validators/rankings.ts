import { z } from "zod";

export const rankingsQuerySchema = z.object({
  benchmark: z.string().optional().default("overall"),
  category: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
});

export type RankingsQueryInput = z.infer<typeof rankingsQuerySchema>;
