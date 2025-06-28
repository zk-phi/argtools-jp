export default {
  prerender: true,
  meta: {
    title: {
      env: { server: true },
    },
    description: {
      env: { server: true },
    },
    details: {
      env: { server: true },
    },
    backlink: {
      env: { server: true },
    },
  },
};
