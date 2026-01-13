import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { useListVehicles } from "../api";
import { VehicleCard } from "./VehicleCard";

export const VehicleList = () => {
	const navigate = useNavigate();
	const { data: vehicles, isLoading, error } = useListVehicles();

	if (isLoading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
				<CircularProgress color="primary" />
				<Typography sx={{ ml: 2 }}>Loading...</Typography>
			</Box>
		);
	}

	// TODO: make it generic and use snackbar notification
	if (error) {
		return <Typography color="error">Error loading vehicles. Is the Go server running?</Typography>;
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
						navigate({ to: `/vehicle-details/${vehicle.id}` });
					}}
				/>
			))}
		</Grid>
	);
};
