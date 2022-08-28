import type { APIGatewayProxyEventQueryStringParameters } from "aws-lambda";
import type { GenerateCardParams } from "../../domains/GenerateCardParams";
import { ValidationError } from "../../types/Validation";
import { toGenerateOccupationParams } from "../../domains/GenerateCardParams";

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
