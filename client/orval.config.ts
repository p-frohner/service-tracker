import { defineConfig } from "orval";

export default defineConfig({
	"service-tracker-api": {
		input: "../openapi.yaml",
		output: {
			baseUrl: "http://localhost:8080",
			target: "./src/api.ts",
			client: "react-query",
			httpClient: "fetch",
			override: {
				fetch: {
					includeHttpResponseReturnType: false,
				},
				mutator: {
					path: "./src/custom-fetch.ts",
					name: "customFetch",
				},
			},
		},
	},
});
