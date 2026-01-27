import {
	Box,
	CircularProgress,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TableSortLabel,
	Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

import { useListMaintenanceRecords } from "../../api";

type SortableColumn = "date" | "mileage" | "cost";
type Order = "asc" | "desc";

export const MaintenanceRecordList = ({ vehicleId }: { vehicleId: string }) => {
	const { data: records, isLoading } = useListMaintenanceRecords(vehicleId);
	const [orderBy, setOrderBy] = useState<SortableColumn>("date");
	const [order, setOrder] = useState<Order>("desc");

	const handleSort = (column: SortableColumn) => {
		if (orderBy === column) {
			setOrder(order === "asc" ? "desc" : "asc");
		} else {
			setOrderBy(column);
			setOrder("desc");
		}
	};

	const sortedRecords = useMemo(() => {
		if (!records) {
			return [];
		}

		return [...records].sort((a, b) => {
			let comparison = 0;

			switch (orderBy) {
				case "date":
					comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
					break;
				case "mileage":
					comparison = a.mileage - b.mileage;
					break;
				case "cost": {
					const costA = a.cost ? parseFloat(a.cost.replace(/[^0-9.-]/g, "")) || 0 : 0;
					const costB = b.cost ? parseFloat(b.cost.replace(/[^0-9.-]/g, "")) || 0 : 0;
					comparison = costA - costB;
					break;
				}
			}

			return order === "asc" ? comparison : -comparison;
		});
	}, [records, orderBy, order]);

	if (isLoading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
				<CircularProgress size={24} />
			</Box>
		);
	}

	if (!records || records.length === 0) {
		return (
			<Box sx={{ textAlign: "center", py: 4, border: "1px dashed #ccc", borderRadius: 1 }}>
				<Typography color="text.secondary">No maintenance records yet.</Typography>
			</Box>
		);
	}

	return (
		<TableContainer component={Paper} variant="outlined">
			<Table size="small">
				<TableHead>
					<TableRow>
						<TableCell sortDirection={orderBy === "date" ? order : false}>
							<TableSortLabel
								active={orderBy === "date"}
								direction={orderBy === "date" ? order : "asc"}
								onClick={() => handleSort("date")}
							>
								Date
							</TableSortLabel>
						</TableCell>
						<TableCell>Description</TableCell>
						<TableCell align="right" sortDirection={orderBy === "mileage" ? order : false}>
							<TableSortLabel
								active={orderBy === "mileage"}
								direction={orderBy === "mileage" ? order : "asc"}
								onClick={() => handleSort("mileage")}
							>
								Mileage
							</TableSortLabel>
						</TableCell>
						<TableCell align="right" sortDirection={orderBy === "cost" ? order : false}>
							<TableSortLabel
								active={orderBy === "cost"}
								direction={orderBy === "cost" ? order : "asc"}
								onClick={() => handleSort("cost")}
							>
								Cost
							</TableSortLabel>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{sortedRecords.map((record) => (
						<TableRow key={record.id}>
							<TableCell>{record.date}</TableCell>
							<TableCell>{record.description}</TableCell>
							<TableCell align="right">{record.mileage.toLocaleString()}</TableCell>
							<TableCell align="right">{record.cost || "-"}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};
