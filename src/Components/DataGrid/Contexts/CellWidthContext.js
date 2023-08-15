import React, { createContext, useReducer } from "react";

const initialStore = {};
const CellWidthContext = createContext(initialStore);
const { Provider } = CellWidthContext;

const CellWidthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, { field, width }) => {
    return { ...state, [field]: width };
  }, initialStore);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { CellWidthContext, CellWidthContextProvider };
