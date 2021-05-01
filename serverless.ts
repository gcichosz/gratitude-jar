import generatePrintFile from "@functions/generatePrintFile";
import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
	service: "gratitude-jar",
	frameworkVersion: "2",
	custom: {
		s3: {
			host: "localhost",
			directory: "./.buckets",
		},
		s3Sync: [
			{
				bucketName: "${self:provider.environment.APP_BUCKET}",
				localDir: "/app",
			},
		],
		remover: {
			buckets: ["${self:provider.environment.FILES_BUCKET}"],
		},
		webpack: {
			webpackConfig: "./webpack.config.js",
			includeModules: true,
		},
	},
	plugins: [
		"serverless-s3-sync",
		"serverless-s3-remover",
		"serverless-webpack",
		"serverless-s3-local",
		"serverless-offline",
	],
	provider: {
		name: "aws",
		region: "eu-central-1",
		profile: "gratitude-jar",
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true,
		},
		environment: {
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
			FILES_BUCKET: "files.sloikwdziecznosci.pl",
			APP_BUCKET: "app.sloikwdziecznosci.pl",
			COLUMNS: "3",
			ROWS: "10",
			FONT_SIZE: "16",
			DRAW_GRID: "false",
			LONG_LINE_THRESHOLD: "35",
		},
		lambdaHashingVersion: "20201221",
		iamRoleStatements: [
			{
				Effect: "Allow",
				Action: [
					"s3:GetObject",
					"s3:GetObjectAcl",
					"s3:PutObject",
					"s3:PutObjectAcl",
					"s3:DeleteObject",
					"s3:GetSignedUrl",
				],
				Resource: "*",
			},
		],
	},
	// import the function via paths
	functions: { generatePrintFile },
	resources: {
		Resources: {
			WebAppS3Bucket: {
				Type: "AWS::S3::Bucket",
				Properties: {
					BucketName: "${self:provider.environment.APP_BUCKET}",
					AccessControl: "PublicRead",
					WebsiteConfiguration: {
						IndexDocument: "index.html",
					},
				},
			},
			GratitudeFilesS3Bucket: {
				Type: "AWS::S3::Bucket",
				Properties: {
					BucketName: "${self:provider.environment.FILES_BUCKET}",
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
							Resource: "arn:aws:s3:::${self:provider.environment.APP_BUCKET}/*",
						},
					},
				},
			},
		},
	},
};

module.exports = serverlessConfiguration;
