import axios from "axios";

// Base endpoint for shift-related API calls. Make sure VITE_API_URL is set in your env.
const API_URL = import.meta.env.VITE_API_URL + "/api/shifts";

// Get all shifts (not week-filtered)
export const getShifts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Create a new shift. `shift` should match the API shape.
export const createShift = async (shift) => {
  const response = await axios.post(API_URL, shift);
  return response.data;
};

// Get shifts for a given week range. Query params: startDate & endDate (YYYY-MM-DD).
export const getWeeklyShifts = async (start, end) => {
    const response = await axios.get(`${API_URL}/week?startDate=${start}&endDate=${end}`);
    return response.data;
};

// Update an existing shift by ID.
export const updateShift = async (id, shift) => {
  const response = await axios.put(`${API_URL}/${id}`, shift);
  return response.data;
};

// Delete a shift by ID.
export const deleteShift = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

// Publish all shifts in a week range and (optionally) trigger notifications server-side.
export const publishWeek = async (start, end) => {
  const response = await axios.post(`${API_URL}/publish-week?startDate=${start}&endDate=${end}`);
  return response.data;
};

// Get only published shifts for a week (used for employee-facing roster views).
export const getPublishedWeeklyShifts = async (start, end) => {
  const response = await axios.get(`${API_URL}/published/week?startDate=${start}&endDate=${end}`);
  return response.data;
}