import { useQuery } from "react-query";
import { usePage } from "../../../contexts/hooks/usePage";
import { useSearch } from "../../../contexts/hooks/useSearch";
import { Api } from "../../../services/api";
import { DynamicGridList } from "../DynamicGridList";
import { NotFoundMessage } from "../NotFoundMessage";
import { SearchingMessage } from "../SearchingMessage";
import { ClassroomItem } from "./ClassroomItem";

function ClassroomsList() {
  const { search } = useSearch();
  const { page } = usePage();

  const { data: classrooms, isFetching } = useQuery([page, search], async() => {
    return await Api.get(`/user/classrooms?page=${page}&query=${search}`).then(res => res.data).catch(() => []);;
  }, {
    initialData: []
  });

  return (
    <DynamicGridList
      w="100%"
      mt={7}
      notFoundElement={isFetching? 
        <SearchingMessage/>:
        <NotFoundMessage
          instance="classroom"
        />
      }
      items={classrooms.map(c => {
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

