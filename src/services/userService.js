import api from "../config/axios";

export const createUser = async (user) => {
  try {
    const response = await api.post("/api/users", {
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      role: user.role,
    });

    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        data: response.data, // Include the response data (e.g., user profile)
      };
    }

    return {
      success: false,
      error: response.data?.error || "Unknown error",
    };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || err.message,
    };
  }
};

export const fetchUsers = async ({
  page = 1,
  limit = 25,
  orderBy = "createdAt",
  order = "asc",
  query,
  createdBy,
  createdAt_gte,
  createdAt_lte,
  isActive,
} = {}) => {
  try {
    const response = await api.get(`/api/users`, {
      params: {
        page,
        limit,
        orderBy,
        order,
        ...(query && { query }),
        ...(createdBy && { createdBy }),
        ...(createdAt_gte && { createdAt_gte }),
        ...(createdAt_lte && { createdAt_lte }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        data: response.data.results, // assuming you renamed it from 'results' earlier
        meta: response.data.meta,
      };
    }

    return {
      success: false,
      error: response.data?.error || "Unknown error",
    };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || err.message,
    };
  }
};

export const fetchUserById = async ({ id }) => {
  try {
    const response = await api.get(`/api/users/${id}`);

    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        data: response.data, // Include the response data (e.g., user profile)
      };
    }

    return {
      success: false,
      error: response.data?.error || "Unknown error",
    };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || err.message,
    };
  }
};
