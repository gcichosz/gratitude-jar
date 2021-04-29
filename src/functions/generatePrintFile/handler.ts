import "source-map-support/register";

import { formatErrorResponse, formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { uploadGratitudesFile } from "@libs/AWS/s3";
import { generateGratitudesFile } from "@libs/gratitudesFileGenerator";
import { middyfy } from "@libs/lambda";

import schema from "./schema";

const generatePrintFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
	try {
		const gratitudesFile = generateGratitudesFile(event.body.gratitudes);
		const downloadUrl = await uploadGratitudesFile(gratitudesFile);
		return formatJSONResponse({ downloadUrl });
	} catch (error) {
		return formatErrorResponse(error);
	}
};

export const main = middyfy(generatePrintFile);
