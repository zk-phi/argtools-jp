let currentId = 0;

export const gensym = (): number => {
  currentId++;
  return currentId;
};
