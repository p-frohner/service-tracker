import { Box, Button, Container, ImageList, ImageListItem, Stack } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import {
	getGetVehicleImagesQueryKey,
	getListVehiclesQueryKey,
	useDeleteVehicle,
	useGetVehicle,
	useGetVehicleImages,
} from "../api";
import { useVehicleWebSocket } from "../hooks/useVehicleWebSocket";
import { Route } from "../routes/vehicle-details.$vehicleId";
import { Breadcrumbs } from "./Breadcrumbs";
import { Carousel } from "./Carousel";

export const VehicleDetails = () => {
	const { vehicleId } = Route.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: vehicle } = useGetVehicle(vehicleId);
	const { data: vehicleImages = [] } = useGetVehicleImages(vehicleId);
	const { mutate: deleteVehicle } = useDeleteVehicle({
		mutation: {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: getListVehiclesQueryKey() });
				navigate({ to: "/" });
			},
		},
	});

	const handleImagesReady = useCallback(() => {
		queryClient.invalidateQueries({ queryKey: getGetVehicleImagesQueryKey(vehicleId) });
	}, [queryClient, vehicleId]);

	useVehicleWebSocket(vehicleId, handleImagesReady);

	const vehicleName = vehicle ? `${vehicle.make} ${vehicle.model} - ${vehicle.year}` : "";

	return (
		<Container maxWidth="sm">
			<Stack gap={2} p={2}>
				<Breadcrumbs items={[{ label: "Vehicles", url: "/" }, { label: vehicleName }]} />
				<Carousel images={vehicleImages} />
			</Stack>
			<Box sx={{ py: 3 }}>
				{/* TODO: Need to add confirm dialog for delete */}
				<Button
					type="submit"
					variant="contained"
					color="error"
					fullWidth
					size="large"
					onClick={() => {
						deleteVehicle({ vehicleId });
					}}
				>
					Delete Vehicle
				</Button>
			</Box>
		</Container>
	);
};
