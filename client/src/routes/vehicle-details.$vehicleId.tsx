import { createFileRoute } from "@tanstack/react-router";

import { VehicleDetails } from "../components/vehicle/VehicleDetails";

export const Route = createFileRoute("/vehicle-details/$vehicleId")({
	component: () => <VehicleDetails />,
});
