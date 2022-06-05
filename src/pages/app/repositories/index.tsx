import { Box, HStack, useDisclosure } from "@chakra-ui/react";
import { AddInstanceButton } from "../../../components/Buttons/AddInstanceButton";
import { RepositoryList } from "../../../components/List/Repository/RepositoryList";
import { AddRepositoryModal } from "../../../components/Modal/AddRepositoryModal";
import { Pagination } from "../../../components/Pagination";
import { Search } from "../../../components/Search";
import { Section } from "../../../components/Section";
import { Title } from "../../../components/Title";
import { useIsLoading } from "../../../contexts/hooks/useIsLoading";
import { SearchProvider } from "../../../contexts/SearchProvider";
import { Api } from "../../../services/api";
import { WithUserProps } from "../../../utils/routes/WithUserProps";

interface RepositoriesPageProps extends WithUserProps {};

function RepositoriesPage({}: RepositoriesPageProps) {
  const { 
    stopLoading,
    isLoading
  } = useIsLoading();

  const { onClose, isOpen, onOpen } = useDisclosure();
  
  function onSubmit(repository: Repository) {
    onClose();
    
    Api.post(`/user/repository`, {
      ...repository,
      owner: {
        id: repository.owner.id
      }
    }).then(() => {
      stopLoading();
    }).catch((err) => {
      console.log(err);
      stopLoading();
    });
  };

  return (
    <>
      <AddRepositoryModal
        onClose={onClose} 
        isOpen={isOpen}
        onSubmit={({ repository }) => onSubmit(repository)}
      />
      <Section
        isNeabyOfNavigation
      >
        <Title>
          Repositories
        </Title>
        <SearchProvider>
          <Box
            display="flex"
            flexDir={["column", "column", "column", "row"]}
            alignItems={["flex-start"]}
            flexWrap="wrap"
            mt={5}
            justifyContent="space-between"
            w="100%"
          >
            <HStack 
              spacing={5}
              mb={5}
            >
              <Search
                placeholder="Search by title..."
              />
              <AddInstanceButton
                onClick={onOpen}
                isDisabled={isLoading}
              />
            </HStack>
            <Pagination/>
          </Box>
          <RepositoryList/>
        </SearchProvider>
      </Section>
    </>
  );
};

export default WithUserProps(RepositoriesPage);