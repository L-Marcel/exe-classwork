import { Box, Text } from "@chakra-ui/react";
import { formatDistance } from "date-fns";
import { useState } from "react";
import { ProfileAnalyzer } from "../../services/profile";
import { getDiffInCommitValue } from "../../utils/getDiffInCommitValue";
import { getPercent } from "../../utils/getPercent";
import { RepositoryContributionChart } from "./RepositoryContributionChart";
import { RepositoryProfileDescription } from "./RepositoryProfileDescription";
import { RepositoryProfileItem } from "./RepositoryProfileItem";

interface RepositoryProfileProps {
  commits: Commit[];
};

function RepositoryProfile({
  commits
}: RepositoryProfileProps) {
  if(commits.length <= 0) {
    return null;
  };

  const formattedCommits: Omit<CommitChart, "files">[] = commits.map(commit => {
    return {
      ...commit,
      methods: commit.methods.length,
      classes: commit.classes.length,
    };
  });

  let { data, total } = formattedCommits.reduce((prev, cur) => {
    const userAlreadyExistsInArray = prev.data.some(c => c.user.id === cur.userGithubId);
    
    let methodsDiff = getDiffInCommitValue({
      commits: formattedCommits,
      dataKey: "methods",
      order: cur.order,
      value: cur.methods
    });

    let classesDiff = getDiffInCommitValue({
      commits: formattedCommits,
      dataKey: "classes",
      order: cur.order,
      value: cur.classes
    });

    let complexityDiff = getDiffInCommitValue({
      commits: formattedCommits,
      dataKey: "complexity",
      order: cur.order,
      value: cur.complexity
    });

    if(!userAlreadyExistsInArray) {
      prev.data.push({
        user: {
          name: cur.userGithubLogin,
          id: cur.userGithubId
        },
        count: 1,
        progress: cur.totalChanges,
        organization: {
          methods: methodsDiff,
          classes: classesDiff
        },
        complexity: complexityDiff,
        lastDate: cur.commitedAt,
        contribution: 0
      });

      prev.total.count += 1;
      prev.total.progress += cur.totalChanges;
      prev.total.organization.methods += methodsDiff;
      prev.total.organization.classes += classesDiff;
      prev.total.complexity += complexityDiff;
    } else {
      prev.data = prev.data.map(u => {
        if(u.user.id === cur.userGithubId) {
          u.count += 1;
          u.progress += cur.totalChanges;
          u.organization.methods += methodsDiff;
          u.organization.classes += classesDiff;
          u.complexity += complexityDiff;
          u.lastDate = cur.commitedAt;

          prev.total.count += 1;
          prev.total.progress += cur.totalChanges;
          prev.total.organization.methods += methodsDiff;
          prev.total.organization.classes += classesDiff;
          prev.total.complexity += complexityDiff;
        };

        return u;
      });
    };

    return prev;
  }, {
    data: [] as UserCommit[],
    total: {
      count: 0,
      progress: 0,
      organization: {
        methods: 0,
        classes: 0
      },
      complexity: 0,
      contribution: 0
    }
  });

  //just simplifying
  data = data.reduce((prev, cur) => {
    const progress = cur.progress;
    const classes = cur.organization.classes;
    const methods = cur.organization.methods;
    const complexity = cur.complexity;

    const totalProgress = total.progress;
    const totalClasses =  total.organization.classes;
    const totalMethods = total.organization.methods;
    const totalComplexity = total.complexity;

    const contribution = 
      (
        (2 * (progress/totalProgress)) + 
        (0.5 * (classes/totalClasses)) +
        (0.5 * (methods/totalMethods)) + 
        (1 * (complexity/totalComplexity))
      ) /4;

    cur.contribution = contribution;
    prev.push(cur);
    return prev;
  }, []);

  const [selectedProfile, setSelectedProfile] = useState(0);
  const [selectedUser, setSelectedUser] = useState<string>("");

  const userCommits = data.find(u => u.user.id === selectedUser);

  const profile = new ProfileAnalyzer(data, formattedCommits, userCommits?.user?.id || "");

  const commitsCount = profile.getNumberOfCommits();
  const time = profile.getTimeOfCommits();
  const messages = profile.getChangesMessageLengthHistory();
  const commitContribution = profile.getContribution();
  const organizationByMethods = profile.getOrganizationByMethods();
  const organizationByClasses = profile.getOrganizationByClasses();

  const dateOfLastCommit = formatDistance(userCommits? new Date(userCommits?.lastDate):new Date(), new Date());

  const profileResult = [commitsCount, commitContribution, time, messages, organizationByMethods, organizationByClasses];

  return ( 
    <>
      <Box
        display="flex"
        h="min-content"
        maxW="100vw"
        justifyContent="center"
        alignItems="center"
        flexDir={["column", "column", "row"]}
        flexWrap="wrap"
      >
        <Box
          h="100%"
          w="100%"
          display="flex"
          justifyContent="center"
          alignItems="flex-start"
          flexDirection="column"
          alignSelf="flex-start"
          flex={1}
          gap={1}
        >
          <Box 
            h="100%"
            w="100%"
            minW={["100%", "100%", 650]}
            px={8}
            pb={4}
            display="flex"
            justifyContent="flex-start"
            alignSelf="flex-start"
            alignItems="center"
            flexWrap="wrap"
          >
            <RepositoryContributionChart
              data={data || []}
              onChangeUser={(id, percent) => {
                setSelectedUser(id);
              }}
            />
            <Box
              display="flex"
              flexDir="column"
              maxW={["100%", "50%", 450]}
              mb={4}
            >
              <Text 
                fontSize="4xl" 
                fontWeight="bold"
                lineHeight="9"
                color="primary.700"
              >
                {userCommits?.user?.name}
              </Text>
              <Text 
                ml="2px"
                fontSize="md" 
                lineHeight="1.2"
                fontWeight="medium"
                mb={4}
              >
                Last commit: {dateOfLastCommit} ago
              </Text>
              <Text 
                ml="2px"
                fontSize="md" 
                lineHeight="1.2"
                fontWeight="medium"
              >
                Contibution: {getPercent(userCommits?.contribution, 1)}%
              </Text>
              <Text 
                ml="2px"
                fontSize="md" 
                lineHeight="1.2"
                fontWeight="medium"
                mb={4}
              >
                Commits: {userCommits?.count} - {getPercent(userCommits?.count, total.count)}%
              </Text>
              <Text 
                ml="2px"
                fontSize="md" 
                lineHeight="1.2"
                fontWeight="medium"
              >
                Complexity: {userCommits?.complexity} - {getPercent(userCommits?.complexity, total.complexity)}%
              </Text>
              <Text 
                ml="2px"
                fontSize="md" 
                lineHeight="1.2"
                fontWeight="medium"
              >
                Classes: {userCommits?.organization.classes} - {getPercent(userCommits?.organization.classes, total.organization.classes)}%
              </Text>
              <Text 
                ml="2px"
                fontSize="md" 
                lineHeight="1.2"
                fontWeight="medium"
              >
                Methods: {userCommits?.organization.methods} - {getPercent(userCommits?.organization.methods, total.organization.methods)}%
              </Text>
              <Text 
                ml="2px"
                fontSize="md" 
                lineHeight="1.2"
                fontWeight="medium"
              >
                Changes: {userCommits?.progress} - {getPercent(userCommits?.progress, total.progress)}%
              </Text>
            </Box>
          </Box>
          <Box
            display="grid"
            gridTemplateColumns={["20rem", "20rem", "20rem minmax(15rem, 20rem)"]}
            w="100%"
            gap={1}
            flexWrap="wrap"
            borderTop="2px solid"
            borderColor="solid.100"
            p={6}
          >
            {
              profileResult.map((p, i) => {
                return (
                  <RepositoryProfileItem
                    key={`${p.message} ${selectedUser}`}
                    sulfix={i < profileResult.length - 1? ";":"."}
                    isSelected={selectedProfile === i}
                    onSelect={() => setSelectedProfile(i)}
                    {...p}
                  />
                );
              })
            }
          </Box>
        </Box>
        { profileResult[selectedProfile] && <RepositoryProfileDescription
          {...profileResult[selectedProfile]}
        /> }
      </Box>
    </>
  );
};

export { RepositoryProfile };

