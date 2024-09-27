import React, { createContext, useContext, useReducer, ReactNode } from "react";

// Define types for state and props
type State = {
  tension: number;
  connectedDevice: any;
};

type Action =
  | { type: "SET_TENSION"; payload: number }
  | { type: "SET_CONNECTED_DEVICE"; payload: any };

// Define the type for the context provider's props
interface GlobalProviderProps {
  children: ReactNode;
}

const initialState: State = { tension: 0, connectedDevice: null };
const GlobalContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Global Provider component with proper typing for children
export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_TENSION":
      return { ...state, tension: action.payload };
    case "SET_CONNECTED_DEVICE":
      return { ...state, connectedDevice: action.payload };
    default:
      return state;
  }
};

export const useGlobalState = () => useContext(GlobalContext);
