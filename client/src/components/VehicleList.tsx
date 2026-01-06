import { Box, CircularProgress, Grid, Typography } from "@mui/material";

import { useGetVehicles, type Vehicle } from "../api";
import { VehicleCard } from "./VehicleCard"; // Assuming you saved it here

export const VehicleList = ({
	onSelect,
}: {
	onSelect: (vehicle: Vehicle) => void;
}) => {
	const { data: vehicles, isLoading, error } = useGetVehicles();

	if (isLoading) {
		return (
			<Box sx={{ display: "flex" }}>
				<CircularProgress color="primary" />
				<Typography sx={{ ml: 2 }}>Checking the garage...</Typography>
			</Box>
		);
	}

	if (error) {
		return (
			<Typography color="error">
				Error loading vehicles. Is the Go server running?
			</Typography>
		);
	}

	if (!vehicles || vehicles?.length === 0) {
		return (
			<Box
				sx={{
					textAlign: "center",
					mt: 10,
					p: 4,
					border: "2px dashed #ccc",
					borderRadius: 2,
				}}
			>
				<Typography variant="h6">Your garage is empty.</Typography>
			</Box>
		);
	}

	return (
		<Grid container spacing={3} justifyContent="center">
			{vehicles?.map((vehicle) => (
				<VehicleCard
					key={vehicle.id}
					vehicle={vehicle}
					onSelect={(vehicle) => {
						onSelect(vehicle);
					}}
				/>
			))}
		</Grid>
	);
};
