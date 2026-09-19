import API from "./api";

export const testBackend = async () => {
  try {
    const response = await API.get("/health");

    console.log("Backend Response:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Backend connection failed:",
      error.response?.data || error.message
    );

    throw error;
  }
};