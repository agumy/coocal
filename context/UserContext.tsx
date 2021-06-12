import React, { useContext, useEffect, useState } from "react";
import firebase from "firebase";
import { auth } from "../firebase";

interface Props {
  children: React.ReactNode;
}

export const UserContext = React.createContext<firebase.User | null>(null);

export const useUserContext = () => {
  const context = useContext(UserContext);

  return context;
};

export const UserContextProvider: React.VFC<Props> = ({ children }) => {
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
