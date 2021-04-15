import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda";
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, "body"> & { body: FromSchema<S> };
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>;

export const formatJSONResponse = (response: Record<string, unknown>): { statusCode: number; body: string } => {
	return {
		statusCode: 200,
		body: JSON.stringify(response),
	};
};

export const formatErrorResponse = (error: Error): { statusCode: number; body: string } => {
	return {
		statusCode: 500,
		body: JSON.stringify(error),
	};
};
