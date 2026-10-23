export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    PROFILE: "/auth/profile",
  },
  CATEGORIES: {
    LIST: "/categories",
    DETAIL: (id) => `/categories/${id}`,
    CREATE: "/categories",
    UPDATE: (id) => `/categories/${id}`,
    DELETE: (id) => `/categories/${id}`,
  },
  PORTFOLIOS: {
    LIST: "/portfolios",
    DETAIL: (id) => `/portfolios/${id}`,
    CREATE: "/portfolios",
    BATCH_CREATE: "/portfolios/batch",
    UPDATE: (id) => `/portfolios/${id}`,
    DELETE: (id) => `/portfolios/${id}`,
  },
  BANNERS: {
    LIST: "/banners",
    DETAIL: (id) => `/banners/${id}`,
    CREATE: "/banners",
    UPDATE: (id) => `/banners/${id}`,
    DELETE: (id) => `/banners/${id}`,
  },
  STATS: {
    SUMMARY: "/stats/summary",
  }
};
