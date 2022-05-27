import { useSearchResult } from "../../../contexts/hooks/useSearchResult";
import { DynamicGridList } from "../DynamicGridList";
import { NotFoundMessage } from "../NotFoundMessage";
import { SearchingMessage } from "../SearchingMessage";
import { RepositoryItem } from "./RepositoryItem";

function RepositoryList() {
  const { data: repositories, isFetching } = useSearchResult<Repository>({
    queryTo: "/user/repositories"
  });
  
  return (
    <DynamicGridList
      w="100%"
      mt={2}
      notFoundElement={isFetching? 
        <SearchingMessage/>:
        <NotFoundMessage
          instance="repository"
        />
      }
      items={repositories?.map(c => {
        return (
          <RepositoryItem
            key={c.id}
            {...c}
          />
        );
      })}
    />
  );
};

export { RepositoryList };

