import React, { createContext, useState, useContext } from "react";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState([]);

  return <NotificationContext.Provider value={{ notification, setNotification }}>{children}</NotificationContext.Provider>;
};
