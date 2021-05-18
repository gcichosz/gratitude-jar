import { formatResponse } from "@libs/AWS/apiGateway";
import { uploadGratitudesFile } from "@libs/AWS/s3";
import { generateGratitudesFile } from "@libs/gratitudesFileGenerator";
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

export const main = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
	try {
		const gratitudesFile = generateGratitudesFile(event.body);
		const downloadUrl = await uploadGratitudesFile(gratitudesFile);
		return formatResponse(200, { downloadUrl });
	} catch (error) {
		return formatResponse(500, error);
	}
};
