import React, { createContext, useContext } from "react";
import useSignalRConnection from "../hooks/useSignalRConnection";

const SignalRContext = createContext(null);

export const SignalRProvider = ({ children }) => {
  const notification = useSignalRConnection();

  // console.log("CONNECTION: ", hubNotification);

  return <SignalRContext.Provider value={notification}>{children}</SignalRContext.Provider>;
};

export const useSignalR = () => useContext(SignalRProvider);
