import S3 from "aws-sdk/clients/s3";
import type { Readable } from "stream";
import { v4 } from "uuid";

export const uploadGratitudesFile = async (fileStream: Readable): Promise<string> => {
	const s3 = new S3();

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
