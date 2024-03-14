export function parseLogString(str: string) {
	// Regular expression to match key-value pairs
	const regex = /\[([^:]+):([^[\]]+)\]/g;
	let match;
	const result: {[key: string]: string} = {};

	// Loop through matches and populate the dictionary
	while ((match = regex.exec(str)) !== null) {
		const key = match[1].trim();
		const value = match[2].trim();
		result[key] = value;
	}

	return result;
}
