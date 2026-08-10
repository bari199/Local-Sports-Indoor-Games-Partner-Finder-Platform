import api from "./api";

export const sendPartnerRequest = async (data) => {
  const response = await api.post("/requests", data);
  return response.data;
};

export const getReceivedRequests = async () => {
  const response = await api.get("/requests/received");
  return response.data;
};

export const getSentRequests = async () => {
  const response = await api.get("/requests/sent");
  return response.data;
};

export const updateRequestStatus = async (requestId, status) => {
  const response = await api.patch(
    `/requests/${requestId}/status`,
    { status }
  );

  return response.data;
};

export const getMyPartners = async () => {
  const response = await api.get("/requests/partners");
  return response.data;
};