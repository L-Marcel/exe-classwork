import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useIsLoading } from "../../contexts/hooks/useIsLoading";
import { useUser } from "../../contexts/hooks/useUser";
import { Api } from "../../services/api";
import { Button } from "../Buttons/Button";
import { Link } from "../Link";
import { Title } from "../Title";

interface RepositoryConfiguratioProps {
  repositoryName: string;
};

function RepositoryConfiguration({
  repositoryName
}: RepositoryConfiguratioProps) {
  const router = useRouter();
  const { user } = useUser();
  const { isLoading, startLoading, stopLoading } = useIsLoading();

  async function handleDeleteRepository() {};

  async function handleForceRepositoryUpdate() {
    startLoading();
    await Api.post(`/user/repository/refresh`, {
      repository: repositoryName
    }).then(() => {
      router.push("/app/repositories");
    }).catch(() => {
      stopLoading();
    });
  };

  return (
    <Stack
      spacing={5}
    >
      <Link 
        href={`/app/repositories`}
        tabIndex={0}
      >
        {'<'}- return
      </Link>
      <Box
        display="flex"
        flexDir="column"
      >
        <Title>
          Repository configuration
        </Title>
        <Text
          mt={2}
        >
          Authorized user: {user.name ?? user.username}
        </Text>
        <Text>
          Repository: {repositoryName}
        </Text>
      </Box>
      <Text 
        mt={2}
        whiteSpace="pre-wrap"
        maxW={["90%", "70%"]}
      >
        Warning: forced updates will force the analyze of all repository data!
      </Text>
      <HStack
        spacing={4}
      >
        <Button
          type="submit"
          theme="primary"
          disabled={isLoading}
          onClick={handleForceRepositoryUpdate}
        >
          Force update
        </Button>
        <Button
          type="button"
          theme="red"
          disabled={isLoading}
          colorIndexes={["400", "500", "500"]}
          onClick={handleDeleteRepository}
          isDisabled
        >
          Delete
        </Button>
      </HStack>
    </Stack>
  );
};

export { RepositoryConfiguration };

