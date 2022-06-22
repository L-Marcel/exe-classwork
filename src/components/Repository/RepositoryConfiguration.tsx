import { HStack, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useIsLoading } from "../../contexts/hooks/useIsLoading";
import { Api } from "../../services/api";
import { Button } from "../Buttons/Button";
import { Title } from "../Title";

interface RepositoryConfiguratioProps {
  repositoryName: string;
};

function RepositoryConfiguration({
  repositoryName
}: RepositoryConfiguratioProps) {
  const router = useRouter();
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
      <Title>
        Additional configuration
      </Title>
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

