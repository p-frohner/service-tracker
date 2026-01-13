export type BackendError = {
	message: string;
};

// Orval picks up this exported type and uses it for TError in generated hooks
export type ErrorType<_T> = BackendError;

export const customFetch = async <T>(url: string, options: RequestInit): Promise<T> => {
	const response = await fetch(url, options);

	if (!response.ok) {
		// Prevents onSuccess from firing in react-query so we can display error messages
		const errorData: BackendError = await response
			.json()
			.catch(() => ({ message: "Unknown Error" }));
		throw errorData;
	}

	return response.json();
};
