import api from "../config/axios";

export const createAccountActivation = async (values) => {
  try {
    const response = await api.post("/api/accounts-activation", values);

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

export const fetchAccountActivations = async (accountId) => {
  try {
    const response = await api.get("/api/accounts-activation", {
      params: accountId ? { accountId } : {},
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
