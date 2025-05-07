// Give react a chance to update the UI.
export const defer = (): Promise<void> => new Promise(resolve => setTimeout(resolve, 100));
