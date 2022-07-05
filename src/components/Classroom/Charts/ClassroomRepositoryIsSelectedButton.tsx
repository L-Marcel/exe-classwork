import { useClassroomPayloadIndex } from "../../../contexts/hooks/useClassroomPayloadIndex";
import { IconButton } from "../../Buttons/IconButton";
import { NamedIcon } from "../../NamedIcon";

function ClassroomRepositoryIsSelectedButton({ index }) {
  const { payloadIndex, setPayloadIndex } = useClassroomPayloadIndex();

  return (
    <IconButton
      aria-label="classroom-repository-select-button"
      p="0px!important"
      minW={2}
      minH={2}
      w="15px"
      h="15px"
      bgColor="transparent!important"
      onClick={() => setPayloadIndex(index)}
      icon={<NamedIcon
        name={payloadIndex === index? "eye-opened":"eye-closed"}
      />}
    />
  );
};

export {
  ClassroomRepositoryIsSelectedButton
};

