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

interface AddRepositoryModalProps {
  isOpen: boolean;
  onClose: () => void;
};

function AddRepositoryModal({ 
  isOpen, 
  onClose
}: AddRepositoryModalProps) {
  const { data, isFetching: repositoriesIsLoading } = useApiResult<Repository>({
    queryTo: `/user/github/repositories`,
    initialData: []
  });

  const { 
    startLoading
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

  function onSubmit(team: TeamInputData) {
    resetInputErrors();
    startLoading();

    if(team.repository) {
      team.repository.owner = {
        id: team.repository.owner.id,
        username: team.repository.owner.username
      };
    };

    /*Api.post(`/user/classroom/${classroom.id}/team`, team).then(() => {
      router.push(`/app/${user.githubId}/classrooms/${classroom.id}`);
    }).catch((err) => {
      console.log(err);
      stopLoading();
    });*/
  };
  
  
  return (
    <Modal isCentered size="lg" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px) hue-rotate(10deg)"
      />
      <ModalContent
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
            <Button theme="primary" onClick={() => ""}>Confirm</Button>
            <Button onClick={onClose}>Close</Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export { AddRepositoryModal };

