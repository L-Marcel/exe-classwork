import { throttle } from "lodash";
import { ReactNode, useCallback, useRef, useState } from "react";
import { createContext } from "use-context-selector";

interface ClassroomProviderProps {
  children: ReactNode;
};

export const classroomContext = createContext({} as ClassroomContext);

function ClassroomProvider({ children }: ClassroomProviderProps) {
  const [payloadIndex, setPayloadIndex] = useState<number>(-1);

  const throttleCallback = useRef(throttle((fn: Function) => {
    fn();
  }, 100));

  const _setPayloadIndex = useCallback((payloadIndex: number) => {
    throttleCallback.current(() => setPayloadIndex(payloadIndex));
  }, [setPayloadIndex, throttleCallback]);

  return (
    <classroomContext.Provider
      value={{
        payloadIndex,
        setPayloadIndex: _setPayloadIndex
      }}
    >
      {children}
    </classroomContext.Provider>
  );
};

export { ClassroomProvider };

