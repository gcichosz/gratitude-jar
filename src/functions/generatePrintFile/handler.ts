import "source-map-support/register";

import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { Credentials } from "aws-sdk";
import * as AWS from "aws-sdk";
import { filesS3Bucket, region } from "config";
import { v4 } from "uuid";

import schema from "./schema";

const generatePrintFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
	const s3 = new AWS.S3({
		region: region,
		credentials: new Credentials({
			accessKeyId: process.env.ACCESS_KEY_ID,
			secretAccessKey: process.env.SECRET_ACCESS_KEY,
		}),
	});

	const fileKey = `${v4()}.txt`;
	await s3
		.upload({
			Bucket: filesS3Bucket,
			Key: fileKey,
			Body: event.body.gratitudes,
			ContentType: "text/plain",
		})
		.promise();

	const expiry = new Date();
	expiry.setHours(expiry.getHours() + 1);
	const downloadUrl = await s3.getSignedUrlPromise("getObject", {
		Bucket: filesS3Bucket,
		Key: fileKey,
		ResponseExpires: expiry,
	});

	return formatJSONResponse({ downloadUrl });
};

export const main = middyfy(generatePrintFile);
