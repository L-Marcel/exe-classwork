import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { createContext } from "use-context-selector";

interface AppProviderProps {
  children: ReactNode;
};

export const appContext = createContext({} as AppContext);

function AppProvider({ children }: AppProviderProps) {
  const router = useRouter();
  const [inputErrors, setInputErrors] = useState<InputErrors>({});
  const [user, setUser] = useState<User | null>(null);
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const _setClassroom = useCallback((classroom: Classroom) => {
    setClassroom(classroom);
  }, [setUser]);

  const _setUser = useCallback((user: User) => {
    setUser(user);
  }, [setUser]);

  function signOut() {
    setIsLoading(true);
    setUser(null);
    setClassroom(null);

    router.push("/api/logout");
  };

  const _setSearch = useCallback((search: string) => {
    setSearch(search);
  }, [setSearch]);

  const _setPage = useCallback((page: number) => {
    setPage(page);
  }, [setPage]);

  const _addInputErrors = useCallback((errors: InputErrors) => {
    setInputErrors(e => {
      const entries = Object.entries(errors);
      
      let _errors: InputErrors = {};
  
      for(let e in entries) {
        const [key, value] = entries[e];
  
        const message: string = value.message.replaceAll(`${key} `, "");
  
        _errors[key] = {
          message: `${message[0].toUpperCase()}${message.slice(1, message.length)}.`
        };
      };

      return { ...e, ..._errors };
    });
  }, [setInputErrors]);

  const _removeInputError = useCallback((name: string) => {
    setInputErrors(errors => {
      errors[name] = undefined;
      return errors;
    });
  }, [setInputErrors]);

  const _resetInputErrors = useCallback(() => {
    setInputErrors({});
  }, [setInputErrors]);

  const _setIsLoading = useCallback((isLoading: boolean) => {
    setIsLoading(isLoading);
  }, [setIsLoading]);

  useEffect(() => {
    setSearch("");
    setPage(0);
    _resetInputErrors();
  }, [
    router, 
    setSearch, 
    setPage, 
    _resetInputErrors
  ]);

  return (
    <appContext.Provider
      value={{
        user,
        setUser: _setUser,
        classroom,
        setClassroom: _setClassroom,
        signOut,
        search,
        setSearch: _setSearch,
        page,
        setPage: _setPage,
        inputErrors,
        addInputErrors: _addInputErrors,
        removeInputError: _removeInputError,
        resetInputErrors: _resetInputErrors,
        isLoading,
        setIsLoading: _setIsLoading
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export { AppProvider };

