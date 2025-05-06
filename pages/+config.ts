export default {
  prerender: true,
  meta: {
    title: {
      env: { server: true },
    },
    description: {
      env: { server: true },
    },
  },
};
