import { useQueryClient } from "@tanstack/react-query";
import {
	getListMaintenanceRecordsQueryKey,
	type MaintenanceRecord,
	useUpdateMaintenanceRecord,
} from "../../api";
import { Route } from "../../routes/vehicle-details.$vehicleId";
import { MaintenanceRecordForm, type MaintenanceRecordFormValues } from "./MaintenanceRecordForm";

export const EditMaintenanceRecord = ({
	record,
	onSubmit,
}: {
	record: MaintenanceRecord;
	onSubmit: () => void;
}) => {
	const { vehicleId } = Route.useParams();
	const queryClient = useQueryClient();

	const { mutate, isPending } = useUpdateMaintenanceRecord({
		mutation: {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: getListMaintenanceRecordsQueryKey(vehicleId) });
				onSubmit();
			},
		},
	});

	const handleSubmit = (data: MaintenanceRecordFormValues) => {
		if (record.id) {
			mutate({ vehicleId, recordId: record.id, data });
		}
	};

	return (
		<MaintenanceRecordForm
			defaultValues={{
				date: record.date,
				description: record.description,
				mileage: record.mileage,
				cost: record.cost ?? "",
				notes: record.notes ?? "",
			}}
			onSubmit={handleSubmit}
			isPending={isPending}
			submitLabel="Save"
		/>
	);
};
