import { Stack } from "@chakra-ui/react";
import { useSearchResult } from "../../../contexts/hooks/useSearchResult";
import { NotFoundMessage } from "../NotFoundMessage";
import { SearchingMessage } from "../SearchingMessage";
import { AlertItem } from "./AlertItem";

function AlertsList() {
  const { 
    data: alerts,
    isFetching
  } = useSearchResult<Alert>({
    queryTo: `/user/alerts`,
    initialData: []
  });

  return (
    <>
      {alerts.length === 0 && (isFetching? 
        <SearchingMessage/>:
        <NotFoundMessage
          instance="alert"
        />
      )}
      <Stack
        display="flex"
        w="100%"
      >
        {alerts.map((a) => {
          return (
            <AlertItem
              key={a.id}
              alert={a}
            />
          );
        })}
      </Stack>
    </>
  );
};

export { AlertsList };

