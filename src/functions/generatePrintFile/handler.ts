import "source-map-support/register";

import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";

import schema from "./schema";
import { Credentials } from "aws-sdk";
import { v4 } from "uuid";
import * as AWS from "aws-sdk";
import { filesS3Bucket, region } from "config";

const generatePrintFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
	const s3 = new AWS.S3({
		region: region,
		credentials: new Credentials({
			accessKeyId: process.env.ACCESS_KEY_ID,
			secretAccessKey: process.env.SECRET_ACCESS_KEY,
		}),
	});
	await s3
		.upload({
			Bucket: filesS3Bucket,
			Key: `${v4()}.txt`,
			Body: event.body.gratitudes,
			ContentType: "text/plain",
		})
		.promise();
	return formatJSONResponse({ gratitudes: event.body.gratitudes.split("\n").toString() });
};

export const main = middyfy(generatePrintFile);
