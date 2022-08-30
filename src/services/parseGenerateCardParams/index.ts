import type { GenerateCardParams } from "../../domains/GenerateCardParams";
import { toGenerateOccupationParams } from "../../domains/GenerateCardParams";
import type { APIGatewayProxyEventQueryStringParameters } from "aws-lambda";

export class ValidationError extends Error {}

export const parseGenerateCardParamsFromQueryString = (
  queryStringParams: APIGatewayProxyEventQueryStringParameters | null
): GenerateCardParams => {
  if (queryStringParams === null) {
    throw new ValidationError("parameters are undefined");
  }
  switch (queryStringParams.cardType) {
    case "occupation":
      return parseGenerateOccupationParamsFromQueryString(queryStringParams);
    default:
      throw new ValidationError(`unexpected cardtype: ${queryStringParams.cardType}`);
  }
};

const parseGenerateOccupationParamsFromQueryString = (
  queryStringParams: APIGatewayProxyEventQueryStringParameters
) =>
  toGenerateOccupationParams({
    id: queryStringParams.id,
    name: queryStringParams.name,
    description: queryStringParams.description,
    cardType: queryStringParams.cardType,
    minPlayers: queryStringParams.minPlayers ? Number(queryStringParams.minPlayers) : undefined,
    hasBonusSymbol: false,
    mainImage: queryStringParams.mainImage,
  });
