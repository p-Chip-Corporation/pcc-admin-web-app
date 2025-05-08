import api from "../config/axios";

export const authenticateUserAcccess = async (account) => {
  try {
    const response = await api.post("/auth", {
      localAccountId: account.localAccountId,
      email: account.username,
    });

    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
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

export const fetchUserProfilePermissions = async ({ localAccountId }) => {
  try {
    const response = await api.get(`/auth/${localAccountId}`);

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

// services/authService.js
export const logoutUser = async () => {
  try {
    const response = await api.post("/auth/logout");
    return {
      success: response.status === 200 || response.status === 201,
    };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || err.message,
    };
  }
};
