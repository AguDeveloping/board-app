import { authAxios } from './authService';
import { Card } from '../types/card';

const API_URL = 'http://localhost:3000/api';

// Fetch all cards
export const fetchCards = async (): Promise<Card[]> => {
  try {
    const response = await authAxios.get(`${API_URL}/cards`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cards:', error);
    throw error;
  }
};

// Fetch a single card by ID
export const fetchCardById = async (id: string): Promise<Card> => {
  try {
    const response = await authAxios.get(`${API_URL}/cards/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching card with id ${id}:`, error);
    throw error;
  }
};

// Create a new card
export const createCard = async (cardData: Partial<Card>): Promise<Card> => {
  try {
    const response = await authAxios.post(`${API_URL}/cards`, cardData);
    return response.data;
  } catch (error) {
    console.error('Error creating card:', error);
    throw error;
  }
};

// Update an existing card
export const updateCard = async (id: string, cardData: Partial<Card>): Promise<Card> => {
  try {
    const response = await authAxios.put(`${API_URL}/cards/${id}`, cardData);
    return response.data;
  } catch (error) {
    console.error(`Error updating card with id ${id}:`, error);
    throw error;
  }
};

// Delete a card
export const deleteCard = async (id: string): Promise<void> => {
  try {
    await authAxios.delete(`${API_URL}/cards/${id}`);
  } catch (error) {
    console.error(`Error deleting card with id ${id}:`, error);
    throw error;
  }
};
