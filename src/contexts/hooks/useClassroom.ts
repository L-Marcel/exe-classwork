import { useContextSelector } from "use-context-selector";
import { appContext } from "../AppProvider";

function useClassroom() {
  return useContextSelector(appContext, c => {
    return {
      classroom: c.classroom,
      setClassroom: c.setClassroom
    };
  });
};

export { useClassroom };
