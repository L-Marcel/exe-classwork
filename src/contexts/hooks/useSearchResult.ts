import { useEffect } from "react";
import { useQuery } from "react-query";
import { Api } from "../../services/api";
import { useCount } from "./useCount";
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
  const { setCount, count } = useCount();

  const { data, isFetching } = useQuery([queryTo, page, search], async() => {
    return await Api.get<PaginatedData<T>>(`${queryTo}?page=${page}&query=${search}`)
    .then(res => res.data)
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

  useEffect(() => {
    if(data.count !== count) {
      setCount(Number(data.count));
    };
  }, [data.count]);

  return {
    data: search === "" && initialData? initialData:data.items,
    isFetching
  };
};

export { useSearchResult };

