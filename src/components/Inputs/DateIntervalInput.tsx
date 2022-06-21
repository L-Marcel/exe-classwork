import { Box, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { NamedIcon } from "../NamedIcon";
import { DatePicker } from "./DatePicker";

interface DateIntervalInputProps {
  initialAfterDate?: string | Date;
  initialBeforeDate?: string | Date;
  onChangeInterval: (
    getFilteredResult: (date: string | Date) => boolean
  ) => void;
};

function DateIntervalInput({
  onChangeInterval,
  initialAfterDate,
  initialBeforeDate
}: DateIntervalInputProps) {
  const [canResetInput, setCanResetInput] = useState(true);

  const afterDate = new Date(initialAfterDate || null);
  const beforeDate = new Date(initialBeforeDate || null);

  const [selectedAfterDate, setSelectedAfterDate] = useState<string>(format(afterDate, "yyyy-MM-dd"));
  const [selectedBeforeDate, setSelectedBeforeDate] = useState<string>(format(beforeDate, "yyyy-MM-dd"));

  const _callbackWithDelay = useRef(debounce((callback: Function) => {
    callback();
  }, 300));

  const handleResetAfterDate = useCallback(() => {
    setSelectedAfterDate(format(afterDate, "yyyy-MM-dd"));
  }, [setSelectedAfterDate]);

  const handleResetBeforeDate = useCallback(() => {
    setSelectedBeforeDate(format(beforeDate, "yyyy-MM-dd"));
  }, [setSelectedBeforeDate]);

  const handleResetDate = useCallback(() => {
    handleResetAfterDate();
    handleResetBeforeDate();
  }, [handleResetAfterDate, handleResetBeforeDate]);

  useEffect(() => {
    if(selectedAfterDate && selectedBeforeDate) {
      _callbackWithDelay.current(() => {
        onChangeInterval(d => {
          const date = new Date(d);
    
          const afterDate = new Date(selectedAfterDate);
          const utcAfterDate = new Date( 
            afterDate.getUTCFullYear(), 
            afterDate.getUTCMonth(), 
            afterDate.getUTCDate(), 
            afterDate.getUTCHours(), 
            afterDate.getUTCMinutes(), 
            afterDate.getUTCSeconds() 
          );
    
          const beforeDate = new Date(selectedBeforeDate);
          const utcBeforeDate = new Date( 
            beforeDate.getUTCFullYear(), 
            beforeDate.getUTCMonth(), 
            beforeDate.getUTCDate(), 
            23, 
            59, 
            59 
          );
    
          return date.getTime() >= utcAfterDate.getTime() && date.getTime() <= utcBeforeDate.getTime();
        });
      });
    } else if(!selectedAfterDate) {
      _callbackWithDelay.current(() => {
        canResetInput && handleResetAfterDate();
      });
    } else if(!selectedBeforeDate) {
      _callbackWithDelay.current(() => {
        canResetInput && handleResetBeforeDate();
      });
    };
  }, [_callbackWithDelay, canResetInput, selectedAfterDate, selectedBeforeDate]);

  return (
    <Box
      display="flex"
      justifyContent="flex-start"
      alignItems={["flex-start", "center"]}
      flexDirection={["column", "row"]}
      gap={[3, 3, 5]}
      mt={4}
    >
      <Box
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        gap={[3, 3, 5]}
      >
        <DatePicker
          value={selectedAfterDate}
          onFocus={() => setCanResetInput(false)}
          onBlur={() => setCanResetInput(true)}
          onChange={e => setSelectedAfterDate(e.target.value)}
        />
        <Box
          position="relative"
          onClick={handleResetDate}
          display={["none", "none", "initial"]}
          w={["0", "0", "initial"]}
          cursor="pointer"
          transition="color .1s"
          _hover={{
            color: "primary.500"
          }}
        >
          <NamedIcon
            name="refresh"
            position="absolute"
            top="-5px"
            left="-10px"
            w={9}
            h={9}
          />
          <Text
            color="solid.900"
          >
            to
          </Text>
        </Box>
      </Box>
      <DatePicker
        value={selectedBeforeDate}
        onFocus={() => setCanResetInput(false)}
        onBlur={() => setCanResetInput(true)}
        onChange={e => setSelectedBeforeDate(e.target.value)}
      />
    </Box>
  );
};

export { DateIntervalInput };

