import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { createContext } from "use-context-selector";
import { Api } from "../services/api";

interface AppProviderProps {
  children: ReactNode;
};

export const appContext = createContext({} as AppContext);

function AppProvider({ children }: AppProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const _setUser = useCallback((user: User) => {
    setUser(user);
  }, [setUser]);

  const signOut = useCallback(() => {
    setUser(null);
  }, [setUser]);

  const _setSearch = useCallback((search: string) => {
    setSearch(search);
  }, [setSearch]);

  const _setPage = useCallback((page: number) => {
    setPage(page);
  }, [setPage]);

  useEffect(() => {
    if(router.query?.githubId) {
      Api.get(`/user/${router.query?.githubId}`).then(res => {
        setUser(res.data);
      }).catch((err) => {
        signOut();
      });
    };
  }, [Api, router, setUser, signOut]);

  useEffect(() => {
    setSearch("");
    setPage(0);
  }, [router, setSearch, setPage]);

  return (
    <appContext.Provider
      value={{
        user,
        setUser: _setUser,
        signOut,
        search,
        setSearch: _setSearch,
        page,
        setPage: _setPage 
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export { AppProvider };

