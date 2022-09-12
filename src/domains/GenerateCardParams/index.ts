import type { GenerateOccupationParams } from "./GenerateOccupationParams";
import type { GenerateMinorImprovementParams } from "./GenerateMinorImprovementParams";

export type { GenerateOccupationParams, GenerateMinorImprovementParams };
export type GenerateCardParams = GenerateOccupationParams | GenerateMinorImprovementParams;

export { toGenerateOccupationParams } from "./GenerateOccupationParams";
export { toGenerateMinorImprovementParams } from "./GenerateMinorImprovementParams";
