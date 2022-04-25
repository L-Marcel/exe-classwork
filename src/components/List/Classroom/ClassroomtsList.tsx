import { useQuery } from "react-query";
import { usePage } from "../../../contexts/hooks/usePage";
import { useSearch } from "../../../contexts/hooks/useSearch";
import { Api } from "../../../services/api";
import { DynamicGridList } from "../DynamicGridList";
import { ClassroomItem } from "./ClassroomItem";

function ClassroomsList() {
  const { search } = useSearch();
  const { page } = usePage();

  const { data: classrooms } = useQuery([page, search], async() => {
    return await Api.get(`/user/classrooms?page=${page}&query=${search}`).then(res => res.data).catch(() => []);;
  }, {
    initialData: []
  });

  return (
    <DynamicGridList
      w="100%"
      mt={7}
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

