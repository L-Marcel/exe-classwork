import { useContextSelector } from "use-context-selector";
import { appContext } from "../AppProvider";

function useUser() {
  return useContextSelector(appContext, c => {
    return {
      user: c.user,
      setUser: c.setUser,
      signOut: c.signOut
    };
  });
};

export { useUser };