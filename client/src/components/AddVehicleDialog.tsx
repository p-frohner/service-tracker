import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Stack,
	TextField,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";

import { getGetVehiclesQueryKey, usePostVehicles } from "../api";

type FormValues = {
	make: string;
	model: string;
	year: number;
};

export const AddVehicleDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
	const queryClient = useQueryClient();
	const { control, handleSubmit, reset } = useForm<FormValues>({
		defaultValues: { make: "", model: "", year: 2013 },
	});

	const { mutate, isPending } = usePostVehicles({
		mutation: {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: getGetVehiclesQueryKey() });
				reset();
				onClose();
			},
		},
	});

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
			<DialogTitle>Add New Vehicle</DialogTitle>
			<Box component="form" onSubmit={handleSubmit((data) => mutate({ data }))}>
				<DialogContent>
					<Stack spacing={2} sx={{ mt: 1 }}>
						<Controller
							name="make"
							control={control}
							rules={{ required: "Make is required" }}
							render={({ field, fieldState }) => (
								<TextField
									{...field}
									label="Make"
									error={!!fieldState.error}
									helperText={fieldState.error?.message}
									fullWidth
								/>
							)}
						/>
						<Controller
							name="model"
							control={control}
							rules={{ required: "Model is required" }}
							render={({ field, fieldState }) => (
								<TextField
									{...field}
									label="Model"
									error={!!fieldState.error}
									helperText={fieldState.error?.message}
									fullWidth
								/>
							)}
						/>
						<Controller
							name="year"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									type="number"
									label="Year"
									fullWidth
									onChange={(e) => field.onChange(Number(e.target.value))}
								/>
							)}
						/>
					</Stack>
				</DialogContent>
				<DialogActions sx={{ px: 3, pb: 3 }}>
					<Button onClick={onClose}>Cancel</Button>
					<Button type="submit" variant="contained" disabled={isPending}>
						{isPending ? "Saving..." : "Add Vehicle"}
					</Button>
				</DialogActions>
			</Box>
		</Dialog>
	);
};
