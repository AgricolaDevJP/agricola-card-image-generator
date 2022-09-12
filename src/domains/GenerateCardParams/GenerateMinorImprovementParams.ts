import { z } from "zod";

export const generateMinorImprovementParamsSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  description: z.string().min(1),
  prerequisite: z.string().optional(),
  cardType: z.literal("minorImprovement"),
  hasBonusSymbol: z.boolean(),
  mainImage: z.string().optional(),
});

export type GenerateMinorImprovementParams = z.infer<typeof generateMinorImprovementParamsSchema>;

export const toGenerateMinorImprovementParams = (props: unknown) =>
  generateMinorImprovementParamsSchema.parse(props);
