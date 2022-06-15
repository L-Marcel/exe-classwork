import { Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import { ClassroomBanner } from "../../../../components/Classroom/ClassroomBanner";
import { ClassroomSearch } from "../../../../components/Classroom/ClassroomSearch";
import { ClassroomMembersList } from "../../../../components/List/Classroom/ClassroomMembersList";
import { ClassroomTeamsList } from "../../../../components/List/Classroom/ClassroomTeamsList";
import { Section } from "../../../../components/Section";
import { WithClassroomProps } from "../../../../utils/routes/WithClassroomProps";
import { WithUserProps } from "../../../../utils/routes/WithUserProps";


interface ClassroomPageProps extends WithClassroomProps {};

function ClassroomPage({
  classroom,
  user
}: ClassroomPageProps) {
  const { 
    id, 
    users,
    teams,
  } = classroom;

  const userIsAuthorized = users.some(
    u => u.user.id === user.id && 
    (u.role === "ADMIN" || u.role === "OWNER")
  );

  const teamsAreRestricted = 
    classroom.teamsAreRestricted && !userIsAuthorized;

  return (
    <>
      <ClassroomBanner
        user={user}
        userIsAuthorized={userIsAuthorized}
        {...classroom}
      />
      <Section
        flex={1}
        py="0!important"
        pl={user? ["0!important", "0!important", "var(--chakra-space-14)!important"]:"0!important"}
        pr={user? ["0!important", "0!important", "var(--chakra-space-14)!important"]:"0!important"}
      >
      <Tabs>
        <TabList
          overflowX="auto"
          overflowY="hidden"
          maxW="100vw"
          pb="1px"
        >
          <Tab>Analytics</Tab>
          <Tab>Alerts</Tab>
          <Tab>Members</Tab>
          <Tab>Teams</Tab>
        </TabList>
        <TabPanels
          w="100%"
          minW={user? "93vw":"100vw"}
          maxW="100vw"
          overflowX={["auto", "auto", "auto", "hidden"]}
          overflowY="hidden"
          pt={3}
        >
          <TabPanel 
            w="100%"
          >

          </TabPanel>
          <TabPanel 
            w="100%"
          >

          </TabPanel>
          <TabPanel
            w="100%"
          >
            <ClassroomSearch
              maxW={["auto", "auto", "auto", "50%"]}
              placeholder="Search by name, email or role..."
            >
              <ClassroomMembersList
                classroomId={id}
                initialData={users}
              />
            </ClassroomSearch>
          </TabPanel>
          <TabPanel 
            w="100%"
          >
            <ClassroomSearch
              maxW={["auto", "auto", "auto", "50%"]}
              placeholder="Search by name, user or repo..."
              addInstanceUrl={userIsAuthorized && `/app/classrooms/${classroom.id}/team`}
            >
              <ClassroomTeamsList
                classroomId={id}
                initialData={teams}
              />
            </ClassroomSearch>
          </TabPanel>
        </TabPanels>
      </Tabs>
      </Section>
      <Section>
        <Text textAlign="center">This page will still undergo many changes.</Text>
      </Section>
    </>
  );
};

export default WithUserProps(
  WithClassroomProps(ClassroomPage)
);