import { useSearchResult } from "../../../contexts/hooks/useSearchResult";
import { DynamicGridList } from "../DynamicGridList";
import { NotFoundMessage } from "../NotFoundMessage";
import { SearchingMessage } from "../SearchingMessage";
import { TeamMemberItem } from "./TeamMemberItem";

interface TeamMembersListProps {
  classroomId: string;
  teamId: string;
  initialData: TeamRelation[];
};

function TeamMembersList({ 
  initialData,
  classroomId,
  teamId
}: TeamMembersListProps) {
  const { data: members, isFetching } = useSearchResult<TeamRelation>({
    queryTo: `/user/classroom/${classroomId}/team/${teamId}/members`,
    initialData
  });

  return (
    <DynamicGridList
      w="100%"
      mt={2}
      notFoundElement={isFetching? 
        <SearchingMessage/>:
        <NotFoundMessage
          instance="member"
        />
      }
      items={members?.map(m => {
        return (
          <TeamMemberItem
            key={m?.user?.id}
            member={m}
          />
        );
      })}
    />
  );
};

export { TeamMembersList };

