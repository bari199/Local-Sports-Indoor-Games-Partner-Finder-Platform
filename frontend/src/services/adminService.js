import api from "./api";

// ============================================================
// ADMIN DASHBOARD
// ============================================================

export const getAdminDashboard = async () => {
  const response = await api.get("/admin/dashboard");

  return response.data;
};