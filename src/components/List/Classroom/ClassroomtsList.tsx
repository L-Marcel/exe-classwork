import { useState } from "react";
import { useQuery } from "react-query";
import { Api } from "../../../services/api";
import { DynamicGridList } from "../DynamicGridList";
import { ClassroomItem } from "./ClassroomItem";

function ClassroomsList() {
  const [page, setPage] = useState(0);

  const { data: classrooms } = useQuery([page], async() => {
    return await Api.get("/user/classrooms").then(res => res.data).catch(() => []);;
  }, {
    initialData: []
  });

  return (
    <DynamicGridList
      w="100%"
      p={10}
      mt={[10, 0]}
      ml={[0, 6, 8, 8, 8, 5]}
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

