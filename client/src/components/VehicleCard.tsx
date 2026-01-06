import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import type { Vehicle } from "../api";

type Props = {
	vehicle: Vehicle;
	onSelect: (vehicle: Vehicle) => void;
};

export const VehicleCard = ({ vehicle, onSelect }: Props) => (
	<Card
		sx={{
			height: "100%",
			transition: "0.3s",
			"&:hover": { boxShadow: 10 },
			borderWidth: 4,
			borderStyle: "solid",
			borderRadius: 10,
			borderColor: "primary.light",
		}}
	>
		<CardActionArea
			onClick={() => onSelect(vehicle)}
			sx={{ height: "100%", p: 1 }}
		>
			<CardContent>
				<DirectionsCarIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
				<Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
					{vehicle.make} {vehicle.model}
				</Typography>
				<Typography variant="h6" color="text.secondary">
					{vehicle.year}
				</Typography>
			</CardContent>
		</CardActionArea>
	</Card>
);
