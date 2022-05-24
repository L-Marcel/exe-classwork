import { useQuery } from "react-query";
import { Api } from "../../services/api";

interface SearchResultProps<T> {
  queryTo: string;
  initialData?: T[];
};

function useResult<T = any>({ 
  queryTo,
  initialData
}: SearchResultProps<T>) {
  const { data, isFetching } = useQuery("unread", async() => {
    return await Api.get<PaginatedData<T>>(`${queryTo}`)
    .then(res => {
      return res.data;
    })
    .catch(() => {
      return {
        items: [],
        count: 0
      } as PaginatedData<T>;
    });
  }, {
    initialData: {
      items: initialData,
      count: 0
    }
  });

  return {
    data,
    isFetching
  };
};

export { useResult };

