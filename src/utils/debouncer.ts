type Timeout = ReturnType<typeof setTimeout>;

export const debouncer = (ms: number) => {
  let timer: Timeout | null = null;

  return (thunk: () => void) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(thunk, ms);
  };
};
