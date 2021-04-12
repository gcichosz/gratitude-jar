import type { AWS } from "@serverless/typescript";

import generatePrintFile from "@functions/generatePrintFile";

const appS3Bucket = "app.sloikwdziecznosci.pl";
const filesS3Bucket = "files.sloikwdziecznosci.pl";

const serverlessConfiguration: AWS = {
	service: "gratitude-jar",
	frameworkVersion: "2",
	custom: {
		s3Sync: [
			{
				bucketName: appS3Bucket,
				localDir: "/app",
			},
		],
		webpack: {
			webpackConfig: "./webpack.config.js",
			includeModules: true,
		},
	},
	plugins: ["serverless-s3-sync", "serverless-webpack", "serverless-offline"],
	provider: {
		name: "aws",
		region: "eu-central-1",
		profile: "personal",
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true,
		},
		environment: {
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
		},
		lambdaHashingVersion: "20201221",
	},
	// import the function via paths
	functions: { generatePrintFile },
	resources: {
		Resources: {
			WebAppS3Bucket: {
				Type: "AWS::S3::Bucket",
				Properties: {
					BucketName: appS3Bucket,
					AccessControl: "PublicRead",
					WebsiteConfiguration: {
						IndexDocument: "index.html",
					},
				},
			},
			GratitudeFilesS3Bucket: {
				Type: "AWS::S3::Bucket",
				Properties: {
					BucketName: filesS3Bucket,
					AccessControl: "Private",
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
							Resource: `arn:aws:s3:::${appS3Bucket}/*`,
						},
					},
				},
			},
		},
	},
};

module.exports = serverlessConfiguration;
