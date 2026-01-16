import { useEffect, useRef } from "react";

type ImagesReadyMessage = {
	type: "IMAGES_READY";
	vehicle_id: string;
};

const getWebSocketUrl = () => {
	const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
	const url = new URL(apiUrl);
	url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
	return `${url.origin}/ws`;
};

export const useVehicleWebSocket = (vehicleId: string, onImagesReady: () => void): void => {
	const cleanupRef = useRef(false);

	useEffect(() => {
		cleanupRef.current = false;
		const ws = new WebSocket(getWebSocketUrl());

		ws.onopen = () => {
			if (!cleanupRef.current) {
				ws.send(JSON.stringify({ action: "subscribe", vehicle_id: vehicleId }));
			}
		};

		ws.onmessage = (event) => {
			try {
				const message: ImagesReadyMessage = JSON.parse(event.data);
				if (message.type === "IMAGES_READY" && message.vehicle_id === vehicleId) {
					onImagesReady();
				}
			} catch {
				// Ignore malformed messages
			}
		};

		return () => {
			cleanupRef.current = true;
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(JSON.stringify({ action: "unsubscribe", vehicle_id: vehicleId }));
				ws.close();
			} else if (ws.readyState === WebSocket.CONNECTING) {
				ws.onopen = () => ws.close();
			}
		};
	}, [vehicleId, onImagesReady]);
};
