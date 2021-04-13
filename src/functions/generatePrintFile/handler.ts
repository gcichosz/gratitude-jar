import "source-map-support/register";

import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { uploadGratitudesFile } from "@libs/AWS/s3";
import { middyfy } from "@libs/lambda";

import schema from "./schema";

const generatePrintFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
	const downloadUrl = await uploadGratitudesFile(event.body.gratitudes);
	return formatJSONResponse({ downloadUrl });
};

export const main = middyfy(generatePrintFile);
