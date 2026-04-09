import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api/shifts";

export const getShifts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createShift = async (shift) => {
  const response = await axios.post(API_URL, shift);
  return response.data;
};

export const getWeeklyShifts = async (start, end) => {
    const response = await axios.get(`${API_URL}/week?startDate=${start}&endDate=${end}`);
    return response.data;
};

export const updateShift = async (id, shift) => {
  const response = await axios.put(`${API_URL}/${id}`, shift);
  return response.data;
};

export const deleteShift = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const publishWeek = async (start, end) => {
  const response = await axios.post(`${API_URL}/publish-week?startDate=${start}&endDate=${end}`);
  return response.data;
};

export const getPublishedWeeklyShifts = async (start, end) => {
  const response = await axios.get(`${API_URL}/published/week?startDate=${start}&endDate=${end}`);
  return response.data;
}