import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { Box, Card, CardActionArea, CardContent, Stack, Typography } from "@mui/material";

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
			sx={{ height: "100%", p: 1, justifyContent: "center" }}
		>
			<CardContent sx={{ padding: "4px 8px" }}>
				<Stack direction="row">
					<Box display="flex" alignItems="center" mr={2}>
						<DirectionsCarIcon color="primary" sx={{ fontSize: 60, verticalAlign: "middle" }} />
					</Box>
					<Stack direction="column" mr={2}>
						<Typography variant="h6" color="text.secondary">
							{vehicle.year}
						</Typography>
						<TextEllipsis text={vehicle.make} />
						<TextEllipsis text={vehicle.model} />
					</Stack>
				</Stack>
			</CardContent>
		</CardActionArea>
	</Card>
);

const TextEllipsis = ({ text }: { text: string }) => (
	<Typography
		variant="h5"
		component="div"
		sx={{
			fontWeight: "bold",
			textOverflow: "ellipsis",
			overflow: "hidden",
			whiteSpace: "nowrap",
			maxWidth: "170px",
		}}
	>
		{text}
	</Typography>
);
