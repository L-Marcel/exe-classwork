import { User } from "@prisma/client";
import { createContext } from "use-context-selector";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Api } from "../services/api";

interface AppProviderProps {
  children: ReactNode;
};

export const appContext = createContext({} as AppContext);

function AppProvider({ children }: AppProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const _setUser = useCallback((user: User) => {
    setUser(user);
  }, [setUser]);

  const signOut = useCallback(() => {
    setUser(null);
  }, [setUser]);

  useEffect(() => {
    if(router.query?.githubId) {
      Api.get(`/user/${router.query?.githubId}`).then(res => {
        setUser(res.data);
      }).catch(() => {
        signOut();
      });
    };
  }, [Api, router, setUser, signOut]);

  return (
    <appContext.Provider
      value={{
        user,
        setUser: _setUser,
        signOut
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export { AppProvider };