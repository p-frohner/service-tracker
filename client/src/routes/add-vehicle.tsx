import { createFileRoute } from "@tanstack/react-router";

import { AddVehicle } from "../components/AddVehicle";

export const Route = createFileRoute("/add-vehicle")({
	component: () => <AddVehicle />,
});
