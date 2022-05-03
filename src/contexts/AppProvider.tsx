import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { createContext } from "use-context-selector";
import { getInputErrorMessage } from "../utils/getInputErrorMessage";

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

  const _setClassroom = useCallback((classroom: Classroom) => {
    setClassroom(classroom);
  }, [setClassroom]);

  const _setUser = useCallback((user: User) => {
    setUser(user);
  }, [setUser]);

  const _signOut = useCallback(() => {
    setIsLoading(true);

    router.push("/api/logout").then(() => {
      setUser(null);
      setClassroom(null);
    }).catch(() => {
      setIsLoading(false);
    });
  }, [setIsLoading, setUser, setClassroom, router]);

  const _addInputErrors = useCallback((errors: InputErrors) => {
    setInputErrors(e => getInputErrorMessage(errors, e));
  }, [setInputErrors, getInputErrorMessage]);

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
    _resetInputErrors();
  }, [
    router,
    _resetInputErrors
  ]);

  return (
    <appContext.Provider
      value={{
        user,
        setUser: _setUser,
        classroom,
        setClassroom: _setClassroom,
        signOut: _signOut,
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

