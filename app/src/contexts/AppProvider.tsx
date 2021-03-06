import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { createContext } from "use-context-selector";
import { ServerSocket } from "../services/serverSocket";
import { getInputErrorMessage } from "../utils/getInputErrorMessage";

interface AppProviderProps {
  children: ReactNode;
};

export const appContext = createContext({} as AppContext);

function AppProvider({ children }: AppProviderProps) {
  const router = useRouter();
  
  const [inputErrors, setInputErrors] = useState<InputErrors>({});
  const [user, setUser] = useState<User | null>(null);
  
  const [socket, setSocket] = useState<Socket | null>(null);
  const [global, setGlobal] = useState<Socket | null>(null);

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [repository, setRepository] = useState<Repository | null>(null);

  const [progress, setProgress] = useState<AllNamedProgress>({
    target: 0,
    value: 0,
    all: []
  });

  const [isLoading, setIsLoading] = useState(false);

  const _setRepository = useCallback((repository: Repository) => {
    setRepository(repository);
  }, [setRepository]);

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

  const _setProgress = useCallback((progress: AllNamedProgress) => {
    setProgress(progress);
  }, [setProgress]);

  const _getProgressByName = useCallback((name: string) => {
    return progress.all.find(p => p.name === name);
  }, [progress])

  const _setIsLoading = useCallback((isLoading: boolean) => {
    setIsLoading(isLoading);
  }, [setIsLoading]);

  useEffect(() => {
    _resetInputErrors();
  }, [
    router,
    _resetInputErrors
  ]);

  useEffect(() => {
    if(socket === null && user !== null) {
      ServerSocket.initialize(`/${user.id}`, (_socket) => {
        setSocket(_socket);
      }, () => {
        //remember...
      });
    };
  }, [setSocket, socket, user]);

  useEffect(() => {
    if(global === null && user !== null) {
      ServerSocket.initialize("", (_socket) => {
        setGlobal(_socket);
      }, () => {
        //remember...
      });
    };
  }, [setGlobal, global, user]);

  return (
    <appContext.Provider
      value={{
        user,
        setUser: _setUser,
        classroom,
        setClassroom: _setClassroom,
        repository,
        setRepository: _setRepository,
        progress,
        setProgress: _setProgress,
        getProgressByName: _getProgressByName,
        signOut: _signOut,
        inputErrors,
        addInputErrors: _addInputErrors,
        removeInputError: _removeInputError,
        resetInputErrors: _resetInputErrors,
        isLoading,
        setIsLoading: _setIsLoading,
        socket,
        global
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export { AppProvider };

