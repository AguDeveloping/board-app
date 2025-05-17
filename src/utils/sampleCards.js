import { authAxios } from '../services/auth';

const API_URL = 'http://localhost:3000/api';

// Sample card titles
const sampleTitles = [
  'Complete project documentation',
  'Review pull requests',
  'Fix login page bug',
  'Update user dashboard',
  'Implement search functionality',
  'Create API documentation',
  'Optimize database queries',
  'Set up CI/CD pipeline',
  'Design new landing page',
  'Add unit tests for auth module',
  'Refactor legacy code',
  'Update dependencies',
  'Implement dark mode',
  'Create user onboarding flow',
  'Fix mobile responsiveness issues'
];

// Sample card descriptions
const sampleDescriptions = [
  'Document all API endpoints and include examples for each one.',
  'Review and approve pending pull requests from the team.',
  'Fix the authentication issue on the login page that occurs on mobile devices.',
  'Add new widgets and improve the layout of the user dashboard.',
  'Implement search functionality with filters and sorting options.',
  'Create comprehensive API documentation with Swagger.',
  'Optimize database queries to improve application performance.',
  'Set up continuous integration and deployment pipeline using GitHub Actions.',
  'Design a modern and responsive landing page with the new brand guidelines.',
  'Add comprehensive unit tests for the authentication module.',
  'Refactor legacy code to use modern JavaScript features.',
  'Update all dependencies to their latest versions and fix any breaking changes.',
  'Implement dark mode across the entire application.',
  'Create a step-by-step onboarding flow for new users.',
  'Fix responsiveness issues on mobile devices across all pages.'
];

// Sample card statuses
const statuses = ['todo', 'in-progress', 'done'];

// Generate a random card
const generateRandomCard = () => {
  const randomTitleIndex = Math.floor(Math.random() * sampleTitles.length);
  const randomDescIndex = Math.floor(Math.random() * sampleDescriptions.length);
  const randomStatusIndex = Math.floor(Math.random() * statuses.length);

  return {
    title: sampleTitles[randomTitleIndex],
    description: sampleDescriptions[randomDescIndex],
    status: statuses[randomStatusIndex]
  };
};

// Generate and save sample cards
export const generateSampleCards = async (count = 10) => {
  try {
    const createdCards = [];
    
    for (let i = 0; i < count; i++) {
      const cardData = generateRandomCard();
      const response = await authAxios.post(`${API_URL}/cards`, cardData);
      createdCards.push(response.data);
    }
    
    return createdCards;
  } catch (error) {
    console.error('Error generating sample cards:', error);
    throw error;
  }
};
