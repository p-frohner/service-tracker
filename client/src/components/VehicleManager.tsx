import { Add } from "@mui/icons-material";
import { Box, Button, Stack } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "./Link";
import { VehicleList } from "./VehicleList";

export const VehicleManager = () => {
	const navigate = useNavigate();

	return (
		<Box padding={2}>
			<Box textAlign="right" pb={2}>
				<Link
					// variant="outlined"
					// size="large"
					// onClick={() => {
					// 	navigate({ to: "/add-vehicle" });
					// }}
					// endIcon={<Add />}
					to="/add-vehicle"
				>
					Add Vehicle
				</Link>
			</Box>
			<VehicleList />
		</Box>
	);
};
