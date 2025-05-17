import { createCard } from '../services/api';

// Sample card titles
const cardTitles = [
  'Implement Login Feature',
  'Design Dashboard UI',
  'Fix Navigation Bug',
  'Update User Documentation',
  'Optimize Database Queries',
  'Add Export to PDF Feature',
  'Refactor Authentication Code',
  'Create User Settings Page',
  'Implement Dark Mode',
  'Add Email Notifications',
  'Update Dependencies',
  'Fix Mobile Responsiveness Issues'
];

// Sample card descriptions
const cardDescriptions = [
  'We need to implement a secure login system with password reset functionality.',
  'Create a modern and intuitive dashboard interface for users to visualize their data.',
  'There is a bug in the navigation menu that causes it to collapse unexpectedly.',
  'Update the user documentation to reflect recent changes in the application.',
  'Optimize database queries to improve application performance.',
  'Add the ability to export data to PDF format for reporting purposes.',
  'Refactor the authentication code to use the latest security practices.',
  'Create a dedicated page for users to manage their account settings.',
  'Implement a dark mode option for better user experience in low-light environments.',
  'Add email notification system for important events and updates.',
  'Update all dependencies to their latest versions to ensure security and performance.',
  'Fix issues with the application layout on mobile devices.'
];

// Status options
const statusOptions = ['todo', 'in-progress', 'done'];

// Generate a random date within the next 30 days
const generateRandomDueDate = (): string => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + Math.floor(Math.random() * 30) + 1);
  return futureDate.toISOString();
};

// Generate a random card
const generateRandomCard = () => {
  const randomTitleIndex = Math.floor(Math.random() * cardTitles.length);
  const randomDescIndex = Math.floor(Math.random() * cardDescriptions.length);
  const randomStatusIndex = Math.floor(Math.random() * statusOptions.length);
  
  return {
    title: cardTitles[randomTitleIndex],
    description: cardDescriptions[randomDescIndex],
    status: statusOptions[randomStatusIndex],
    dueDate: generateRandomDueDate()
  };
};

// Create multiple sample cards
export const createSampleCards = async (count: number = 10): Promise<boolean> => {
  try {
    console.log(`Creating ${count} sample cards...`);
    
    const creationPromises = [];
    
    for (let i = 0; i < count; i++) {
      const cardData = generateRandomCard();
      creationPromises.push(createCard(cardData));
    }
    
    const results = await Promise.all(creationPromises);
    const successCount = results.filter(result => result !== null).length;
    
    console.log(`Successfully created ${successCount} out of ${count} cards.`);
    return successCount > 0;
  } catch (error) {
    console.error('Error creating sample cards:', error);
    return false;
  }
};
