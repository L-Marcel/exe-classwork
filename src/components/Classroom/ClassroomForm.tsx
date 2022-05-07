
import { Alert, AlertIcon, AlertProps, Box, HStack, Stack, Text } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useInputErrors } from "../../contexts/hooks/useInputErrors";
import { useIsLoading } from "../../contexts/hooks/useIsLoading";
import { useUser } from "../../contexts/hooks/useUser";
import { Api } from "../../services/api";
import { ClassroomFormValidation } from "../../services/forms/validations/ClassroomFormValidations";
import { Button } from "../Buttons/Button";
import { Input } from "../Inputs";
import { Switch } from "../Inputs/Switch";
import { Textarea } from "../Inputs/Textarea";
import { Link } from "../Link";
import { Span } from "../Span";
import { Title } from "../Title";

interface ClassroomFormProps {
  classroom?: Classroom;
};

function ClassroomForm({
  classroom
}: ClassroomFormProps) {
  const [oldClassroom, setOldClassroom] = useState(classroom ?? null);
  const [message, setMessage] = useState<{
    text: string,
    type: AlertProps["status"]
  } | null>(null);

  const router = useRouter();
  const { user } = useUser();

  let timer;

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
    reset,
    setValue,
    watch,
    formState: { 
      errors
    }
  } = useForm({
    resolver: yupResolver(ClassroomFormValidation.create),
    defaultValues: {
      inviteCodeIsRestricted: true,
      teamsAreRestricted: false,  
      rolesAreRestricted: false,
      repositoriesAreRestricted: true,
      ...oldClassroom as any
    }
  });

  useEffect(() => {
    addInputErrors(errors);
  }, [errors]);

  function sendMessage(data: typeof message) {
    clearTimeout(timer);
    setMessage(data);
    timer = setTimeout(() => {
      setMessage(null);
    }, 8000);
  };

  function handleForceReset() {
    setValue("title", oldClassroom.title);
    setValue("subject", oldClassroom.subject);
    setValue("description", oldClassroom.description);
    setValue("teamsAreRestricted", oldClassroom.teamsAreRestricted);
    setValue("inviteCodeIsRestricted", oldClassroom.inviteCodeIsRestricted);
    setValue("rolesAreRestricted", oldClassroom.rolesAreRestricted);
    setValue("repositoriesAreRestricted", oldClassroom.repositoriesAreRestricted);
  };

  function onSubmit(data: Classroom) {
    resetInputErrors();
    startLoading();

    if(classroom && !(JSON.stringify(oldClassroom) === JSON.stringify(data))) {
      Api.put(`/user/classroom/${classroom.id}`, {
        title: data.title,
        subject: data.subject,
        description: data.description,
        inviteCodeIsRestricted: data.inviteCodeIsRestricted,
        rolesAreRestricted: data.rolesAreRestricted,
        teamsAreRestricted: data.teamsAreRestricted,
        repositoriesAreRestricted: data.repositoriesAreRestricted
      }).then(() => {
        setOldClassroom(data);
        sendMessage({
          text: "Classroom is updated!",
          type: "success"
        });
        stopLoading();
      }).catch((err) => {
        sendMessage({
          text: `Error on update: ${err.message ?? "unknown"}`,
          type: "error"
        });
        stopLoading();
      });
    } else if(!classroom) {
      Api.post("/user/classroom", data).then(() => {
        router.push(`/app/${user.githubId}/classrooms`);
      }).catch((err) => {
        sendMessage({
          text: `Error on create: ${err.message ?? "unknown"}`,
          type: "error"
        });
        stopLoading();
      });
    } else {
      sendMessage({
        text: `No changes detected to update the classroom`,
        type: "warning"
      });
      stopLoading();
    };
  };

  return (
    <Stack
      as="form"
      spacing={5}
      onSubmit={handleSubmit(onSubmit)}
    >
      {classroom && 
        <Link 
          href={`/app/${user.githubId}/classrooms/${classroom.id}`}
          tabIndex={0}
        >
          {'<'}- return
        </Link>
      }
      <Box
        display="flex"
        flexDir="column"
      >
        <Title>
          {classroom? `Configuration`:"Create a classroom"}
        </Title>
        {
          classroom && <>
            <Text
              mt={2}
            >
              <Span
                color="primary.400"
              >Authorized user:</Span> {user.name ?? user.username}
            </Text>
            <Text>
              <Span
                color="primary.400"
              >Last title:</Span> {oldClassroom.title}
            </Text>
          </>
        }
      </Box>
      <Input
        placeholder="Title *"
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
      { message && 
        <Alert 
          status={message.type}
          variant="left-accent"
          borderRadius={8}
          borderLeftWidth={2}
          w={[300, 350, 500]}
          maxW="80vw"
          alignItems="flex-start"
        >
          <AlertIcon/>
          {message.text}
        </Alert>
      }
      <Title>
        Additional configuration
      </Title>
      <Stack
        pb={2}
      >
        <Switch
          text="Is invite code restricted?"
          register={register("inviteCodeIsRestricted")}
          watch={watch}
        />
        <Switch
          text="Are teams restricted?"
          register={register("teamsAreRestricted")}
          watch={watch}
        />
        <Switch
          text="Are roles restricted?"
          register={register("rolesAreRestricted")}
          watch={watch}
        />
        <Switch
          text="Are repositories restricted?"
          register={register("repositoriesAreRestricted")}
          watch={watch}
        />
      </Stack>
      <HStack
        spacing={4}
      >
        <Button
          type="submit"
          theme="primary"
          disabled={isLoading}
          onClick={resetInputErrors}
        >
          {classroom? "Save":"Create"}
        </Button>
        { !classroom && <Button
          type="button"
          disabled={isLoading}
          onClick={reset}
        >
          Reset
        </Button> }
        {
          classroom && <>
            <Button
              type="button"
              disabled={isLoading}
              onClick={handleForceReset}
            >
              Reset
            </Button>
          </>
        }
      </HStack>
    </Stack>
  );
};

export { ClassroomForm };

