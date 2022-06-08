import { Input, InputProps } from "@chakra-ui/react";
import { m } from "framer-motion";

function DatePicker({ ...rest }: InputProps) {
  return (
    <Input 
      type="date"
      as={m.input}
      size="md"
      bgColor="solid.100"
      border="none"
      minW="80px"
      borderLeft="2px solid var(--chakra-colors-primary-700)!important"
      borderRadius={8}
      _placeholder={{
        color: "alt.400"
      }}
      _focus={{
        bgColor: "search.100"
      }}
      {...rest}
    />
  );
};

export { DatePicker };
