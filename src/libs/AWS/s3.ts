import { Endpoint } from "aws-sdk";
import S3 from "aws-sdk/clients/s3";
import type { Readable } from "stream";
import { v4 } from "uuid";

const s3ClientDevelopmentConfiguration = {
	s3ForcePathStyle: true,
	accessKeyId: "S3RVER",
	secretAccessKey: "S3RVER",
	endpoint: new Endpoint("http://localhost:4569"),
};
const s3 = process.env.NODE_ENV === "development" ? new S3(s3ClientDevelopmentConfiguration) : new S3();

export const uploadGratitudesFile = async (fileStream: Readable): Promise<string> => {
	const fileKey = `${v4()}.pdf`;
	await s3
		.upload({
			Bucket: process.env.FILES_BUCKET,
			Key: fileKey,
			Body: fileStream,
			ContentType: "application/pdf",
			ContentDisposition: `attachment; filename="wdziecznosci.pdf"`,
		})
		.promise();

	const expiry = new Date();
	expiry.setHours(expiry.getHours() + 1);
	return await s3.getSignedUrlPromise("getObject", {
		Bucket: process.env.FILES_BUCKET,
		Key: fileKey,
		ResponseExpires: expiry,
	});
};
