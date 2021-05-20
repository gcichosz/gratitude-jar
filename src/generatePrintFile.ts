import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

import { formatResponse } from "../lib/AWS/apiGateway";
import { uploadGratitudesFile } from "../lib/AWS/s3";
import { generateGratitudesFile } from "../lib/gratitudesFileGenerator";

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
	try {
		const gratitudesFile = generateGratitudesFile(event.body);
		const downloadUrl = await uploadGratitudesFile(gratitudesFile);
		return formatResponse(200, downloadUrl);
	} catch (error) {
		return formatResponse(500, error);
	}
};
