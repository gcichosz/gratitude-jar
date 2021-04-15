import "source-map-support/register";

import { formatErrorResponse, formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { uploadGratitudesFile } from "@libs/AWS/s3";
import { middyfy } from "@libs/lambda";

import schema from "./schema";

const generatePrintFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
	try {
		const downloadUrl = await uploadGratitudesFile(event.body.gratitudes);
		return formatJSONResponse({ downloadUrl });
	} catch (error) {
		return formatErrorResponse(error);
	}
};

export const main = middyfy(generatePrintFile);
