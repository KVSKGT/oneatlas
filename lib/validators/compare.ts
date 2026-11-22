import { z } from "zod";

export const compareQuerySchema = z.object({
  models: z
    .string()
    .min(1, "At least two models must be specified")
    .transform((str) => str.split(",").map((s) => s.trim()).filter(Boolean))
    .refine((arr) => arr.length >= 2 && arr.length <= 4, {
      message: "Comparison requires between 2 and 4 models",
    }),
});

export type CompareQueryInput = z.infer<typeof compareQuerySchema>;
