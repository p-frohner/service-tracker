import { Box, Button, Container, DialogActions, DialogTitle, Stack } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import {
	getGetVehicleImagesQueryKey,
	getListVehiclesQueryKey,
	useDeleteVehicle,
	useGetVehicle,
	useGetVehicleImages,
} from "../../api";
import { useVehicleWebSocket } from "../../hooks/useVehicleWebSocket";
import { Route } from "../../routes/vehicle-details.$vehicleId";
import { Breadcrumbs } from "../Breadcrumbs";
import { Carousel } from "../Carousel";
import { Dialog, useDialog } from "../Dialog";

export const VehicleDetails = () => {
	const { vehicleId } = Route.useParams();
	const { isOpen, anchorEl, open, close } = useDialog();
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
				<Button
					type="submit"
					variant="contained"
					color="error"
					fullWidth
					size="large"
					onClick={open}
				>
					Delete Vehicle
				</Button>
				<Dialog open={isOpen} anchorEl={anchorEl} onClose={close}>
					<DialogTitle>Are you sure?</DialogTitle>
					<DialogActions sx={{ px: 3, pb: 3 }}>
						<Button onClick={close} variant="outlined" fullWidth>
							Close
						</Button>
						<Button
							variant="contained"
							onClick={() => {
								deleteVehicle({ vehicleId });
								close();
							}}
							fullWidth
						>
							Yes
						</Button>
					</DialogActions>
				</Dialog>
			</Box>
		</Container>
	);
};
