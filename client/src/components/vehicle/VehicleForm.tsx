import { Box, Button, Stack, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { createVehicleBodyYearMax, createVehicleBodyYearMin } from "../../api.zod";

export type VehicleFormValues = {
	make: string;
	model: string;
	year: number;
};

type VehicleFormProps = {
	defaultValues: VehicleFormValues;
	onSubmit: (data: VehicleFormValues) => void;
	isPending: boolean;
	submitLabel: string;
};

export const VehicleForm = ({ defaultValues, onSubmit, isPending, submitLabel }: VehicleFormProps) => {
	const { control, handleSubmit } = useForm<VehicleFormValues>({
		defaultValues,
	});

	return (
		<Box component="form" onSubmit={handleSubmit(onSubmit)}>
			<Stack spacing={2} mt={3}>
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
							slotProps={{
								htmlInput: { min: createVehicleBodyYearMin, max: createVehicleBodyYearMax },
							}}
							onChange={(e) => field.onChange(Number(e.target.value))}
						/>
					)}
				/>
			</Stack>
			<Box sx={{ py: 3 }}>
				<Button type="submit" variant="contained" disabled={isPending} fullWidth size="large">
					{isPending ? "Saving..." : submitLabel}
				</Button>
			</Box>
		</Box>
	);
};
