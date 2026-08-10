import api from "./api";

export const getPlayers = async () => {
  const response = await api.get("/players");

  return response.data;
};

export const getPlayerById = async (playerId) => {
  const response = await api.get(`/players/${playerId}`);

  return response.data;
};