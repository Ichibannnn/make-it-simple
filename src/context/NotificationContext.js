import React, { createContext, useContext } from "react";
import { useGetNotificationQuery } from "../features/api_notification/notificationApi";
import { useSelector } from "react-redux";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth === true);

  const { data, error, isLoading } = useGetNotificationQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnMountOrArgChange: true,
  });

  return <NotificationContext.Provider value={{ data, error, isLoading }}>{children}</NotificationContext.Provider>;
};

export const useNotification = () => {
  return useContext(NotificationContext);
};
