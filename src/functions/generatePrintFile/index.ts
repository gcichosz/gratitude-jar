import { handlerPath } from "@libs/handlerResolver";

import schema from "./schema";

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
				cors: true,
			},
		},
	],
};
