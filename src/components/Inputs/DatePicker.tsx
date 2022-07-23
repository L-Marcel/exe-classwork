import { Input, InputGroup, InputProps, InputRightElement } from "@chakra-ui/react";
import { m } from "framer-motion";
import { NamedIcon } from "../NamedIcon";

function DatePicker({ ...rest }: InputProps) {
  return (
    <InputGroup
      maxW="80vw"
      alignSelf="flex-start"
      borderLeft="2px solid var(--chakra-colors-primary-700)!important"
      borderRadius={8}
      {...rest}
    >
      <InputRightElement
        as={m.div}
        pointerEvents="none"
        position="absolute"
        bgColor="alpha.50"
        right={0}
        borderRadius={8}
        h={10}
        w={10}
        children={<NamedIcon name="calendar" cursor="pointer"/>}
      />
      <Input 
        type="date"
        as={m.input}
        size="md"
        bgColor="solid.100"
        border="none"
        minW="80px"
        borderRadius={8}
        _placeholder={{
          color: "alt.400"
        }}
        _focus={{
          bgColor: "search.100"
        }}
        {...rest}
      />
    </InputGroup>
  );
};

export { DatePicker };

