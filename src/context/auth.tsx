import { createContext, useContext, useReducer } from "react";

interface User {
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface State {
  authenticated: boolean;
  user: User | undefined | null;
  loading: boolean;
}

interface Action {
  type: string;
  payload: any;
}

interface IContext {
  (type: string, payload?: any): void;
}

const StateContext = createContext<State>({
  authenticated: false,
  user: null,
  loading: true,
});

const DispatchContext = createContext({} as IContext);

const reducer = (state: State, { type, payload }: Action) => {
  switch (type) {
    case "REAUTHENTICATED": 
      return {
        ...state,
        authenticated: true
      }
    case "LOGIN":
      return {
        ...state,
        authenticated: true,
        user: payload,
      };
    case "LOGOUT":
      return { ...state, authenticated: false, user: null };
    case "STOP_LOADING":
      return { ...state, loading: false };
    default:
      throw new Error(`Unknow action type: ${type}`);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, defaultDispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
    loading: true,
  });

  const dispatch = (type: string, payload?: any) =>
    defaultDispatch({ type, payload });

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
