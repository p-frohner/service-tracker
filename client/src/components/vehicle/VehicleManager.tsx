import { Box } from "@mui/material";
import { Link } from "../Link";
import { VehicleList } from "./VehicleList";

export const VehicleManager = () => {
	return (
		<Box padding={2}>
			<Box textAlign="right" pb={2}>
				<Link to="/add-vehicle">Add Vehicle</Link>
			</Box>
			<VehicleList />
		</Box>
	);
};
