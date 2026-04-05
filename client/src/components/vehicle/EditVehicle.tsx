import { Box, CircularProgress, Container } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { getGetVehicleQueryKey, getListVehiclesQueryKey, useGetVehicle, useUpdateVehicle } from "../../api";
import { Route } from "../../routes/edit-vehicle.$vehicleId";
import { Breadcrumbs } from "../Breadcrumbs";
import { VehicleForm, type VehicleFormValues } from "./VehicleForm";

export const EditVehicle = () => {
	const { vehicleId } = Route.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: vehicle, isLoading } = useGetVehicle(vehicleId);
	const { mutate, isPending } = useUpdateVehicle({
		mutation: {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: getListVehiclesQueryKey() });
				queryClient.invalidateQueries({ queryKey: getGetVehicleQueryKey(vehicleId) });
				navigate({ to: "/vehicle-details/$vehicleId", params: { vehicleId } });
			},
		},
	});

	const handleSubmit = (data: VehicleFormValues) => {
		mutate({ vehicleId, data });
	};

	if (isLoading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
				<CircularProgress />
			</Box>
		);
	}

	if (!vehicle) {
		return null;
	}

	const vehicleName = `${vehicle.make} ${vehicle.model} - ${vehicle.year}`;

	return (
		<Container maxWidth="sm" sx={{ p: 2 }}>
			<Breadcrumbs
				items={[
					{ label: "Vehicles", url: "/" },
					{ label: vehicleName, url: `/vehicle-details/${vehicleId}` },
					{ label: "Edit" },
				]}
			/>
			<VehicleForm
				defaultValues={{ make: vehicle.make, model: vehicle.model, year: vehicle.year }}
				onSubmit={handleSubmit}
				isPending={isPending}
				submitLabel="Save"
			/>
		</Container>
	);
};
