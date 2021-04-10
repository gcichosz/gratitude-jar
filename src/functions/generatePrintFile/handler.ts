import "source-map-support/register";

import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";

import schema from "./schema";

const generatePrintFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
	return formatJSONResponse({ gratitudes: event.body.gratitudes.split("\n").toString() });
};

export const main = middyfy(generatePrintFile);
