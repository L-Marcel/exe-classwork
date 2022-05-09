
import { HStack, Stack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Repository } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useApiResult } from "../../contexts/hooks/useApiResult";
import { useClassroom } from "../../contexts/hooks/useClassroom";
import { useInputErrors } from "../../contexts/hooks/useInputErrors";
import { useIsLoading } from "../../contexts/hooks/useIsLoading";
import { useUser } from "../../contexts/hooks/useUser";
import { Api } from "../../services/api";
import { TeamFormValidations } from "../../services/forms/validations/TeamFormValidations";
import { selectStyle } from "../../theme/select/selectStyle";
import { handlePreventFormSubmitOnEnter } from "../../utils/preventFormtSubmitOnEnter";
import { Button } from "../Buttons/Button";
import { Input } from "../Inputs";
import { Select } from "../Inputs/Select";
import { Textarea } from "../Inputs/Textarea";
import { Title } from "../Title";

function TeamCreateForm() {
  const router = useRouter();
  const { classroom } = useClassroom();
  const { user } = useUser();

  const { data, isFetching: repositoriesIsLoading } = useApiResult<Repository>({
    queryTo: `/user/classroom/${classroom.id}/members/repositories`,
    initialData: []
  });

  const { data: members, isFetching: membersIsLoading } = useApiResult<ClassroomRelation>({
    queryTo: `/user/classroom/${classroom.id}/members/all`,
    initialData: []
  });

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
    watch,
    reset,
    formState: { 
      errors
    }
  } = useForm({
    resolver: yupResolver(TeamFormValidations.create)
  });
  
  useEffect(() => {
    addInputErrors(errors);
  }, [errors]);

  function onSubmit(team: TeamInputData) {
    resetInputErrors();
    startLoading();

    const leaderIndex = team.users.findIndex(u => u.user.id === team.leader.user.id);

    if(leaderIndex < 0) {
      addInputErrors({
        leader: {
          message: "Not found in members."
        }
      });
      stopLoading();
      return null;
    };

    team.users[leaderIndex] = team.leader;
    team.leader = undefined;

    team.users = team.users.map(u => ({
      role: u.role,
      user: {
        id: u.user.id,
        username: u.user.username
      }
    })) as any;

    if(team.repository) {
      team.repository.owner = {
        id: team.repository.owner.id,
        username: team.repository.owner.username
      };
    };

    Api.post(`/user/classroom/${classroom.id}/team`, team).then(() => {
      router.push(`/app/${user.githubId}/classrooms/${classroom.id}`);
    }).catch((err) => {
      console.log(err);
      stopLoading();
    });
  };
  
  return (
    <Stack
      as="form"
      spacing={5}
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={handlePreventFormSubmitOnEnter}
    >
      <Title>
        Create a team
      </Title>
      <Input
        placeholder="Title *"
        iconName="pencil"
        register={register("title")}
      />
      <Textarea
        placeholder="Description"
        register={register("description")}
        minH={100}
        maxH={200}
        resize="vertical"
      />
      <Select
        register={register("repository")}
        placeholder="Selecte the repository..."
        isLoading={repositoriesIsLoading}
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
      <Select
        register={register("users")}
        placeholder="Selecte the users..."
        isLoading={repositoriesIsLoading}
        isMulti
        options={[
          {
            value: null,
            label: "Members:",
            color: "var(--chakra-color-solid-200)",
            isFixed: true,
            isDisabled: true
          },
          ...members?.map(m => {
            return {
              value: {
                ...m,
                role: "MEMBER"
              },
              label: m.user.name ?? m.user.username,
              color: "var(--chakra-color-solid-200)"
            };
          })
        ]}
        selectStyles={selectStyle(8)}
      />
      <Title
        fontSize="1.4rem"
      >
        Leader
      </Title>
      <Select
        register={register("leader")}
        placeholder="Selecte the team leader..."
        isLoading={repositoriesIsLoading}
        options={[
          {
            value: null,
            label: "Team members:",
            color: "var(--chakra-color-solid-200)",
            isFixed: true,
            isDisabled: true
          },
          ...(watch("users") ?? []).map(m => {
            return {
              value: {
                ...m,
                role: "LEADER"
              },
              label: m.user.name ?? m.user.username,
              color: "var(--chakra-color-solid-200)"
            };
          })
        ]}
        selectStyles={selectStyle(8)}
      />
      <HStack spacing={4}>
        <Button
          type="submit"
          theme="primary"
          disabled={isLoading}
          onClick={resetInputErrors}
        >
          Create
        </Button>
        <Button
          type="reset"
          disabled={isLoading}
          onClick={reset}
        >
          Reset
        </Button>
      </HStack>
    </Stack>
  );
};

export { TeamCreateForm };

