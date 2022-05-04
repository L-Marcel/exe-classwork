import { Stack } from "@chakra-ui/react";
import { useSearchResult } from "../../../contexts/hooks/useSearchResult";
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
    <>
      {teams.length === 0 && (isFetching? 
        <SearchingMessage/>:
        <NotFoundMessage
          instance="member"
        />
      )}
      <Stack
        display="flex"
        w="100%"
      >
        {teams.map((m) => {
          return (
            <ClassroomTeamItem
              key={m.id}
              team={m}
            />
          );
        })}
      </Stack>
    </>
  );
};

export { ClassroomTeamsList };

