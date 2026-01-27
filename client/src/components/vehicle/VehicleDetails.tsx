import {
	Box,
	Button,
	Container,
	DialogActions,
	DialogContent,
	DialogTitle,
	Stack,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { getListVehiclesQueryKey, useDeleteVehicle, useGetVehicle } from "../../api";
import { useVehicleImages } from "../../hooks/useVehicleImages";
import { Route } from "../../routes/vehicle-details.$vehicleId";
import { Breadcrumbs } from "../Breadcrumbs";
import { Carousel } from "../Carousel";
import { Dialog, useDialog } from "../Dialog";
import { AddMaintenanceRecord } from "./AddMaintenanceRecord";
import { MaintenanceRecordList } from "./MaintenanceRecordList";

export const VehicleDetails = () => {
	const { vehicleId } = Route.useParams();
	const deleteDialog = useDialog();
	const addMaintenanceRecordDialog = useDialog();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: vehicle } = useGetVehicle(vehicleId);
	const { images, isDownloading, downloadImages, error } = useVehicleImages(vehicleId);
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
		<Container maxWidth="md">
			<Stack gap={2} p={2}>
				<Breadcrumbs items={[{ label: "Vehicles", url: "/" }, { label: vehicleName }]} />
				<Carousel
					images={images}
					onDownloadImages={downloadImages}
					isDownloading={isDownloading}
					error={error}
				/>
				<Box textAlign="right" py={2}>
					<Button
						variant="contained"
						size="large"
						onClick={(ev) => {
							addMaintenanceRecordDialog.open(ev);
						}}
					>
						Add Maintenance Record
					</Button>
				</Box>
				<MaintenanceRecordList vehicleId={vehicleId} />
			</Stack>
			<Box sx={{ py: 3 }}>
				<Button
					type="submit"
					variant="contained"
					color="error"
					fullWidth
					size="large"
					onClick={deleteDialog.open}
				>
					Delete Vehicle
				</Button>
				<Dialog
					open={deleteDialog.isOpen}
					anchorEl={deleteDialog.anchorEl}
					onClose={deleteDialog.close}
				>
					<DialogTitle>Are you sure?</DialogTitle>
					<DialogActions sx={{ px: 3, pb: 3 }}>
						<Button onClick={() => deleteDialog.close()} variant="outlined" fullWidth>
							Close
						</Button>
						<Button
							variant="contained"
							onClick={() => {
								deleteVehicle({ vehicleId });
								deleteDialog.close();
							}}
							fullWidth
						>
							Yes
						</Button>
					</DialogActions>
				</Dialog>
				<Dialog
					open={addMaintenanceRecordDialog.isOpen}
					anchorEl={addMaintenanceRecordDialog.anchorEl}
					onClose={addMaintenanceRecordDialog.close}
				>
					<DialogTitle>New Maintenance</DialogTitle>
					<DialogContent>
						<AddMaintenanceRecord
							onSubmit={() => {
								addMaintenanceRecordDialog.close();
							}}
						/>
					</DialogContent>
				</Dialog>
			</Box>
		</Container>
	);
};
