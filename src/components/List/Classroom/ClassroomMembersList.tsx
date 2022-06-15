import { useSearchResult } from "../../../contexts/hooks/useSearchResult";
import { DynamicGridList } from "../DynamicGridList";
import { NotFoundMessage } from "../NotFoundMessage";
import { SearchingMessage } from "../SearchingMessage";
import { ClassroomMemberItem } from "./ClassroomMemberItem";

interface ClassroomMembersListProps {
  initialData: ClassroomRelation[];
  classroomId: string;
};

function ClassroomMembersList({ initialData, classroomId }: ClassroomMembersListProps) {
  const { data: members, isFetching } = useSearchResult<ClassroomRelation>({
    queryTo: `/user/classroom/${classroomId}/members`,
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
          <ClassroomMemberItem
            key={m.user.id}
            member={m}
          />
        );
      })}
    />
  );
};

export { ClassroomMembersList };

