import { Box, Text } from "@chakra-ui/react";
import { formatDistance } from "date-fns";
import { useState } from "react";
import { ProfileAnalyzer } from "../../services/profile";
import { RepositoryFrequenceChart } from "./RepositoryFrequencyChart";
import { RepositoryProfileItem } from "./RepositoryProfileItem";

interface RepositoryFrequencyProps {
  commits: Commit[];
};

function RepositoryFrequency({
  commits
}: RepositoryFrequencyProps) {
  if(commits.length <= 0) {
    return null;
  };

  const data = commits.reduce((prev, cur) => {
    const userAlreadyExistsInArray = prev.some(c => c.user.id === cur.userGithubId);

    if(!userAlreadyExistsInArray) {
      prev.push({
        user: {
          name: cur.userGithubLogin,
          id: cur.userGithubId
        },
        frequency: 1,
        lastDate: cur.commitedAt
      });
    } else {
      prev = prev.map(u => {
        if(u.user.id === cur.userGithubId) {
          u.frequency += 1;
          u.lastDate = cur.commitedAt;
        };

        return u;
      });
    };

    return prev;
  }, [] as CommitFrequency[]);

  const [selectedUser, setSelectedUser] = useState<string>("");
  const [percent, setPercent] = useState<string>("");

  const userFrequency = data.find(u => u.user.id === selectedUser);

  const profile = new ProfileAnalyzer(data, commits, userFrequency?.user?.id || "");

  const frequency = profile.getFrequency();
  const time = profile.getTimeOfCommits();
  const changes = profile.getChangesHistory();
  const messages = profile.getChangesMessageLengthHistory();
  const teamwork = profile.getTeamwork();

  const dateOfLastCommit = formatDistance(userFrequency? new Date(userFrequency?.lastDate):new Date(), new Date());

  return ( 
    <>
      <Box
        display="flex"
        h="min-content"
        maxW="100vw"
        justifyContent="center"
        alignItems="center"
        flexDir={["column", "column", "row"]}
      >
        <RepositoryFrequenceChart
          data={data || []}
          onChangeUser={(id, percent) => {
            setSelectedUser(id);
            setPercent(percent);
          }}
        />
        <Box 
          h="100%"
          p={8}
          display="flex"
          minW={350}
          justifyContent="center"
          alignItems="flex-start"
          flexDirection="column"
          flex={1}
          gap={1}
        >
          <Box
            display="flex"
            flexDir="column"
            mb={4}
          >
            <Text 
              fontSize="4xl" 
              fontWeight="bold"
              lineHeight="9"
              color="primary.700"
            >
              {userFrequency?.user?.name}
            </Text>
            <Text 
              ml="2px"
              fontSize="md" 
              lineHeight="1.2"
              fontWeight="medium"
            >
              Commit: {userFrequency?.frequency} - {percent}%
            </Text>
            <Text 
              ml="2px"
              fontSize="md" 
              lineHeight="1.2"
              fontWeight="medium"
            >
              Last commit: {dateOfLastCommit} ago
            </Text>
          </Box>
          <RepositoryProfileItem
            sulfix=";"
            {...frequency}
          />
          <RepositoryProfileItem
            sulfix=";"
            {...time}
          />
          <RepositoryProfileItem
            sulfix=";"
            {...changes}
          />
          <RepositoryProfileItem
            sulfix=";"
            {...messages}
          />
          <RepositoryProfileItem
            sulfix="."
            {...teamwork}
          />
        </Box>
      </Box>
    </>
  );
};

export { RepositoryFrequency };

