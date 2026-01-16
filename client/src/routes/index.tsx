import { createFileRoute } from "@tanstack/react-router";

import { VehicleManager } from "../components/vehicle/VehicleManager";

export const Route = createFileRoute("/")({
	component: () => <VehicleManager />,
});
