import { useContextSelector } from "use-context-selector";
import { appContext } from "../AppProvider";

function useInputErrors() {
  return useContextSelector(appContext, c => {
    return {
      inputErrors: c.inputErrors,
      addInputErrors: c.addInputErrors,
      removeInputError: c.removeInputError
    };
  });
};

export { useInputErrors };

