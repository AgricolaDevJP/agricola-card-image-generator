import type { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { ZodError } from "zod";
import type { GenerateCardParams } from "./domains/GenerateCardParams";
import { parseGenerateCardParamsFromQueryString } from "./services/parseGenerateCardParams";
import { ValidationError } from "./types/Validation";
import { CardImageGenerator } from "./services/CardImageGenerator";
import { CardHtmlGenerator, CardHtmlGeneratorImpl } from "./services/CardHtmlGenerator";

let cardHtmlGenerator: CardHtmlGenerator | undefined;
let cardImageGenerator: CardImageGenerator | undefined;

export const handler = async (
  event: APIGatewayEvent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: Context
): Promise<APIGatewayProxyResult> => {
  let params: GenerateCardParams | undefined;
  try {
    params = parseGenerateCardParamsFromQueryString(event.queryStringParameters);
  } catch (error) {
    if (error instanceof ZodError || error instanceof ValidationError) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error }),
      };
    }
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error }),
    };
  }

  if (cardHtmlGenerator === undefined) {
    cardHtmlGenerator = new CardHtmlGeneratorImpl();
  }

  const html = await cardHtmlGenerator.generate(params);

  let image: string | undefined;
  try {
    if (cardImageGenerator === undefined) {
      cardImageGenerator = await CardImageGenerator.newCardImageGenerator();
    }
    image = await cardImageGenerator.generate(html);
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error }),
    };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "image/png" },
    body: image,
    isBase64Encoded: true,
  };
};
