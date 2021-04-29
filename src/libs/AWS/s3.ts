import { Credentials } from "aws-sdk";
import S3 from "aws-sdk/clients/s3";
import { filesS3Bucket, region } from "config";
import type { Readable } from "stream";
import { v4 } from "uuid";

export const uploadGratitudesFile = async (fileStream: Readable): Promise<string> => {
	const s3 = new S3({
		region: region,
		credentials: new Credentials({
			accessKeyId: process.env.ACCESS_KEY_ID,
			secretAccessKey: process.env.SECRET_ACCESS_KEY,
		}),
	});

	const fileKey = `${v4()}.pdf`;
	await s3
		.upload({
			Bucket: filesS3Bucket,
			Key: fileKey,
			Body: fileStream,
			ContentType: "application/pdf",
			ContentDisposition: `attachment; filename="wdziecznosci.pdf"`,
		})
		.promise();

	const expiry = new Date();
	expiry.setHours(expiry.getHours() + 1);
	return await s3.getSignedUrlPromise("getObject", {
		Bucket: filesS3Bucket,
		Key: fileKey,
		ResponseExpires: expiry,
	});
};
