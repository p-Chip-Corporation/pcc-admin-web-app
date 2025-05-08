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

export const fetchAccountDevices = async (accountId, deviceId) => {
  try {
    const response = await api.get("/api/accounts-devices", {
      params: {
        ...(accountId && { accountId }),
        ...(deviceId && { deviceId }),
      },
    });

    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        data: response.data,
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
