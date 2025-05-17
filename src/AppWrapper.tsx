import React from 'react';
import App from './App';
import { AuthProvider } from './context/AuthContext';

const AppWrapper: React.FC = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default AppWrapper;
