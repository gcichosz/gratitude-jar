import { handlerPath } from "@libs/handlerResolver";
import { config } from "dotenv";

import schema from "./schema";

config();

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	events: [
		{
			http: {
				method: "post",
				path: "/",
				request: {
					schema: {
						"application/json": schema,
					},
				},
			},
		},
	],
	environment: {
		ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
		SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
	},
};
