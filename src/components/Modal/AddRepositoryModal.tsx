import { HStack, Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useApiResult } from "../../contexts/hooks/useApiResult";
import { useInputErrors } from "../../contexts/hooks/useInputErrors";
import { useIsLoading } from "../../contexts/hooks/useIsLoading";
import { RepositoryFormValidations } from "../../services/forms/validations/RepositoryFormValidations";
import { selectStyle } from "../../theme/select/selectStyle";
import { Button } from "../Buttons/Button";
import { Select } from "../Inputs/Select";

type RepositoryData = {
  repository: Repository;
};
interface AddRepositoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: ({ repository }: RepositoryData) => void;
};

function AddRepositoryModal({ 
  isOpen, 
  onClose,
  onSubmit
}: AddRepositoryModalProps) {
  const { data, isFetching: repositoriesIsLoading } = useApiResult<Repository>({
    queryTo: `/user/github/repositories?excludeNotLoaded=true`,
    initialData: []
  });

  const { 
    startLoading,
    isLoading
  } = useIsLoading();

  const { 
    addInputErrors, 
    resetInputErrors
  } = useInputErrors();

  const { 
    register, 
    handleSubmit,
    formState: { 
      errors
    }
  } = useForm({
    resolver: yupResolver(RepositoryFormValidations.create)
  });
  
  useEffect(() => {
    addInputErrors(errors);
  }, [errors]);

  function handleOnSubmit(data: RepositoryData) {
    resetInputErrors();
    startLoading();
    
    onSubmit(data);
  };
  
  return (
    <Modal isCentered size="lg" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px) hue-rotate(10deg)"
      />
      <ModalContent
        as="form"
        onSubmit={handleSubmit(handleOnSubmit)}
        bgColor="solid.25"
        borderRadius={8}
        p={4}
      >
        <ModalBody p={0}>
          <Select
            register={register("repository")}
            placeholder="Select the repository..."
            isLoading={repositoriesIsLoading}
            w="100%"
            maxW="100%"
            options={[
              {
                value: null,
                label: "Repositories:",
                color: "var(--chakra-color-solid-200)",
                isFixed: true,
                isDisabled: true
              },
              ...data?.map(m => {
                return {
                  value: m,
                  label: m.fullname,
                  color: "var(--chakra-color-solid-200)"
                };
              })
            ]}
            selectStyles={selectStyle(8)}
          />
        </ModalBody>
        <ModalFooter px={0} pb={0}>
          <HStack
            spacing={2}
            flexWrap="wrap"
          >
            <Button 
              theme="primary" 
              type="submit"
              disabled={isLoading}
              onClick={resetInputErrors}
            >Confirm</Button>
            <Button onClick={onClose}>Close</Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export { AddRepositoryModal };

