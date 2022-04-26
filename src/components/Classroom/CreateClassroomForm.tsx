
import { Heading, Stack } from "@chakra-ui/react";
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
import { Span } from "../Span";

function CreateClassroomForm() {
  const router = useRouter();
  const { user } = useUser();

  const { 
    startLoading,
    stopLoading
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
      console.log(err.message);
      stopLoading();
    });
  };

  return (
    <Stack
      as="form"
      spacing={5}
      alignItems={["center", "center", "flex-start"]}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Heading
        textAlign={["center", "center", "left"]}
        bgGradient="linear(to-r, primary.200, primary.600)"
        bgClip="text"
      >
        <Span color="primary.500">C</Span><Span>r</Span>eate a classroom
      </Heading>
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
      <Button
        type="submit"
        theme="primary"
      >
        Create
      </Button>
    </Stack>
  );
};

export { CreateClassroomForm };

