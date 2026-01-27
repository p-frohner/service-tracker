import { createFileRoute } from "@tanstack/react-router";

import { EditVehicle } from "../components/vehicle/EditVehicle";

export const Route = createFileRoute("/edit-vehicle/$vehicleId")({
	component: () => <EditVehicle />,
});
