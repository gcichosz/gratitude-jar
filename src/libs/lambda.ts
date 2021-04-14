import middy from "@middy/core";
import middyCors from "@middy/http-cors";
import middyJsonBodyParser from "@middy/http-json-body-parser";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const middyfy = (handler) => {
	return middy(handler).use(middyCors()).use(middyJsonBodyParser());
};
