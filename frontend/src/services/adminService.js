import api from "./api";

/* ============================================================
   ADMIN DASHBOARD
============================================================ */

export const getAdminDashboard = async () => {
  const response = await api.get("/admin/dashboard");

  return response.data;
};

/* ============================================================
   GET ALL USERS
============================================================ */

export const getAdminUsers = async () => {
  const response = await api.get("/admin/users");

  return response.data;
};

/* ============================================================
   GET SINGLE USER
============================================================ */

export const getAdminUserById = async (userId) => {
  const response = await api.get(
    `/admin/users/${userId}`
  );

  return response.data;
};

/* ============================================================
   UPDATE USER ROLE
============================================================ */

export const updateUserRole = async (
  userId,
  role
) => {
  const response = await api.patch(
    `/admin/users/${userId}/role`,
    { role }
  );

  return response.data;
};

/* ============================================================
   DELETE USER
============================================================ */

export const deleteAdminUser = async (userId) => {
  const response = await api.delete(
    `/admin/users/${userId}`
  );

  return response.data;
};

/* ============================================================
   GET ALL GAMES
============================================================ */

export const getAdminGames = async () => {
  const response = await api.get(
    "/admin/games"
  );

  return response.data;
};

/* ============================================================
   GET SINGLE GAME
============================================================ */

export const getAdminGameById = async (gameId) => {
  const response = await api.get(
    `/admin/games/${gameId}`
  );

  return response.data;
};

/* ============================================================
   CREATE GAME
============================================================ */

export const createAdminGame = async (gameData) => {
  const response = await api.post(
    "/admin/games",
    gameData
  );

  return response.data;
};

/* ============================================================
   UPDATE GAME
============================================================ */

export const updateAdminGame = async (
  gameId,
  gameData
) => {
  const response = await api.patch(
    `/admin/games/${gameId}`,
    gameData
  );

  return response.data;
};

/* ============================================================
   DELETE GAME
============================================================ */

export const deleteAdminGame = async (gameId) => {
  const response = await api.delete(
    `/admin/games/${gameId}`
  );

  return response.data;
};

/* ============================================================
   GET ALL PARTNER REQUESTS
============================================================ */

export const getAdminRequests = async () => {
  const response = await api.get(
    "/admin/requests"
  );

  return response.data;
};

/* ============================================================
   UPDATE PARTNER REQUEST STATUS
============================================================ */

export const updateAdminRequestStatus = async (
  requestId,
  status
) => {
  const response = await api.patch(
    `/admin/requests/${requestId}/status`,
    {
      status,
    }
  );

  return response.data;
};

/* ============================================================
   DELETE PARTNER REQUEST
============================================================ */

export const deleteAdminRequest = async (
  requestId
) => {
  const response = await api.delete(
    `/admin/requests/${requestId}`
  );

  return response.data;
};