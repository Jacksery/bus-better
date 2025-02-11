"use client";

import { createContext, useContext, useState, PropsWithChildren } from "react";

interface FilterContextType {
  selectedRoutes: string[];
  setSelectedRoutes: React.Dispatch<React.SetStateAction<string[]>>;
  active: boolean;
  setActive: (active: boolean) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: PropsWithChildren) {
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);
  const [active, setActive] = useState(false);

  return (
    <FilterContext.Provider
      value={{
        selectedRoutes,
        setSelectedRoutes,
        active,
        setActive,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
}
