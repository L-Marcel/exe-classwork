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
  const [inputErrors, setInputErrors] = useState<InputError[]>([]);
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

  const _addInputErrors = useCallback((errors: InputError[]) => {
    setInputErrors(e => {
      const data = [...e, ...errors];
      const _errors = data.reduce((pre, cur) => {
        const alreadyExists = pre.some(err => err.name === cur.name);

        if(!alreadyExists) {
          pre.push(cur);
        };

        return pre;
      }, []);

      return _errors;
    });
  }, [setInputErrors]);

  const _removeInputError = useCallback((name: string) => {
    setInputErrors(e => e.filter(err => err.name !== name));
  }, [setInputErrors]);

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
    setInputErrors([]);
  }, [
    router, 
    setSearch, 
    setPage, 
    setInputErrors
  ]);

  return (
    <appContext.Provider
      value={{
        user,
        setUser: _setUser,
        signOut,
        search,
        setSearch: _setSearch,
        page,
        setPage: _setPage,
        inputErrors,
        addInputErrors: _addInputErrors,
        removeInputError: _removeInputError
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export { AppProvider };

