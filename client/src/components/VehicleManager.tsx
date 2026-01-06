import { Add } from "@mui/icons-material";
import { Box, Button, Stack } from "@mui/material";
import { useState } from "react";
import { AddVehicleDialog } from "./AddVehicleDialog";
import { VehicleList } from "./VehicleList";

export const VehicleManager = () => {
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

	return (
		<Stack spacing={2} direction="column" padding={2}>
			<Box textAlign="right" pb={2}>
				<Button
					variant="outlined"
					size="large"
					onClick={() => {
						setIsAddDialogOpen(true);
					}}
					endIcon={<Add />}
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
