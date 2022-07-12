import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, Tag, Text } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { IconButton } from "../../../../../../components/Buttons/IconButton";
import { ClassroomSearch } from "../../../../../../components/Classroom/ClassroomSearch";
import { Link } from "../../../../../../components/Link";
import { TeamMembersList } from "../../../../../../components/List/Classroom/TeamMembersList";
import { NamedIcon } from "../../../../../../components/NamedIcon";
import { Section } from "../../../../../../components/Section";
import { Title } from "../../../../../../components/Title";
import { Prisma } from "../../../../../../services/prisma";
import { WithClassroomProps } from "../../../../../../utils/routes/WithClassroomProps";
import { WithUserProps } from "../../../../../../utils/routes/WithUserProps";

interface TeamPageProps {
  team: Team;
  classroom: Classroom;
};

function TeamPage({ team, classroom }: TeamPageProps) {
  const {
    title,
    repository,
    description,
    id,
    users
  } = team;

  return (
    <>
      <Section
        isNeabyOfNavigation
      >
        <Link 
          href={classroom? `/app/classrooms/${classroom?.id}`:`/`}
          tabIndex={0}
        >
          {'<'}- return
        </Link>
        <Title>
          {title}
        </Title>
        {
          repository && <Text
            fontSize="1.1rem"
            color="solid.500"
          >
            Repository: {repository.fullname}
          </Text>
        }
        <Text
          fontSize="1.1rem"
          color="solid.500"
        >
          Classroom: {classroom.title}
        </Text>
        { description && <Text 
            mt={2}
          >
            {description}
          </Text>
        }
        <Box
          display="flex"
          gap={4}
        >
          <Link 
            mt={5}
            href={`/app/classrooms/${classroom.id}/teams/${id}/config`}
          >
            <IconButton
              aria-label="redirect-to-config"
              icon={<NamedIcon name="cog"/>}
              theme="primary"
              h={8}
              w={8}
              minW="auto"
            />
          </Link>
          <Tag
            fontWeight="bold"
            bgColor="primary.800"
            color="blackAlpha.900"
            minH="24px"
            h="min"
            mt={5}
          >
            Members: {users.length}
          </Tag>
        </Box>
      </Section>
      <Section
        flex={1}
        py="0!important"
        pl={["0!important", "0!important", "var(--chakra-space-14)!important"]}
        pr={["0!important", "0!important", "var(--chakra-space-14)!important"]}
      >
        <Tabs>
          <TabList
            overflowX="auto"
            overflowY="hidden"
            maxW="100vw"
            pb="1px"
          >
            <Tab>Members</Tab>
          </TabList>
          <TabPanels
            w="100%"
            minW={["100vw", "100vw", "100vw", "93vw"]}
            maxW="100vw"
            pt={3}
          >
            <TabPanel
              w="100%"
            >
              <ClassroomSearch
                maxW={["auto", "auto", "auto", "50%"]}
                placeholder="Search by name, email or role..."
              >
                <TeamMembersList
                  classroomId={classroom.id}
                  teamId={id}
                  initialData={users}
                />
              </ClassroomSearch>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Section>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async({
  query
}) => {
  const { team: teamId, classroom: classroomId } = query;

  const team = await Prisma.team.findFirst({
    where: {
      id: String(teamId),
      classroomId: String(classroomId)
    },
    include: {
      users: true,
      repository: true
    }
  });

  if(!team) {
    return {
      notFound: true
    };
  };

  return {
    props: {
      team
    }
  };
};

export default WithUserProps(
  WithClassroomProps(TeamPage, (classroom, user, team) => {
    if(team && !team.users.some(u => u.user.id === user.id)) {
      return true;
    };

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