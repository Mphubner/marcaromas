import React, { createContext, useContext, useState } from 'react';

const UserPreferencesContext = createContext();

export function UserPreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState(null);
  return (
    <UserPreferencesContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (!context) throw new Error('useUserPreferences must be used within UserPreferencesProvider');
  return context;
}
