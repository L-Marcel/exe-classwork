
import { HStack, Stack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useInputErrors } from "../../contexts/hooks/useInputErrors";
import { useIsLoading } from "../../contexts/hooks/useIsLoading";
import { useUser } from "../../contexts/hooks/useUser";
import { Api } from "../../services/api";
import { ClassroomFormValidation } from "../../services/forms/validations/ClassroomFormValidations";
import { Button } from "../Buttons/Button";
import { Input } from "../Inputs";
import { Textarea } from "../Inputs/Textarea";
import { Title } from "../Title";

function TeamCreateForm() {
  const router = useRouter();
  const { user } = useUser();

  const { 
    startLoading,
    stopLoading,
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
    resolver: yupResolver(ClassroomFormValidation.create)
  });

  useEffect(() => {
    addInputErrors(errors);
  }, [errors]);

  function onSubmit(classroom: Classroom) {
    resetInputErrors();
    startLoading();

    Api.post("/user/classroom", classroom).then(() => {
      router.push(`/app/${user.githubId}/classrooms`);
    }).catch((err) => {
      stopLoading();
    });
  };

  return (
    <Stack
      as="form"
      spacing={5}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Title>
        Create a classroom
      </Title>
      <Input
        placeholder="Title"
        iconName="pencil"
        register={register("title")}
      />
      <Input
        placeholder="Subject"
        iconName="subject"
        register={register("subject")}
      />
      <Textarea
        placeholder="Description"
        register={register("description")}
        minH={100}
        maxH={200}
        resize="vertical"
      />
      <HStack spacing={4}>
        <Button
          type="submit"
          theme="primary"
          disabled={isLoading}
        >
          Create
        </Button>
        <Button
          type="reset"
          disabled={isLoading}
        >
          Reset
        </Button>
      </HStack>
    </Stack>
  );
};

export { TeamCreateForm };

