import {
	MutationCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { routeTree } from "./routeTree.gen"; // This file is auto-generated

const router = createRouter({ routeTree });

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
		},
	},
	mutationCache: new MutationCache({
		onError: (error) => {
			console.error("Mutation error:", error.message);
		},
	}),
});

const root = document.getElementById("root");

if (!root) {
	throw new Error("Failed to find the root element");
}

createRoot(root).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	</StrictMode>,
);
