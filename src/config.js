// Configuration settings for the application
import config from './config/default.json';

// Helper function to get a value using dot notation path (like "pagination.cardsPerPage")
const get = (path) => {
  const keys = path.split('.');
  return keys.reduce((obj, key) => 
    (obj && obj[key] !== undefined) ? obj[key] : undefined, config);
};

const configWithHelpers = {
  get,
  ...config
};

export default configWithHelpers;