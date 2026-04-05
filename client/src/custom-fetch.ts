export type BackendError = {
	message: string;
};

// Orval picks up this exported type and uses it for TError in generated hooks
export type ErrorType<_T> = BackendError;

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export const customFetch = async <T>(url: string, options: RequestInit): Promise<T> => {
	let response: Response;
	try {
		response = await fetch(`${BASE_URL}${url}`, options);
	} catch {
		// Network error (server down, no internet, CORS, etc.)
		throw { message: "Unable to connect to server" } as BackendError;
	}

	if (!response.ok) {
		// Prevents onSuccess from firing in react-query so we can display error messages
		const errorData: BackendError = await response
			.json()
			.catch(() => ({ message: "Unknown Error" }));
		throw errorData;
	}

	// Handle 204 No Content or empty responses
	if (response.status === 204 || response.headers.get("content-length") === "0") {
		return undefined as T;
	}

	return response.json();
};
