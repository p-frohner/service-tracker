import { defineConfig } from "orval";

export default defineConfig({
	"service-tracker-api": {
		input: "../openapi.yaml",
		output: {
			baseUrl: "/api", // we proxy all requests to /api in development
			target: "./src/api.ts",
			client: "react-query",
			httpClient: "fetch",
			override: {
				fetch: {
					includeHttpResponseReturnType: false,
				},
			},
		},
	},
});
