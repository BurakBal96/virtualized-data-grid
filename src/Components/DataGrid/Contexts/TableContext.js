import React, { createContext, useReducer } from "react";

const initialStore = {};
const TableContext = createContext(initialStore);
const { Provider } = TableContext;

const TableContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    return { ...state, ...action };
  }, initialStore);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { TableContext, TableContextProvider };
