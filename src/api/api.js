import axios from 'axios';

// const API_URL = 'http://localhost:5000/api',
const API_URL = "https://tech-hub-server-2iz9.onrender.com/api"

export const createAttendee = async (name, email) => {
  try {
    const response = await axios.post(`${API_URL}/attendees`, { name, email });
    return response.data;
  } catch (error) {
    console.error('Error creating attendee:', error);
    throw error;
  }
};

export const getAttendeeByQRCode = async (qrCode) => {
  try {
    const response = await axios.get(`${API_URL}/attendees/${qrCode}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error getting attendee:', error);
    throw error;
  }
};

export const submitFeedback = async (feedbackData) => {
  try {
    const response = await axios.post(`${API_URL}/feedback`, feedbackData);
    return response.data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

export const getAllFeedback = async () => {
  try {
    const response = await axios.get(`${API_URL}/feedback`);
    return response.data;
  } catch (error) {
    console.error('Error getting all feedback:', error);
    throw error;
  }
};

