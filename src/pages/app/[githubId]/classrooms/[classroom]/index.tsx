import { Box, Text } from "@chakra-ui/react";
import { ClassroomBanner } from "../../../../../components/Classroom/ClassroomBanner";
import { ClassroomSearch } from "../../../../../components/Classroom/ClassroomSearch";
import { ClassroomMembersList } from "../../../../../components/List/Classroom/ClassroomMembersList";
import { ClassroomTeamsList } from "../../../../../components/List/Classroom/ClassroomTeamsList";
import { Section } from "../../../../../components/Section";
import { WithClassroomProps } from "../../../../../utils/routes/WithClassroomProps";
import { WithUserProps } from "../../../../../utils/routes/WithUserProps";


interface ClassroomPageProps extends WithClassroomProps {};

function ClassroomPage({
  classroom,
  user
}: ClassroomPageProps) {
  const { 
    id, 
    users,
    title, 
    description, 
    subject,
    inviteCode,
    teams
  } = classroom;

  const authorizedUser = users.find(
    u => u.user.id === user.id && 
    (u.role === "ADMIN" || u.role === "OWNER")
  );

  return (
    <>
      <ClassroomBanner
        id={id}
        authorizedUser={authorizedUser}
        title={title}
        description={description}
        subject={subject}
        inviteCode={inviteCode}
      />
      <Box
        w="100%"
        display="flex"
        flexDir={["column", "column", "column", "row"]}
        bgColor="solid.25"
      >
        <ClassroomSearch
          title="Members"
          subtitle="Find all members here"
          maxW={["auto", "auto", "auto", "50%"]}
          placeholder="Search by name, email or role..."
        >
          <ClassroomMembersList
            classroomId={id}
            initialData={users}
          />
        </ClassroomSearch>
        <ClassroomSearch
          title="Teams"
          subtitle="Find all teams here"
          maxW={["auto", "auto", "auto", "50%"]}
          placeholder="Search by name, user or repo..."
          bgColor="solid.10"
          addInstanceUrl={authorizedUser && `/app/${user.githubId}/classrooms/${classroom.id}/team`}
        >
          <ClassroomTeamsList
            classroomId={id}
            initialData={teams}
          />
        </ClassroomSearch>
      </Box>
      <Section>
        <Text textAlign="center">This page will still undergo many changes.</Text>
      </Section>
    </>
  );
};

export default WithUserProps(
  WithClassroomProps(ClassroomPage)
);