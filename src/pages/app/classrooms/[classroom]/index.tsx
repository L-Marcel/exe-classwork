import { Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import { GetStaticPaths, GetStaticProps } from "next";
import { ClassroomCharts } from "../../../../components/Classroom/Charts/ClassroomCharts";
import { ClassroomBanner } from "../../../../components/Classroom/ClassroomBanner";
import { ClassroomSearch } from "../../../../components/Classroom/ClassroomSearch";
import { ClassroomMembersList } from "../../../../components/List/Classroom/ClassroomMembersList";
import { ClassroomTeamsList } from "../../../../components/List/Classroom/ClassroomTeamsList";
import { Section } from "../../../../components/Section";
import { Teams } from "../../../../controllers/Teams";
import { CannotGetCommits } from "../../../../errors/api/CannotGetCommits";
import { Api } from "../../../../services/api";
import { WithClassroomProps } from "../../../../utils/routes/WithClassroomProps";
import { WithUserProps } from "../../../../utils/routes/WithUserProps";
interface ClassroomPageProps extends WithClassroomProps {
  repositories: Repository[];
};

function ClassroomPage({
  classroom,
  user,
  repositories
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
          { !teamsAreRestricted && <Tab>Teams</Tab> }
        </TabList>
        <TabPanels
          w="100%"
          minW={user? "93vw":"100vw"}
          maxW="100vw"
          pt={3}
        >
          <TabPanel
            p={0}
          >
            <ClassroomCharts
              repositories={repositories}
            />
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
          { !teamsAreRestricted && <TabPanel 
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
          </TabPanel> }
        </TabPanels>
      </Tabs>
      </Section>
      <Section>
        <Text textAlign="center">This page will still undergo many changes.</Text>
      </Section>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true
  };
};

export const getStaticProps: GetStaticProps = async({ params }) => {
  async function getRepositoryCommits(fullname: string, id: string, page = 0, take = 10) {
    const { items: commits, count } = await Api.get(`/user/repository/${id}/commits?page=${page}&take=${take}`).then(res => {
      return res.data;
    }).catch((err) => {
      throw new CannotGetCommits(id);
    });

    if(count >= (page * take)) {
      const nextPage = page + 1;
      const nextCommits = await getRepositoryCommits(fullname, id, nextPage, take);
      return [ ...commits, ...(nextCommits || []) ];
    };
  
    return (commits || []);
  };

  async function getRepository(fullname: string) {
    try {
      const repository = await Api.get(`/repository/${fullname}`).then(async(res) => {
        const commits: any[] = await getRepositoryCommits(fullname, res.data.id, 0, 10);
        
        return {
          ...res.data,
          commits
        };
      }).catch((err) => {
        console.log(err);
        throw new CannotGetCommits(params.repository?.toString());
      });

      return repository;
    } catch (err) {
      console.log(err);
      return null;
    };
  };

  async function getTeams(classroomId: string): Promise<Team[]> {
    return await Teams.getAllByClassroomId(classroomId)
    .then(res => res).catch(err => {
      console.log(err);
      return [];
    }) as Team[];
  };

  async function getRepositories(teams: Team[]): Promise<Repository[]> {
    const repositories: Partial<Repository>[] = teams.reduce((prev, cur) => {
      const repositoryIndex = prev.findIndex(r => r.fullname === cur.repository.fullname);

      if(repositoryIndex <= -1) {
        prev.push({
          name: cur.repository.name,
          fullname: cur.repository.fullname,
          teams: [
            {
              users: cur.users,
              title: cur.title,
              id: cur.id
            }
          ]
        });        
      } else if (repositoryIndex > -1) {
        prev[repositoryIndex].teams.push({
          users: cur.users,
          title: cur.title,
          id: cur.id
        });
      };

      return prev;
    }, [] as Partial<Repository>[]);

    return await Promise.all(repositories.map(async(repository) => {
      return await getRepository(repository.fullname);
    }));
  };

  try {
    const classroom = params.classroom;

    const teams = await getTeams(String(classroom));
    const repositories = await getRepositories(teams);

    return {
      props: {
        repositories
      }
    };
  } catch (error) {};

  return {
    notFound: true
  };
};

export default WithUserProps(
  WithClassroomProps(ClassroomPage), { 
    isPublic: false 
  },
  { 
    title: "We are loading the teams analytics.",
    subtitle: "This process is required for every team's push event."
  }
);