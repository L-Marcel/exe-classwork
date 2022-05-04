import { Stack } from "@chakra-ui/react";
import { useSearchResult } from "../../../contexts/hooks/useSearchResult";
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
    <>
      {members.length === 0 && (isFetching? 
        <SearchingMessage/>:
        <NotFoundMessage
          instance="member"
        />
      )}
      <Stack
        display="flex"
        w="100%"
      >
        {members.map((m) => {
          return (
            <ClassroomMemberItem
              key={m.user.id}
              member={m}
            />
          );
        })}
      </Stack>
    </>
  );
};

export { ClassroomMembersList };

