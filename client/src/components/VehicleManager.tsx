import { Box, Button, Stack } from "@mui/material";
import { useState } from "react";
import { AddVehicleDialog } from "./AddVehicleDialog";
import { VehicleList } from "./VehicleList";

export const VehicleManager = () => {
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

	return (
		<Stack spacing={2} direction="column" padding={2}>
			<Box textAlign="right">
				<Button
					variant="outlined"
					onClick={() => {
						setIsAddDialogOpen(true);
					}}
				>
					Add Vehicle
				</Button>
			</Box>
			<VehicleList
				onSelect={(id) => {
					return id;
				}}
			/>
			{isAddDialogOpen && (
				<AddVehicleDialog
					open={isAddDialogOpen}
					onClose={() => {
						setIsAddDialogOpen(false);
					}}
				/>
			)}
		</Stack>
	);
};
