import { Box, Container, Stack } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";

import { useGetVehicle } from "../api";
import { Route } from "../routes/vehicle-details.$vehicleId";

import { Breadcrumbs } from "./Breadcrumbs";

export const VehicleDetails = () => {
	const navigate = useNavigate();
	const { vehicleId } = Route.useParams();
	const { data: vehicle, error } = useGetVehicle(vehicleId);
	const vehicleName = vehicle ? `${vehicle.make} ${vehicle.model} - ${vehicle.year}` : "";

	if (error?.message === "Invalid ID") {
		navigate({ to: "/" });
		return null;
	}

	return (
		<Container maxWidth="sm">
			<Box p={2}>
				<Breadcrumbs items={[{ label: "Vehicles", url: "/" }, { label: vehicleName }]} />
				<Stack spacing={2} mt={3}>
					<Box>{/* Display maintenance records here */}</Box>
				</Stack>
			</Box>
		</Container>
	);
};
