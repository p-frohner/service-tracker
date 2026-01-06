export const customFetch = async <T>(
	url: string,
	options: RequestInit,
): Promise<T> => {
	const response = await fetch(url, options);
	const data = await response.json();

	if (!response.ok) {
		// prevents onSuccess from firing in react-query so we can display potential error messages
		throw data;
	}

	return data;
};
