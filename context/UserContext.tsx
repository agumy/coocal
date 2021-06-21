import React, { useContext, useEffect, useState } from "react";
import firebase from "firebase";
import { auth, firestore } from "../firebase";
import { useRouter } from "next/dist/client/router";

interface Props {
  children: React.ReactNode;
}

export const UserContext = React.createContext<{
  user: firebase.User | null;
  scope: string | null;
}>({ user: null, scope: null });

export const useUserContext = () => {
  const context = useContext(UserContext);

  return context;
};
export const UserContextProvider: React.VFC<Props> = ({ children }) => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [scope, setScope] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      setUser(user);

      if (user && !user.emailVerified) {
        router.push("/sign-up/verify");
      }
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, scope }}>
      {children}
    </UserContext.Provider>
  );
};
