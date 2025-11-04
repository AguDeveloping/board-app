import authAxios from './authInterceptor';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://0.0.0.0:3000/api';
const API_CARDS_URL = `${API_BASE_URL}/cards`;

// Fetch all cards with optional query parameters
export const fetchCards = async (queryParams = '') => {
  try {
    const response = await authAxios.get(`${API_CARDS_URL}${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cards:', error);
    throw error;
  }
};

// Fetch statics cards
export const fetchCardsStat = async () => {
  try {
    const response = await authAxios.get(`${API_CARDS_URL}/stat`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cards statics:', error);
    throw error;
  }
};

// Fetch a single card by ID
export const fetchCardById = async (id) => {
  try {
    const response = await authAxios.get(`${API_CARDS_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching card with id ${id}:`, error);
    throw error;
  }
};

// Create a new card
export const createCard = async (cardData) => {
  try {
    const response = await authAxios.post(`${API_CARDS_URL}`, cardData);
    return response.data;
  } catch (error) {
    console.error('Error creating card:', error);
    throw error;
  }
};

// Update an existing card
export const updateCard = async (id, cardData) => {
  try {
    // console.log('Updating card with data:', cardData);
    const response = await authAxios.put(`${API_CARDS_URL}/${id}`, cardData);
    // console.log('Update response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating card with id ${id}:`, error);
    throw error;
  }
};

// Delete a card
export const deleteCard = async (id) => {
  try {
    await authAxios.delete(`${API_CARDS_URL}/${id}`);
  } catch (error) {
    console.error(`Error deleting card with id ${id}:`, error);
    throw error;
  }
};
