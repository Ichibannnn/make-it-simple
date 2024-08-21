import React, { createContext, useContext } from "react";
import useSignalRConnection from "../hooks/useSignalRConnection";

const SignalRContext = createContext(null);

export const SignalRProvider = ({ children }) => {
  const connection = useSignalRConnection();

  return <SignalRContext.Provider value={connection}>{children}</SignalRContext.Provider>;
};

export const useSignalR = () => useContext(SignalRProvider);
