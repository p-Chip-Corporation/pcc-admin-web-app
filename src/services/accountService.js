import api from "../config/axios";

export const createAccount = async (account) => {
  try {
    const response = await api.post("/api/accounts", {
      name: account.name,
      isActive: account.isActive,
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

export const updateAccount = async (account) => {
  try {
    const response = await api.put(`/api/accounts/${account.id}`, {
      name: account.name,
      isActive: account.isActive,
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

export const fetchAccounts = async ({
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
    const response = await api.get("/api/accounts", {
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

    if (response.status === 200) {
      return {
        success: true,
        data: response.data.results,
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

export const fetchAccountDetails = async ({ id }) => {
  try {
    const response = await api.get(`/api/accounts/${id}`);

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
