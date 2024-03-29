import { useSearchResult } from "../../../contexts/hooks/useSearchResult";
import { DynamicGridList } from "../DynamicGridList";
import { NotFoundMessage } from "../NotFoundMessage";
import { SearchingMessage } from "../SearchingMessage";
import { ClassroomTeamItem } from "./ClassroomTeamItem";

interface ClassroomTeamsListProps {
  initialData: Team[];
  classroomId: string;
  repositoriesAreRestricted?: boolean;
};

function ClassroomTeamsList({ initialData, classroomId, repositoriesAreRestricted = false }: ClassroomTeamsListProps) {
  const { data: teams, isFetching } = useSearchResult<Team>({
    queryTo: `/user/classroom/${classroomId}/teams`,
    initialData,
  });

  return (
    <DynamicGridList
      w="100%"
      mt={2}
      notFoundElement={isFetching? 
        <SearchingMessage/>:
        <NotFoundMessage
          instance="team"
        />
      }
      colsMaxW={["100%", "100%", "100%", "50%", "33%", "33%"]}
      cols={{
        base: ["a"],
        xl: ["a", "b", "c"],
        lg: ["a", "b"],
        md: ["a"],
        sm: ["a"]
      }}
      items={teams?.map(t => {
        return (
          <ClassroomTeamItem
            key={t.id}
            team={t}
            repositoriesAreRestricted={repositoriesAreRestricted}
          />
        );
      })}
    />
  );
};

export { ClassroomTeamsList };

