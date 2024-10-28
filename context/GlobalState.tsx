import React, { createContext, useContext, useReducer, ReactNode } from "react";

// Define types for state and props
type State = {
  connectedDevice: any;
  strapMACs: string[];
  tensions: number[];
};

type Action =
  | { type: "SET_CONNECTED_DEVICE"; payload: any }
  | { type: "SET_STRAPMACS"; payload: { mac: string; tension: number } };

// Define the type for the context provider's props
interface GlobalProviderProps {
  children: ReactNode;
}

const initialState: State = {
  connectedDevice: null,
  strapMACs: [],
  tensions: [],
};
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
    case "SET_CONNECTED_DEVICE":
      return { ...state, connectedDevice: action.payload };
    case "SET_STRAPMACS": {
      const { payload } = action; // payload: { mac: string, tension: number }
      const macIndex = state.strapMACs.indexOf(payload.mac);

      if (macIndex !== -1) {
        // MAC address already exists, update corresponding tension
        const updatedTensions = [...state.tensions];
        updatedTensions[macIndex] = payload.tension;
        return { ...state, tensions: updatedTensions };
      } else {
        // MAC address does not exist, add it to strapMACs and tension to tensions
        return {
          ...state,
          strapMACs: [...state.strapMACs, payload.mac],
          tensions: [...state.tensions, payload.tension],
        };
      }
    }
    default:
      return state;
  }
};

export const useGlobalState = () => useContext(GlobalContext);
