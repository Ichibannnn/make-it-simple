import React, { createContext, useState } from "react";

export const ParameterContext = createContext();

export const ParameterProvider = ({ children }) => {
  const [parameter, setParameter] = useState("");

  return <ParameterContext.Provider value={{ parameter, setParameter }}>{children}</ParameterContext.Provider>;
};
