import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { GetStaticPaths, GetStaticProps } from "next";
import { ClassroomCharts } from "../../../../components/Classroom/Charts/ClassroomCharts";
import { ClassroomAlerts } from "../../../../components/Classroom/ClassroomAlerts";

import { ClassroomBanner } from "../../../../components/Classroom/ClassroomBanner";
import { ClassroomSearch } from "../../../../components/Classroom/ClassroomSearch";
import { ClassroomMembersList } from "../../../../components/List/Classroom/ClassroomMembersList";
import { ClassroomTeamsList } from "../../../../components/List/Classroom/ClassroomTeamsList";
import { Section } from "../../../../components/Section";
import { Teams } from "../../../../controllers/Teams";
import { CannotGetCommitsError } from "../../../../errors/api/CannotGetCommitsError";
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
  
  const userIsOwner = users.some(
    u => u.user.id === user.id && 
    u.role === "OWNER"
  );

  const userIsAuthorized = userIsOwner || users.some(
    u => u.user.id === user.id && 
    u.role === "ADMIN"
  );

  const userIsObserver = userIsAuthorized || users.some(
    u => u.user.id === user.id && 
    u.role === "OBSERVER"
  );

  const teamsAreRestricted = 
    classroom.teamsAreRestricted && !userIsAuthorized && !userIsObserver;

  const rolesAreRestricted = 
    classroom.rolesAreRestricted && !userIsAuthorized && !userIsObserver;
  
  const repositoriesAreRestricted = 
    classroom.repositoriesAreRestricted && !userIsAuthorized && !userIsObserver;

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
          { (!teamsAreRestricted && !repositoriesAreRestricted) && <Tab>Analytics</Tab> }
          { !teamsAreRestricted && <Tab>Teams</Tab> }
          <Tab>Members</Tab>
          <Tab>Alerts</Tab>
        </TabList>
        <TabPanels
          w="100%"
          minW={["100vw", "100vw", "100vw", user? "93vw":"100vw"]}
          maxW="100vw"
          pt={3}
        >
          { (!teamsAreRestricted && !repositoriesAreRestricted) && <TabPanel
            p={0}
          >
            <ClassroomCharts
              repositories={repositories}
            />
          </TabPanel> }
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
                repositoriesAreRestricted={repositoriesAreRestricted}
              />
            </ClassroomSearch>
          </TabPanel> }
          <TabPanel
            w="100%"
          >
            <ClassroomSearch
              maxW={["auto", "auto", "auto", "50%"]}
              placeholder="Search by name, email or role..."
            >
              <ClassroomMembersList
                rolesAreRestricted={rolesAreRestricted}
                classroomId={id}
                initialData={users}
                userIsAuthorized={userIsAuthorized}
                userIsOwner={userIsOwner}
              />
            </ClassroomSearch>
          </TabPanel>
          <TabPanel 
            w="100%"
          >
            <ClassroomAlerts id={id}/>
          </TabPanel>
        </TabPanels>
      </Tabs>
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
      throw new CannotGetCommitsError(id);
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
        throw new CannotGetCommitsError(params.repository?.toString());
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
      const repositoryData = await getRepository(repository.fullname);

      if(!repositoryData) {
        return null;
      };

      return {
        teams: repository.teams,
        ...repositoryData
      }; 
    }));
  };

  try {
    const classroom = params.classroom;

    const teams = await getTeams(String(classroom));
    const repositories = await getRepositories(teams);

    return {
      props: {
        repositories: repositories.filter(r => r !== null)
      },
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