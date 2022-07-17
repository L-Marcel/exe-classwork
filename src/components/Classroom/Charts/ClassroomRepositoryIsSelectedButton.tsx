import { useClassroomPayloadIndex } from "../../../contexts/hooks/useClassroomPayloadIndex";
import { IconButton } from "../../Buttons/IconButton";
import { NamedIcon } from "../../NamedIcon";
import { TooltipOnHover } from "../../TooltipOnHover";

function ClassroomRepositoryIsSelectedButton({ index }) {
  const { payloadIndex, setPayloadIndex } = useClassroomPayloadIndex();

  return (
    <TooltipOnHover
      label={payloadIndex === index? "Hide":"Show"}
    >
      <IconButton
        aria-label="classroom-repository-select-button"
        p="0px!important"
        minW={2}
        minH={2}
        w="15px"
        h="15px"
        bgColor="transparent!important"
        onClick={() => payloadIndex === index? setPayloadIndex(-1):setPayloadIndex(index)}
        icon={<NamedIcon
          name={payloadIndex === index? "eye-opened":"eye-closed"}
        />}
      />
    </TooltipOnHover>
  );
};

export {
  ClassroomRepositoryIsSelectedButton
};

