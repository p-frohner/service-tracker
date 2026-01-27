import { Box, Button, Stack, TextField } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { getListMaintenanceRecordsQueryKey, useCreateMaintenanceRecord } from "../../api";
import { Route } from "../../routes/vehicle-details.$vehicleId";

type FormValues = {
	date: string;
	description: string;
	mileage: number;
	cost: string;
	notes?: string;
};

export const AddMaintenanceRecord = ({ onSubmit }: { onSubmit: () => void }) => {
	const { vehicleId } = Route.useParams();
	const queryClient = useQueryClient();
	const { control, handleSubmit } = useForm<FormValues>({
		defaultValues: { date: "", description: "", mileage: 0, cost: "" },
	});
	const { mutate, isPending } = useCreateMaintenanceRecord({
		mutation: {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: getListMaintenanceRecordsQueryKey(vehicleId) });
				onSubmit();
			},
		},
	});

	return (
		<Box component="form" onSubmit={handleSubmit((data) => mutate({ vehicleId, data }))} p={2}>
			<Stack spacing={2}>
				<Controller
					name="date"
					control={control}
					rules={{ required: "Date is required" }}
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							label="Date"
							placeholder="YYYY-MM-DD"
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
							fullWidth
						/>
					)}
				/>
				<Controller
					name="description"
					control={control}
					rules={{ required: "Description is required" }}
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							label="Description"
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
							fullWidth
						/>
					)}
				/>
				<Controller
					name="mileage"
					control={control}
					rules={{
						required: "Mileage is required",
						min: { value: 0, message: "Mileage must be 0 or greater" },
					}}
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							onChange={(e) => field.onChange(Number(e.target.value))}
							type="number"
							label="Mileage"
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
							fullWidth
						/>
					)}
				/>
				<Controller
					name="cost"
					control={control}
					render={({ field }) => <TextField {...field} label="Cost" fullWidth />}
				/>
				<Controller
					name="notes"
					control={control}
					render={({ field }) => (
						<TextField {...field} label="Notes" multiline rows={3} fullWidth />
					)}
				/>
			</Stack>
			<Box sx={{ py: 3 }}>
				<Button type="submit" variant="contained" disabled={isPending} fullWidth size="large">
					{isPending ? "Saving..." : "Submit"}
				</Button>
			</Box>
		</Box>
	);
};
