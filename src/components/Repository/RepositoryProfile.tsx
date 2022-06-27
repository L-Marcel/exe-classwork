import { Box, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useCommitsProfile } from "../../contexts/hooks/useCommitsProfile";
import { getPercent } from "../../utils/getPercent";
import { RepositoryContributionChart } from "./RepositoryContributionChart";
import { RepositoryProfileDescription } from "./RepositoryProfileDescription";
import { RepositoryProfileItem } from "./RepositoryProfileItem";
import { RepositoryProfileStatistic } from "./RepositoryProfileStatistic";

export interface RepositoryProfileProps {
  commits: Commit[];
  isFormatted?: boolean;
};

function RepositoryProfile({
  commits,
  isFormatted = false
}: RepositoryProfileProps) {
  if(commits.length <= 0) {
    return null;
  };

  const [selectedProfile, setSelectedProfile] = useState(0);
  const [selectedUser, setSelectedUser] = useState<string>("");
  
  const {
    lastDate: dateOfLastCommit,
    result: profileResult,
    userCommits,
    total,
    data
  } = useCommitsProfile({
    commits,
    selectedUser,
    isFormatted
  });

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
              onChangeUser={(id) => {
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
              <RepositoryProfileStatistic mb={4}>
                Last commit: {dateOfLastCommit} ago
              </RepositoryProfileStatistic>
              <RepositoryProfileStatistic>
                Contibution: {getPercent(userCommits?.contribution, 1)}%
              </RepositoryProfileStatistic>
              <RepositoryProfileStatistic mb={4}>
                Commits: {userCommits?.count} - {getPercent(userCommits?.count, total.count)}%
              </RepositoryProfileStatistic>
              <RepositoryProfileStatistic>
                Complexity: {userCommits?.complexity} - {getPercent(userCommits?.complexity, total.complexity)}%
              </RepositoryProfileStatistic>
              <RepositoryProfileStatistic>
                Classes: {userCommits?.organization.classes} - {getPercent(userCommits?.organization.classes, total.organization.classes)}%
              </RepositoryProfileStatistic>
              <RepositoryProfileStatistic>
                Methods: {userCommits?.organization.methods} - {getPercent(userCommits?.organization.methods, total.organization.methods)}%
              </RepositoryProfileStatistic>
              <RepositoryProfileStatistic>
                Changes: {userCommits?.progress} - {getPercent(userCommits?.progress, total.progress)}%
              </RepositoryProfileStatistic>
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

