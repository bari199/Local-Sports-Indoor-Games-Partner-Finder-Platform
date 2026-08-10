import api from "./api";

// ============================================================
// REGISTER
// ============================================================

export const registerUser = async (formData) => {
  const response = await api.post(
    "/auth/register",
    formData
  );

  return response.data;
};

// ============================================================
// LOGIN
// ============================================================

export const loginUser = async (credentials) => {
  const response = await api.post(
    "/auth/login",
    credentials
  );

  return response.data;
};

// ============================================================
// GET CURRENT LOGGED-IN USER
// ============================================================

export const getMyProfile = async () => {
  const response = await api.get(
    "/auth/me"
  );

  return response.data;
};

// ============================================================
// UPDATE CURRENT USER PROFILE
// ============================================================

export const updateProfile = async (formData) => {
  const response = await api.put(
    "/auth/profile",
    formData
  );

  return response.data;
};

// ============================================================
// LOGOUT
// ============================================================

export const logoutUser = async () => {
  const response = await api.post(
    "/auth/logout"
  );

  return response.data;
};
