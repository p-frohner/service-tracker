import { createFileRoute } from "@tanstack/react-router";

import { VehicleManager } from "../components/VehicleManager";

export const Route = createFileRoute("/")({
	component: () => <VehicleManager />,
});
