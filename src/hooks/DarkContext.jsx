import { createContext, useState } from "react";

export const DarkContext = createContext();

export function DarkProvider({ children }) {
  const [dark, setDark] = useState(false);

  return (
    <DarkContext.Provider value={{ dark, setDark }}>
      {children}
    </DarkContext.Provider>
  );
}
