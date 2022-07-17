
import { Alert, AlertIcon, AlertProps, Box, HStack, Stack, Text } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Repository } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useApiResult } from "../../contexts/hooks/useApiResult";
import { useClassroom } from "../../contexts/hooks/useClassroom";
import { useInputErrors } from "../../contexts/hooks/useInputErrors";
import { useIsLoading } from "../../contexts/hooks/useIsLoading";
import { useModalDisclosure } from "../../contexts/hooks/useModalDisclosure";
import { useUser } from "../../contexts/hooks/useUser";
import { Api } from "../../services/api";
import { TeamFormValidations } from "../../services/forms/validations/TeamFormValidations";
import { selectStyle } from "../../theme/select/selectStyle";
import { handlePreventFormSubmitOnEnter } from "../../utils/preventFormtSubmitOnEnter";
import { Button } from "../Buttons/Button";
import { Input } from "../Inputs";
import { Select } from "../Inputs/Select";
import { Textarea } from "../Inputs/Textarea";
import { Link } from "../Link";
import { Dialog } from "../Modal/Dialog";
import { Title } from "../Title";

interface TeamCreateFormProps {
  team?: Team;
};

function TeamCreateForm({
  team
}: TeamCreateFormProps) {
  const { callModal, onClose, isOpen, modalData } = useModalDisclosure();
  const [oldTeam, setOldTeam] = useState(team ?? null);

  const router = useRouter();
  
  const { classroom } = useClassroom();
  const { user } = useUser();

  const [message, setMessage] = useState<{
    text: string,
    type: AlertProps["status"]
  } | null>(null);

  let timer;

  function sendMessage(data: typeof message) {
    clearTimeout(timer);
    setMessage(data);
    timer = setTimeout(() => {
      setMessage(null);
    }, 8000);
  };

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
    setValue,
    formState: { 
      errors
    }
  } = useForm({
    resolver: yupResolver(TeamFormValidations.create),
    defaultValues: team? {
      leader: team.users.find(u => u.role === "LEADER"),
      ...team as any
    }:undefined
  });
  
  useEffect(() => {
    addInputErrors(errors);
  }, [errors]);

  function onSubmit(_team: TeamInputData) {
    resetInputErrors();
    startLoading();

    const old = { ...oldTeam };

    const leaderIndex = _team.users.findIndex(u => u.user.id === _team.leader.user.id);

    if(leaderIndex < 0) {
      addInputErrors({
        leader: {
          message: "Not found in members."
        }
      });
      stopLoading();
      return null;
    };

    _team.users[leaderIndex] = _team.leader;
    _team.leader = undefined;

    _team.users = _team.users.map(u => ({
      role: u.role,
      user: {
        id: u.user.id,
        username: u.user.username
      }
    })) as any;

    old.users = old?.users?.map(u => ({
      role: u.role,
      user: {
        id: u.user.id,
        username: u.user.username
      }
    })) as any;

    if(old.repository) {
      old.repository = {
        description: old.repository.description,
        fullname: old.repository.fullname,
        gitUrl: old.repository.gitUrl,
        homepage: old.repository.homepage,
        name: old.repository.name,
        sshUrl: old.repository.sshUrl,
        owner: {
          id: old.repository.owner.id,
          username: old.repository.owner.username
        }
      } as any;
    };

    if(_team.repository) {
      _team.repository = {
        description: _team.repository.description,
        fullname: _team.repository.fullname,
        gitUrl: _team.repository.gitUrl,
        homepage: _team.repository.homepage,
        name: _team.repository.name,
        sshUrl: _team.repository.sshUrl,
        owner: {
          id: _team.repository.owner.id,
          username: _team.repository.owner.username
        }
      } as any;
    };

    if(team && !(JSON.stringify(old) === JSON.stringify(_team))) {
      _team.users = _team.users.map(u => ({
        role: u.role,
        user: {
          id: u.user.id,
          username: u.user.username
        }
      })) as any;

      if(_team.repository) {
        _team.repository.owner = {
          id: _team.repository.owner.id,
          username: _team.repository.owner.username
        };
      };

      Api.put(`/user/classroom/${classroom.id}/team/${_team.id}`, {
        title: _team.title,
        description: _team.description,
        repository: _team.repository,
        users: _team.users,
      }).then(() => {
        setOldTeam(_team as any);
        sendMessage({
          text: "Team is updated!",
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
    } else if(!team) {
      Api.post(`/user/classroom/${classroom.id}/team`, _team).then(() => {
        router.push(`/app/classrooms/${classroom.id}`);
      }).catch((err) => {
        sendMessage({
          text: `Error on create: ${err.message ?? "unknown"}`,
          type: "error"
        });
        stopLoading();
      });
    } else {
      sendMessage({
        text: `No changes detected to update the team`,
        type: "warning"
      });
      stopLoading();
    };
  };

  async function onConfirmTeamDelete() {
    if(classroom && team) {
      startLoading();
      onClose();
      await Api.delete(`/user/classroom/${classroom.id}/team/${team.id}`)
      .then(() => {
        router.push(`/app/classrooms/${classroom.id}`);
      }).catch(() => {
        sendMessage({
          text: `Error on delete team`,
          type: "error"
        });
        stopLoading();
      });
    };  
  };

  async function handleDeleteTeam() {
    callModal({
      title: "Do you want to delete this team?",
      options: [
        <Button
          theme="red"
          colorIndexes={["400", "500", "500"]}
          onClick={onConfirmTeamDelete}
        >
          Delete
        </Button>
      ],
      text: "Warning: this action cannot be reversed, all users will be unlinked from their respective team and all data will be lost. Repository data will not be deleted.\n\nDo you want to continue?",
    });
  };

  function handleForceReset() {
    setValue("title", oldTeam.title);
    setValue("description", oldTeam.description);
    setValue("repository", oldTeam.repository);
    setValue("users", oldTeam.users);
    setValue("leader", oldTeam.users.find(u => u.role === "LEADER"));
  };

  const usersToSelect = [...members?.filter(m => !(watch("users") ?? [])
  .some(sm => (sm.user?.username === m?.user?.username && sm.user?.username && m?.user?.username) 
  || (sm?.user?.name === m?.user?.name && sm?.user?.name && m?.user?.name)))
  .map(m => {
    return {
      value: {
        user: m.user,
        role: "MEMBER"
      },
      label: m?.user?.name ?? m?.user?.username,
      color: "var(--chakra-color-solid-200)"
    };
  })];

  const usersToSelectTheLeader = [...(watch("users") ?? []).map(m => {
      return {
        value: {
          ...m,
          role: "LEADER"
        },
        label: m?.user?.name ?? m?.user?.username,
        color: "var(--chakra-color-solid-200)"
      };
  })];

  useEffect(() => {
    const users = [...(watch("users") ?? [])];
    const leader = watch("leader");
    
    setValue("users", users.map(u => {
      if((u.user?.username === leader?.user?.username && u.user?.username && leader?.user?.username) 
      || (u?.user?.name === leader?.user?.name && u?.user?.name && leader?.user?.name)) {
        u.role = "LEADER";
      } else {
        u.role = "MEMBER";
      };

      return u;
    }));
  }, [watch("leader")]);

  
  const selectedLeader = [...(watch("users") ?? [])].map(r => {
    return {
      value: r,
      label: r?.user?.name ?? r?.user?.username,
      color: "var(--chakra-color-solid-200)"
    };
  }).find(v => v.value.role === "LEADER");
  
  return (
    <Stack
      as="form"
      spacing={5}
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={handlePreventFormSubmitOnEnter}
    >
      <Dialog
        data={modalData}
        onClose={onClose} 
        isOpen={isOpen}
      />
      <Link 
        href={router?.query["returnToList"] || !team? `/app/classrooms/${classroom.id}`:`/app/classrooms/${classroom.id}/teams/${team.id}`}
        tabIndex={0}
      >
        {'<'}- return
      </Link>
      <Box
        display="flex"
        flexDir="column"
      >
        <Title>
          {team? `Team configuration`:"Create a team"}
        </Title>
        {
          team && <>
            <Text
              mt={2}
            >
              Authorized user: {user?.name ?? user?.username}
            </Text>
            <Text>
              Last title: {oldTeam?.title}
            </Text>
          </>
        }
      </Box>
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
        placeholder="Select the repository..."
        isLoading={repositoriesIsLoading}
        controlledValue={watch("repository")? {
          value: watch("repository"),
          label: watch("repository").fullname,
          color: "var(--chakra-color-solid-200)"
        }:undefined}
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
        placeholder="Select the users..."
        isLoading={repositoriesIsLoading}
        isMulti
        controlledValue={watch("users")? watch("users").map(r => {
          return {
            value: {
              role: r.role ?? "MEMBER",
              user: r.user
            },
            label: r?.user?.name ?? r?.user?.username,
            color: "var(--chakra-color-solid-200)"
          };
        }):undefined}
        options={[
          {
            value: null,
            label: usersToSelect.length <= 0? "No members remaining":"Members:",
            color: "var(--chakra-color-solid-200)",
            isFixed: true,
            isDisabled: true
          },
          ...usersToSelect
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
        placeholder="Select the team leader..."
        isLoading={repositoriesIsLoading}
        controlledValue={selectedLeader? selectedLeader:{
          value: null,
          label: "Select the team leader...",
          color: "var(--chakra-color-solid-200)",
          isFixed: true,
          isDisabled: true
        }}
        options={[
          {
            value: null,
            label: usersToSelectTheLeader.length <= 0? "Team has no members":"Team members:",
            color: "var(--chakra-color-solid-200)",
            isFixed: true,
            isDisabled: true
          },
          ...usersToSelectTheLeader
        ]}
        selectStyles={selectStyle(8)}
      />
      {message && 
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
      <HStack spacing={4}>
        <Button
          type="submit"
          theme="primary"
          disabled={isLoading}
          onClick={resetInputErrors}
        >
          {team? "Save":"Create"}
        </Button>
        <Button
          type="button"
          disabled={isLoading}
          onClick={team? handleForceReset:reset}
        >
          Reset
        </Button>
        {
          (classroom && team) && <Button
            type="button"
            theme="red"
            disabled={isLoading}
            colorIndexes={["400", "500", "500"]}
            onClick={handleDeleteTeam}
          >
            Delete
          </Button>
        }
      </HStack>
    </Stack>
  );
};

export { TeamCreateForm };

