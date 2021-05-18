import type { APIGatewayProxyResultV2 } from "aws-lambda";

export const formatResponse = <T>(statusCode: number, response: T): APIGatewayProxyResultV2 => ({
	statusCode,
	headers: {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Credentials": true,
		"Content-Type": "application/json",
		"Access-Control-Allow-Headers": "*",
	},
	body: JSON.stringify(response),
});
