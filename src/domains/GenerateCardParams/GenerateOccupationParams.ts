import { z } from "zod";

export enum OccupationMinPlayers {
  One = 1,
  Three = 3,
  Four = 4,
  Five = 5,
}

export const generateOccupationParamsSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  description: z.string().min(1),
  cardType: z.literal("occupation"),
  minPlayers: z.nativeEnum(OccupationMinPlayers),
  hasBonusSymbol: z.boolean(),
  mainImage: z.string().optional(),
});

export type GenerateOccupationParams = z.infer<typeof generateOccupationParamsSchema>;

export const toGenerateOccupationParams = (props: unknown) =>
  generateOccupationParamsSchema.parse(props);
