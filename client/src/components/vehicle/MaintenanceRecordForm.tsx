import { Box, Button, Stack, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { type Dayjs } from "dayjs";
import { Controller, useForm } from "react-hook-form";

export type MaintenanceRecordFormValues = {
	date: string;
	description: string;
	mileage: number;
	cost: string;
	notes?: string;
};

type Props = {
	defaultValues: MaintenanceRecordFormValues;
	onSubmit: (data: MaintenanceRecordFormValues) => void;
	isPending: boolean;
	submitLabel: string;
};

export const MaintenanceRecordForm = ({
	defaultValues,
	onSubmit,
	isPending,
	submitLabel,
}: Props) => {
	const { control, handleSubmit } = useForm<MaintenanceRecordFormValues>({ defaultValues });

	return (
		<Box component="form" onSubmit={handleSubmit(onSubmit)} p={2}>
			<Stack spacing={2}>
				<Controller
					name="date"
					control={control}
					rules={{ required: "Date is required" }}
					render={({ field, fieldState }) => (
						<DatePicker
							label="Date"
							value={dayjs(field.value)}
							onChange={(newValue: Dayjs | null) =>
								field.onChange(newValue?.format("YYYY-MM-DD") ?? "")
							}
							enableAccessibleFieldDOMStructure={false}
							slots={{
								textField: TextField,
							}}
							slotProps={{
								textField: {
									fullWidth: true,
									error: !!fieldState.error,
									helperText: fieldState.error?.message,
								},
							}}
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
			<Box sx={{ pt: 3 }}>
				<Button type="submit" variant="contained" disabled={isPending} fullWidth size="large">
					{isPending ? "Saving..." : submitLabel}
				</Button>
			</Box>
		</Box>
	);
};
