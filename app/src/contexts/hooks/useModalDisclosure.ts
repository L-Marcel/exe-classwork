import { useDisclosure } from "@chakra-ui/react";
import { useCallback, useState } from "react";

function useModalDisclosure() {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [data, setData] = useState<ModalDisclosureData>(null);

  const callModal = useCallback((data: ModalDisclosureData) => {
    setData(data);
    onOpen();
  }, [setData]);

  return {
    onClose,
    isOpen,
    modalData: data,
    callModal
  };
};

export { useModalDisclosure };

