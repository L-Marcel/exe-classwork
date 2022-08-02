import { Alert, AlertIcon, AlertProps, Box, HStack, Stack, Text } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "../../../../../components/Buttons/Button";
import { Select } from "../../../../../components/Inputs/Select";
import { Link } from "../../../../../components/Link";
import { Dialog } from "../../../../../components/Modal/Dialog";
import { Section } from "../../../../../components/Section";
import { Title } from "../../../../../components/Title";
import { useIsLoading } from "../../../../../contexts/hooks/useIsLoading";
import { useModalDisclosure } from "../../../../../contexts/hooks/useModalDisclosure";
import { ClassroomRelations } from "../../../../../controllers/ClassroomRelations";
import { Api } from "../../../../../services/api";
import { selectStyle } from "../../../../../theme/select/selectStyle";
import { WithClassroomProps } from "../../../../../utils/routes/WithClassroomProps";
import { WithUserProps } from "../../../../../utils/routes/WithUserProps";

interface MemberConfigPageProps extends WithClassroomProps {
  classroomRelation: ClassroomRelation;
};

function MemberConfigPage({
  classroom,
  user,
  classroomRelation
}: MemberConfigPageProps) {
  const router = useRouter();
  const { startLoading, stopLoading, isLoading } = useIsLoading();
  const { callModal, onClose, isOpen, modalData } = useModalDisclosure();

  const roles: ClassroomRoles[] = ["OWNER", "ADMIN", "OBSERVER", "STUDENT"];

  const { users } = classroom;

  const userIsOwner = users.some(
    u => u.user.id === user.id && 
    u.role === "OWNER"
  );

  const userIsAuthorized = userIsOwner || users.some(
    u => u.user.id === user.id && 
    u.role === "ADMIN"
  );

  const currentUserRelation = users.find(u => u.user.id === user.id);

  const [message, setMessage] = useState<{
    text: string,
    type: AlertProps["status"]
  } | null>(null);

  const member = users.find(u => u.user.id === classroomRelation.user?.id);

  const [role, setRole] = useState(member.role);

  let timer;
  
  function sendMessage(data: typeof message) {
    clearTimeout(timer);
    setMessage(data);
    timer = setTimeout(() => {
      setMessage(null);
    }, 8000);
  };

  async function onConfirmRemoveMember() {
    if(classroom && classroomRelation) {
      startLoading();
      onClose();
      await Api.delete(`/user/classroom/${classroom.id}/members/${classroomRelation?.user?.id}`)
      .then(() => {
        router.push(`/app/classrooms/${classroom.id}`);
      }).catch(() => {
        sendMessage({
          text: `Error on delete member`,
          type: "error"
        });
        stopLoading();
      });
    };  
  };

  async function handleRemoveMember() {
    callModal({
      title: "Do you want to remove this member?",
      options: [
        <Button
          theme="red"
          colorIndexes={["400", "500", "500"]}
          onClick={onConfirmRemoveMember}
        >
          Delete
        </Button>
      ],
      text: "Warning: this action cannot be reversed, this user will be unlinked from their respective teams and the data will be lost. \n\nDo you want to continue?",
    });
  };

  async function handleSaveChanges() {
    startLoading();
    
    await Api.post(`/user/classroom/${classroom?.id}/members/${classroomRelation?.user?.id}/role`, {
      role
    }).then(() => {
      router.push("/app/classrooms");
    }).catch(() => {
      stopLoading();
    });
  };

  return (
    <Section
      isNeabyOfNavigation
    >
      <Stack
        gap={5}
      >
        <Dialog
          data={modalData}
          onClose={onClose} 
          isOpen={isOpen}
        />
        <Link 
          href={`/app/classrooms/${classroom.id}`}
          tabIndex={0}
        >
          {'<'}- return
        </Link>
        <Box
          display="flex"
          flexDir="column"
        >
          <Title>
            Member configuration
          </Title>
          <Text
            mt={2}
          >
            Authorized user: {user.name ?? user.username} - {currentUserRelation?.role}
          </Text>
          <Text>
            Member: {member?.user.name ?? member?.user.username} - {member?.role}
          </Text>
        </Box>
        { (userIsAuthorized && ((member.role !== "ADMIN" || userIsOwner) && member.role !== "OWNER"))?
          <>
            <Select
              placeholder="Selecte the role..."
              selectStyles={selectStyle(8)}
              options={roles.map((r) => {
                return {
                  value: r,
                  label: r,
                  color: "var(--chakra-color-solid-200)"
                };
              })}
              value={{
                value: role,
                label: role,
                color: "var(--chakra-color-solid-200)"
              }}
              onChange={v => setRole(v)}
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
            <HStack
              spacing={4}
            >
              <Button
                type="submit"
                theme="primary"
                disabled={isLoading}
                onClick={handleSaveChanges}
              >
                Save
              </Button>
              <Button
                type="button"
                theme="red"
                disabled={isLoading}
                colorIndexes={["400", "500", "500"]}
                onClick={handleRemoveMember}
              >
                Remove
              </Button>
            </HStack>
          </>:<Alert 
            status="warning"
            variant="left-accent"
            borderRadius={8}
            borderLeftWidth={2}
            w={[300, 350, 500]}
            maxW="80vw"
            mt="0!important"
            alignItems="flex-start"
          >
            <AlertIcon/>
            Permission denied {member.role === "OWNER"? " -> owner can't be changed":""}
          </Alert>
        }
        </Stack>
    </Section>
  );
};

export const getServerSideProps: GetServerSideProps = async({ params }) => {
  try {
    const { id, classroom } = params;

    if(!id || !classroom) {
      return {
        notFound: true
      };
    };

    const classroomRelation = await ClassroomRelations.get(classroom?.toString(), id?.toString());

    return {
      props: {
        classroomRelation
      }
    };
  } catch (error) {
    return {
      notFound: true
    };
  };
};

export default WithUserProps(
  WithClassroomProps(MemberConfigPage, (classroom, user) => {
    if(!classroom.users.some(u => 
      u.user.id === user.id && 
      u.role !== "STUDENT" && 
      u.role !== "OBSERVER")
    ) {
      return false;
    };

    return true;
  }) 
);