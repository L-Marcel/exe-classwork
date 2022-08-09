import { useSearchResult } from "../../../contexts/hooks/useSearchResult";
import { DynamicGridList } from "../DynamicGridList";
import { NotFoundMessage } from "../NotFoundMessage";
import { SearchingMessage } from "../SearchingMessage";
import { ClassroomMemberItem } from "./ClassroomMemberItem";

interface ClassroomMembersListProps {
  initialData: ClassroomRelation[];
  classroomId: string;
  rolesAreRestricted?: boolean;
  userIsOwner?: boolean;
  userIsAuthorized?: boolean;
};

function ClassroomMembersList({ 
  initialData, 
  classroomId, 
  rolesAreRestricted = false,
  userIsOwner = false,
  userIsAuthorized = false
}: ClassroomMembersListProps) {
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
      colsMaxW={["100%", "100%", "100%", "50%", "33%", "33%"]}
      cols={{
        base: ["a"],
        xl: ["a", "b", "c"],
        lg: ["a", "b"],
        md: ["a"],
        sm: ["a"]
      }}
      items={members?.map(m => {
        return (
          <ClassroomMemberItem
            key={m.user.id}
            rolesAreRestricted={rolesAreRestricted}
            userIsOwner={userIsOwner}
            userIsAuthorized={userIsAuthorized}
            member={m}
          />
        );
      })}
    />
  );
};

export { ClassroomMembersList };

