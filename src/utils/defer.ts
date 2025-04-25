// Give react a chance to update the UI.
export const defer = (fn: () => void) => {
  setTimeout(fn, 100);
};
