import type { AWS } from "@serverless/typescript";

const s3Bucket = "app.sloikwdziecznosci.pl";

const serverlessConfiguration: AWS = {
	service: "gratitude-jar",
	frameworkVersion: "2",
	custom: {
		s3Sync: [
			{
				bucketName: s3Bucket,
				localDir: "/app",
			},
		],
	},
	plugins: ["serverless-s3-sync"],
	provider: {
		name: "aws",
		region: "eu-central-1",
		profile: "personal",
	},
	resources: {
		Resources: {
			// Specifying the S3 Bucket
			WebAppS3Bucket: {
				Type: "AWS::S3::Bucket",
				Properties: {
					BucketName: s3Bucket,
					AccessControl: "PublicRead",
					WebsiteConfiguration: {
						IndexDocument: "index.html",
					},
				},
			},
			// Specifying the policies
			WebAppS3BucketPolicy: {
				Type: "AWS::S3::BucketPolicy",
				Properties: {
					Bucket: {
						Ref: "WebAppS3Bucket",
					},
					PolicyDocument: {
						Statement: {
							Sid: "PublicReadGetObject",
							Effect: "Allow",
							Principal: "*",
							Action: ["s3:GetObject"],
							Resource: `arn:aws:s3:::${s3Bucket}/*`,
						},
					},
				},
			},
		},
	},
};

module.exports = serverlessConfiguration;
