import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import {
	getGetVehicleImagesQueryKey,
	useFetchVehicleImages,
	useGetVehicleImages,
} from "../api";
import { useVehicleWebSocket } from "./useVehicleWebSocket";

export const useVehicleImages = (vehicleId: string) => {
	const [isDownloading, setIsDownloading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const queryClient = useQueryClient();
	const { data: images = [] } = useGetVehicleImages(vehicleId);
	const { mutate: fetchImages } = useFetchVehicleImages();

	const handleImagesReady = useCallback(() => {
		queryClient.invalidateQueries({ queryKey: getGetVehicleImagesQueryKey(vehicleId) });
		setIsDownloading(false);
	}, [queryClient, vehicleId]);

	useVehicleWebSocket(vehicleId, handleImagesReady);

	const downloadImages = useCallback(() => {
		setIsDownloading(true);
		setError(null);
		fetchImages(
			{ vehicleId },
			{
				onError: (err) => {
					setIsDownloading(false);
					setError(err.message || "Failed to download images");
				},
			},
		);
	}, [fetchImages, vehicleId]);

	return { images, isDownloading, downloadImages, error };
};
