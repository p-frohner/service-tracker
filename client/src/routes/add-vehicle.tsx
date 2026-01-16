import { createFileRoute } from "@tanstack/react-router";

import { AddVehicle } from "../components/vehicle/AddVehicle";

export const Route = createFileRoute("/add-vehicle")({
	component: () => <AddVehicle />,
});
