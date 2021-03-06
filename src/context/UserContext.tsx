import React, { useContext, useEffect, useState } from "react";
import firebase from "firebase";
import { auth } from "../firebase";
import { useRouter } from "next/dist/client/router";
import { useCallback } from "react";

interface Props {
  children: React.ReactNode;
}

export const UserContext = React.createContext<{
  user: firebase.User | null;
  isLoading: boolean;
  signOut: () => void;
}>({ user: null, isLoading: false, signOut: () => {} });

export const useUserContext = () => {
  const context = useContext(UserContext);

  return context;
};

export const UserContextProvider: React.VFC<Props> = ({ children }) => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signOut = useCallback(async () => {
    await auth.signOut();
  }, []);

  const router = useRouter();

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      setUser(user);
      setIsLoading(false);

      if (user && !user.emailVerified) {
        router.push("/sign-up/verify");
      }
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, signOut }}>
      {children}
    </UserContext.Provider>
  );
};
