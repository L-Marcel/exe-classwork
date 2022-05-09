import { HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";
import { Button } from "../Buttons/Button";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: ModalDisclosureData;
};

function Dialog({ 
  isOpen, 
  onClose,
  data
}: DialogProps) {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px) hue-rotate(10deg)"
      />
      <ModalContent
        bgColor="solid.25"
      >
        <ModalHeader
          mr={25}
        >
          {data?.title}
        </ModalHeader>
        <ModalCloseButton
          m={2}
        />
        <ModalBody>
          {data?.body ?? <Text whiteSpace="pre-wrap">{data?.text}</Text>}
        </ModalBody>
        <ModalFooter>
          <HStack
            spacing={2}
            flexWrap="wrap"
          >
            {
              data?.options?.map(o => {
                return o;
              })
            }
            <Button onClick={onClose}>Close</Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export { Dialog };

