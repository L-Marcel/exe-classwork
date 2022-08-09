import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useClassroom } from "../../../contexts/hooks/useClassroom";
import { useIsLoading } from "../../../contexts/hooks/useIsLoading";
import { useModalDisclosure } from "../../../contexts/hooks/useModalDisclosure";
import { useUser } from "../../../contexts/hooks/useUser";
import { Api } from "../../../services/api";
import { Button } from "../../Buttons/Button";
import { IconButton } from "../../Buttons/IconButton";
import { Link } from "../../Link";
import { Dialog } from "../../Modal/Dialog";
import { NamedIcon } from "../../NamedIcon";
import { Profile } from "../../Profile";
import { Title } from "../../Title";

interface ClassroomMemberItem {
  member: ClassroomRelation;
  rolesAreRestricted?: boolean;
  userIsOwner?: boolean;
  userIsAuthorized?: boolean;
};

function ClassroomMemberItem({ 
  member, 
  rolesAreRestricted = false,
  userIsOwner = false,
  userIsAuthorized = false
}: ClassroomMemberItem) {
  const { classroom } = useClassroom();
  const { user } = member;
  const { user: currentUser } = useUser();
  const { startLoading, stopLoading, isLoading } = useIsLoading();
  const { callModal, onClose, isOpen, modalData } = useModalDisclosure();
  const router = useRouter();

  async function onConfirmRemoveMember() {
    if(classroom && member) {
      startLoading();
      onClose();
      await Api.delete(`/user/classroom/${classroom.id}/members/${user?.id}`)
      .then(() => {
        router.push(`/app/classrooms/${classroom.id}`);
      }).catch(() => {
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
  
  return (
    <HStack
      spacing={3}
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      textAlign="start"
      minW={["85%", "80%", "80%", "40%", "20%"]}
      w="fill"
      bgColor="solid.100"
      borderRadius={15}
      borderLeft="2px solid"
      borderColor="primary.700"
      p={[2, 4]}
      position="relative"
    >
      <Dialog
        data={modalData}
        onClose={onClose} 
        isOpen={isOpen}
      />
      <Profile
        user={user}
      />
      <Stack
        spacing={1}
      >
        <Title
          mt={-1}
          fontSize="1.3rem"
          fontWeight={600}
        >
          {user.name ?? user.username}
        </Title>
        <Text
          lineHeight="15px"
          fontSize=".8rem"
        >
          {(!rolesAreRestricted)? member.role || "MEMBER":"MEMBER"}
        </Text>
      </Stack>
      { (userIsAuthorized && ((member.role !== "ADMIN" || userIsOwner) && member.role !== "OWNER"))? <Box
        position="absolute"
        top={-1}
        right={[-8, 0]}
        p={4}
      >
        <Link
          href={`/app/classrooms/${classroom?.id}/members/${member?.user?.id}`}
        >
          <IconButton
            data-testid="icon-button"
            label="Member configuration"
            justifyContent="center"
            borderRadius={15}
            alignItems="center"
            minW="27px"
            minH="27px"
            maxW="27px"
            maxH="27px"
            bgColor="solid.200"
            icon={<NamedIcon 
              name="cog"
              h="16px"
              w="16px"
              mt=".5px"
              ml="-0.5px"
              maxW="15px"
              maxH="15px"
            />}
            aria-label="table-filter-button"
            fontSize={18}
          />
        </Link>
      </Box>:(currentUser.id === user.id && !userIsOwner) && <Box
        position="absolute"
        top={-1}
        right={[-8, 0]}
        p={4}
      >
        <IconButton
          data-testid="icon-button"
          label="Leave"
          labelBgColor="red.600"
          justifyContent="center"
          borderRadius={15}
          alignItems="center"
          minW="27px"
          minH="27px"
          maxW="27px"
          maxH="27px"
          bgColor="red.600"
          onClick={handleRemoveMember}
          icon={<NamedIcon 
            name="close"
            h="16px"
            w="16px"
            mt=".5px"
            ml="-0.5px"
            maxW="15px"
            maxH="15px"
            color="solid.900"
          />}
          aria-label="table-filter-button"
          fontSize={18}
        />
      </Box> }
    </HStack>
  );
};

export { ClassroomMemberItem };

