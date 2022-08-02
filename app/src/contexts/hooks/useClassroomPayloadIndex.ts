import { useContextSelector } from "use-context-selector";
import { classroomContext } from "../ClassroomProvider";

function useClassroomPayloadIndex() {
  return useContextSelector(classroomContext, c => {
    return {
      payloadIndex: c.payloadIndex,
      setPayloadIndex: c.setPayloadIndex
    };
  });
};

export { useClassroomPayloadIndex };

