import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
	Box,
	Button,
	CircularProgress,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
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
import { useQueryClient } from "@tanstack/react-query";
import { Fragment, useMemo, useState } from "react";

import {
	getListMaintenanceRecordsQueryKey,
	type MaintenanceRecord,
	useDeleteMaintenanceRecord,
	useListMaintenanceRecords,
} from "../../api";
import { Dialog, useDialog } from "../Dialog";
import { EditMaintenanceRecord } from "./EditMaintenanceRecord";

type SortableColumn = "date" | "mileage" | "cost";
type Order = "asc" | "desc";

export const MaintenanceRecordList = ({ vehicleId }: { vehicleId: string }) => {
	const queryClient = useQueryClient();
	const { data: records, isLoading } = useListMaintenanceRecords(vehicleId);
	const deleteDialog = useDialog();
	const editDialog = useDialog();
	const [orderBy, setOrderBy] = useState<SortableColumn>("date");
	const [order, setOrder] = useState<Order>("desc");
	const [menuAnchor, setMenuAnchor] = useState<{ top: number; left: number } | null>(null);
	const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);

	const { mutate: deleteRecord } = useDeleteMaintenanceRecord({
		mutation: {
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: getListMaintenanceRecordsQueryKey(vehicleId),
				});
				deleteDialog.close();
			},
		},
	});

	const handleContextMenu = (e: React.MouseEvent, record: MaintenanceRecord) => {
		e.preventDefault();
		setSelectedRecord(record);
		setMenuAnchor({ top: e.clientY, left: e.clientX });
	};

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
						<TableCell {...(orderBy === "date" && { sortDirection: order })} width={120}>
							<TableSortLabel
								active={orderBy === "date"}
								direction={orderBy === "date" ? order : "asc"}
								onClick={() => handleSort("date")}
							>
								Date
							</TableSortLabel>
						</TableCell>
						<TableCell>Description</TableCell>
						<TableCell
							align="right"
							{...(orderBy === "mileage" && { sortDirection: order })}
							width={80}
						>
							<TableSortLabel
								active={orderBy === "mileage"}
								direction={orderBy === "mileage" ? order : "asc"}
								onClick={() => handleSort("mileage")}
							>
								Mileage
							</TableSortLabel>
						</TableCell>
						<TableCell
							align="right"
							{...(orderBy === "cost" && { sortDirection: order })}
							width={80}
						>
							<TableSortLabel
								active={orderBy === "cost"}
								direction={orderBy === "cost" ? order : "asc"}
								onClick={() => handleSort("cost")}
							>
								Cost
							</TableSortLabel>
						</TableCell>
						<TableCell width={28} />
					</TableRow>
				</TableHead>
				<TableBody>
					{sortedRecords.map((record) => (
						<Fragment key={record.id}>
							<TableRow
								onContextMenu={(e) => handleContextMenu(e, record)}
								sx={{
									cursor: "context-menu",
									...(record.notes && { "& td": { borderBottom: "none" } }),
								}}
							>
								<TableCell>{record.date}</TableCell>
								<TableCell>{record.description}</TableCell>
								<TableCell align="right">{record.mileage.toLocaleString()}</TableCell>
								<TableCell align="right">{record.cost || "-"}</TableCell>
								<TableCell padding="none">
									<IconButton
										size="small"
										onClick={(e) => {
											setSelectedRecord(record);
											setMenuAnchor({ top: e.clientY, left: e.clientX });
										}}
									>
										<MoreVertIcon fontSize="small" />
									</IconButton>
								</TableCell>
							</TableRow>
							{record.notes && (
								<TableRow>
									<TableCell colSpan={5} sx={{ py: 1 }}>
										Notes: {record.notes}
									</TableCell>
								</TableRow>
							)}
						</Fragment>
					))}
				</TableBody>
			</Table>
			<Menu
				open={menuAnchor !== null}
				onClose={() => setMenuAnchor(null)}
				anchorReference="anchorPosition"
				{...(menuAnchor && { anchorPosition: menuAnchor })}
				slotProps={{ paper: { elevation: 3 } }}
				sx={{
					"& .MuiBackdrop-root": { backgroundColor: "transparent", backdropFilter: "none" },
				}}
			>
				<MenuItem
					onClick={(e) => {
						setMenuAnchor(null);
						editDialog.open(e);
					}}
				>
					<ListItemIcon>
						<EditIcon />
					</ListItemIcon>
					<ListItemText>Edit</ListItemText>
				</MenuItem>
				<MenuItem
					onClick={(e) => {
						setMenuAnchor(null);
						deleteDialog.open(e);
					}}
				>
					<ListItemIcon>
						<DeleteIcon color="error" />
					</ListItemIcon>
					<ListItemText>Delete</ListItemText>
				</MenuItem>
			</Menu>
			<Dialog open={editDialog.isOpen} anchorEl={editDialog.anchorEl} onClose={editDialog.close}>
				<DialogTitle>Edit Maintenance Record</DialogTitle>
				<DialogContent>
					{selectedRecord && (
						<EditMaintenanceRecord record={selectedRecord} onSubmit={editDialog.close} />
					)}
				</DialogContent>
			</Dialog>
			<Dialog
				open={deleteDialog.isOpen}
				anchorEl={deleteDialog.anchorEl}
				onClose={deleteDialog.close}
			>
				<DialogTitle>Delete this maintenance record?</DialogTitle>
				<DialogActions sx={{ px: 3, pb: 3 }}>
					<Button onClick={deleteDialog.close} variant="outlined" fullWidth>
						Cancel
					</Button>
					<Button
						variant="contained"
						color="error"
						onClick={() => {
							if (selectedRecord?.id) {
								deleteRecord({ vehicleId, recordId: selectedRecord.id });
							}
						}}
						fullWidth
					>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</TableContainer>
	);
};
