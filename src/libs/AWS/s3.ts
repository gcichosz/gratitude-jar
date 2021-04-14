import { Credentials } from "aws-sdk";
import S3 from "aws-sdk/clients/s3";
import { filesS3Bucket, region } from "config";
import { v4 } from "uuid";

export const uploadGratitudesFile = async (body: S3.Body): Promise<string> => {
	const s3 = new S3({
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
			Body: body,
			ContentType: "text/plain",
			ContentDisposition: 'attachment; filename="wdziecznosci.txt"',
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
