import { Container } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { getListVehiclesQueryKey, useCreateVehicle } from "../../api";
import { Breadcrumbs } from "../Breadcrumbs";
import { VehicleForm, type VehicleFormValues } from "./VehicleForm";

export const AddVehicle = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { mutate, isPending } = useCreateVehicle({
		mutation: {
			onSuccess: (vehicle) => {
				queryClient.invalidateQueries({ queryKey: getListVehiclesQueryKey() });
				navigate({ to: "/vehicle-details/$vehicleId", params: { vehicleId: vehicle.id } });
			},
		},
	});

	const handleSubmit = (data: VehicleFormValues) => {
		mutate({ data });
	};

	return (
		<Container maxWidth="sm" sx={{ p: 2 }}>
			<Breadcrumbs items={[{ label: "Vehicles", url: "/" }, { label: "Add vehicle" }]} />
			<VehicleForm
				defaultValues={{ make: "", model: "", year: 2013 }}
				onSubmit={handleSubmit}
				isPending={isPending}
				submitLabel="Submit"
			/>
		</Container>
	);
};
