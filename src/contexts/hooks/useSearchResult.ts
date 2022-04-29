import { useQuery } from "react-query";
import { Api } from "../../services/api";
import { usePage } from "./usePage";
import { useSearch } from "./useSearch";

interface SearchResultProps<T> {
  queryTo: string;
  initialData?: T[];
};

function useSearchResult<T = any>({ 
  queryTo, 
  initialData
}: SearchResultProps<T>) {
  const { page } = usePage();
  const { search } = useSearch();

  const { data, isFetching } = useQuery([queryTo, page, search], async() => {
    return await Api.get<T[]>(`${queryTo}?page=${page}&query=${search}`).then(res => res.data).catch(() => [] as T[]);
  }, {
    initialData: []
  });

  return {
    data: search === "" && initialData? initialData:data,
    isFetching
  };
};

export { useSearchResult };

