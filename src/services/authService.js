import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api/auth";

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

export const changePassword = async (data) => {
  const response = await axios.post(`${API_URL}/change-password`, data);
  return response.data;
};

export const createUserFromEmployee = async (data) => {
  const response = await axios.post(`${API_URL}/create-user`, data);
  return response.data;
};