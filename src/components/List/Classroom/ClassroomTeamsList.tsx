import { useSearchResult } from "../../../contexts/hooks/useSearchResult";
import { DynamicGridList } from "../DynamicGridList";
import { NotFoundMessage } from "../NotFoundMessage";
import { SearchingMessage } from "../SearchingMessage";
import { ClassroomTeamItem } from "./ClassroomTeamItem";

interface ClassroomTeamsListProps {
  initialData: Team[];
  classroomId: string;
};

function ClassroomTeamsList({ initialData, classroomId }: ClassroomTeamsListProps) {
  const { data: teams, isFetching } = useSearchResult<Team>({
    queryTo: `/user/classroom/${classroomId}/teams`,
    initialData
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
      items={teams?.map(t => {
        return (
          <ClassroomTeamItem
            key={t.id}
            team={t}
          />
        );
      })}
    />
  );
};

export { ClassroomTeamsList };

