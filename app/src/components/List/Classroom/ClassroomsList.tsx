import { useSearchResult } from "../../../contexts/hooks/useSearchResult";
import { DynamicGridList } from "../DynamicGridList";
import { NotFoundMessage } from "../NotFoundMessage";
import { SearchingMessage } from "../SearchingMessage";
import { ClassroomItem } from "./ClassroomItem";

function ClassroomsList() {
  const { data: classrooms, isFetching } = useSearchResult<Classroom>({
    queryTo: "/user/classrooms"
  });
  
  return (
    <DynamicGridList
      w="100%"
      mt={2}
      notFoundElement={isFetching? 
        <SearchingMessage/>:
        <NotFoundMessage
          instance="classroom"
        />
      }
      items={classrooms?.map(c => {
        return (
          <ClassroomItem
            key={c.id}
            {...c}
          />
        );
      })}
    />
  );
};

export { ClassroomsList };

