import { Box, Button, Container, Stack, TextField } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { getListVehiclesQueryKey, useCreateVehicle } from "../../api";
import { createVehicleBodyYearMax, createVehicleBodyYearMin } from "../../api.zod";
import { Breadcrumbs } from "../Breadcrumbs";

type FormValues = {
	make: string;
	model: string;
	year: number;
};

export const AddVehicle = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { control, handleSubmit } = useForm<FormValues>({
		defaultValues: { make: "", model: "", year: 2013 },
	});
	const { mutate, isPending } = useCreateVehicle({
		mutation: {
			onSuccess: (vehicle) => {
				queryClient.invalidateQueries({ queryKey: getListVehiclesQueryKey() });
				navigate({ to: "/vehicle-details/$vehicleId", params: { vehicleId: vehicle.id } });
			},
		},
	});

	return (
		<Container maxWidth="sm">
			<Box component="form" onSubmit={handleSubmit((data) => mutate({ data }))} p={2}>
				<Breadcrumbs items={[{ label: "Vehicles", url: "/" }, { label: "Add vehicle" }]} />
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
						{isPending ? "Saving..." : "Submit"}
					</Button>
				</Box>
			</Box>
		</Container>
	);
};
