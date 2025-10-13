import React, { createContext, useContext } from 'react';

const TaskContext = createContext();

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children, value }) => {
  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
