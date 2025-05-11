import api from "../config/axios";

export const createDevice = async (device) => {
  try {
    const response = await api.post("/api/devices", {
      name: device.name,
      isActive: device.isActive,
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

export const updateDevice = async (device) => {
  try {
    const response = await api.put(`/api/devices/${device.id}`, {
      name: device.name,
      isActive: device.isActive,
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

export const fetchDevices = async (
  {
    page = 1,
    limit = 25,
    orderBy = "createdAt",
    order = "asc",
    query,
    createdBy,
    createdAt_gte,
    createdAt_lte,
    isActive,
  } = {}
) => {
  try {
    const response = await api.get(`/api/devices`, {
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

export const fetchDeviceById = async ({ id }) => {
  try {
    const response = await api.get(`/api/devices/${id}`);

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
