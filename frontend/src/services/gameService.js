import api from "./api";

export const getGames = async () => {
  const response = await api.get("/games");

  return response.data;
};

export const getGameById = async (gameId) => {
  const response = await api.get(`/games/${gameId}`);

  return response.data;
};

export const getAllGames = async () => {
  const response = await api.get("/games");

  return response.data;
};