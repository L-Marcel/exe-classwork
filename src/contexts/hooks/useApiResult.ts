import { useQuery } from "react-query";
import { Api } from "../../services/api";

interface SearchResultProps<T> {
  queryTo: string;
  initialData?: T[];
};

function useApiResult<T = any>({ 
  queryTo,
  initialData
}: SearchResultProps<T>) {
  const { data, isFetching } = useQuery([queryTo], async() => {
    return await Api.get<T[]>(`${queryTo}`)
    .then(res => res.data)
    .catch(() => {
      return [] as T[];
    });
  }, {
    initialData
  });

  return {
    data: data? data:initialData,
    isFetching
  };
};

export { useApiResult };

