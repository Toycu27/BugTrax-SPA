import { createContext } from "react";

const GlobalContext = createContext({
    user: {},
    setUser: () => {},
    deleteUser: () => {},
    hasRole: () => {},
    messages: {},
    addMessage: () => {},
    getMessages: () => {},
    setLastLocation: () => {},
    getLastLocation: () => {},
});

export default GlobalContext;