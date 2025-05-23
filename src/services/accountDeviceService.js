import api from "../config/axios";

export const createAccountDevice = async (values) => {
  try {
    const response = await api.post("/api/accounts-devices", values);

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

export const initializeAccountDevice = async ({ accountDeviceId }) => {
  try {
    const response = await api.put(`/api/accounts-devices/initialize/${accountDeviceId}`);

    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        data: response.data, // Include the response data (e.g., user profile)
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    };
  }
};

export const fetchAccountDevices = async ({
  accountId,
  deviceId,
  page = 1,
  limit = 25,
  orderBy = "createdAt",
  order = "asc",
  query,
  createdBy,
  createdAt_gte,
  createdAt_lte,
  isActive,
}) => {
  try {
    const response = await api.get("/api/accounts-devices", {
      params: {
        page,
        limit,
        orderBy,
        order,
        ...(accountId && { accountId }),
        ...(deviceId && { deviceId }),
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

export const fetchAccountDeviceDetails = async ({ id }) => {
  try {
    const response = await api.get(`/api/accounts-devices/${id}`);

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
