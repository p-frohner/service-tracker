import { Box, Button, Container, ImageList, ImageListItem, Stack } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
	getListVehiclesQueryKey,
	useDeleteVehicle,
	useGetVehicle,
	useGetVehicleImages,
} from "../api";
import { Route } from "../routes/vehicle-details.$vehicleId";
import { Breadcrumbs } from "./Breadcrumbs";

export const VehicleDetails = () => {
	const { vehicleId } = Route.useParams();

	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { data: vehicle, error } = useGetVehicle(vehicleId);
	const { data: vehicleImages = [] } = useGetVehicleImages(vehicleId);
	const { mutate: deleteVehicle } = useDeleteVehicle({
		mutation: {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: getListVehiclesQueryKey() });
				navigate({ to: "/" });
			},
		},
	});
	const vehicleName = vehicle ? `${vehicle.make} ${vehicle.model} - ${vehicle.year}` : "";

	return (
		<Container maxWidth="sm">
			<Box p={2}>
				<Breadcrumbs items={[{ label: "Vehicles", url: "/" }, { label: vehicleName }]} />
				{vehicleImages.length > 0 && (
					<Stack spacing={2} mt={3}>
						<Box>
							<Box sx={{ width: "sm", height: 350, overflowY: "scroll" }}>
								<ImageList variant="masonry" cols={3} gap={8}>
									{vehicleImages.map((image) => (
										<ImageListItem key={image.filename}>
											<img
												src={`${import.meta.env.VITE_API_URL}${image.filename}`}
												alt={vehicleName}
												loading="lazy"
											/>
										</ImageListItem>
									))}
								</ImageList>
							</Box>
						</Box>
					</Stack>
				)}
			</Box>
			<Box sx={{ py: 3 }}>
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
