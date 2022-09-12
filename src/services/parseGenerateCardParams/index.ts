import type { GenerateCardParams } from "../../domains/GenerateCardParams";
import {
  toGenerateOccupationParams,
  toGenerateMinorImprovementParams,
} from "../../domains/GenerateCardParams";

export class ValidationError extends Error {}

export const parseGenerateCardParamsFromBody = (
  body: string | null | undefined
): GenerateCardParams => {
  if (body === null || body === undefined) {
    throw new ValidationError("body is undefined");
  }
  const parsedBody = JSON.parse(body);
  switch (parsedBody.cardType) {
    case "occupation":
      return toGenerateOccupationParams(parsedBody);
    case "minorImprovement":
      return toGenerateMinorImprovementParams(parsedBody);
    default:
      throw new ValidationError(`unexpected cardtype: ${parsedBody.cardType ?? "undefined"}`);
  }
};
