import { Box, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useCommitsProfile } from "../../contexts/hooks/useCommitsProfile";
import { getPercent } from "../../utils/getPercent";
import { Button } from "../Buttons/Button";
import { RepositoryContributionChart } from "./RepositoryContributionChart";
import { RepositoryProfileDescription } from "./RepositoryProfileDescription";
import { RepositoryProfileItem } from "./RepositoryProfileItem";
import { RepositoryProfileStatistic } from "./RepositoryProfileStatistic";

export interface RepositoryProfileProps {
  commits: Commit[];
  firstItemBefore?: any;
};

function RepositoryProfile({
  commits,
  firstItemBefore
}: RepositoryProfileProps) {
  if(commits.length <= 0) {
    return null;
  };

  const filteredCommits = commits.filter(c => c.filtered);

  const [compareByInterval, setCompareByInterval] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(0);
  const [selectedUser, setSelectedUser] = useState<string>("");
  
  const {
    lastDate: dateOfLastCommit,
    result: profileResult,
    userCommits,
    total: totalInInterval,
    data
  } = useCommitsProfile({
    commits: filteredCommits,
    selectedUser,
    firstItemBefore
  });

  const {
    total,
    userCommits: userCommitsInTotal
  } = useCommitsProfile({
    commits,
    selectedUser
  });

  if(!userCommits) {
    return (
      <RepositoryProfileDescription
        message="No commits"
        description={'Unfortunately, we have not found any commits to analyze, ' +
        `this repository. Verify the dates' interval and, if necessary, the ` +
        'repository page in GitHub.\n\n' + 
        'Even the small changes can carry a bug, lost feature, or deleted files.'}
        icon="slepping"
        color="red.600"
      />
    );
  };

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
                fontSize="2xl" 
                fontWeight="bold"
                lineHeight="9"
                color="primary.700"
              >
                {
                  userCommits?.user?.name.length > 25? 
                    userCommits?.user?.name.slice(0, 22) + "...":
                    userCommits?.user?.name
                }
              </Text>
              <RepositoryProfileStatistic>
                Last commit: {dateOfLastCommit} ago
              </RepositoryProfileStatistic>
              <RepositoryProfileStatistic mb={4}>
                Commits: {userCommits?.count} - {getPercent(userCommits?.count, total.count)}%
              </RepositoryProfileStatistic>
              <Box 
                mb={4}
                bgColor="solid.100"
                display="flex"
                justifyContent="space-between"
                gap={1}
                w="min"
                borderRadius={18}
              >
                <Button
                  h={7}
                  theme={compareByInterval? "primary":"solid"}
                  bgColor={compareByInterval? "primary.600":"transparent"}
                  borderRadius={18}
                  onClick={() => setCompareByInterval(true)}
                >
                  in interval
                </Button>
                <Button
                  h={7}
                  theme={compareByInterval? "solid":"primary"}
                  bgColor={compareByInterval? "transparent":"primary.600"}
                  borderRadius={18}
                  onClick={() => setCompareByInterval(false)}
                >
                  total
                </Button>
              </Box>
              {
                compareByInterval? <>
                  <RepositoryProfileStatistic mb={4}>
                    Contibution: {getPercent(userCommits?.contribution, 1)}%
                  </RepositoryProfileStatistic>
                  <RepositoryProfileStatistic>
                    Complexity: {userCommits?.complexity} - {getPercent(userCommits?.complexity, totalInInterval.complexity)}%
                  </RepositoryProfileStatistic>
                  <RepositoryProfileStatistic>
                    Classes: {userCommits?.organization.classes} - {getPercent(userCommits?.organization.classes, totalInInterval.organization.classes)}%
                  </RepositoryProfileStatistic>
                  <RepositoryProfileStatistic>
                    Methods: {userCommits?.organization.methods} - {getPercent(userCommits?.organization.methods, totalInInterval.organization.methods)}%
                  </RepositoryProfileStatistic>
                  <RepositoryProfileStatistic>
                    Changes: {userCommits?.progress} - {getPercent(userCommits?.progress, totalInInterval.progress)}%
                  </RepositoryProfileStatistic>
                </>:<>
                  <RepositoryProfileStatistic mb={4}>
                    Contibution: {getPercent(userCommitsInTotal?.contribution, 1)}%
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
                </>
              }
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

