import { Box, Input as ChakraInput, InputGroup, InputGroupProps, InputLeftElement, Text, useBreakpointValue } from "@chakra-ui/react";
import { m } from "framer-motion";
import { ChangeEvent, useState } from "react";
import { useInputErrors } from "../../contexts/hooks/useInputErrors";
import { NamedIcon } from "../NamedIcon";

interface InputProps extends InputGroupProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  iconName: string;
  placeholder?: string;
  value?: string;
  name?: string;
};

function Input({ 
  onChange, 
  placeholder, 
  value,
  name,
  iconName,
  ...rest 
}: InputProps) {
  const { inputErrors } = useInputErrors();
  const isWideOrNormalVersion = useBreakpointValue({
    base: false,
    sm: false,
    md: true,
    xl: true,
    lg: true
  });

  const [isFocused, setIsFocused] = useState(false);
  const error = inputErrors.find(err => err.name === name);

  return (
    <Box
      display="flex"
      flexDir="column"
    >
      <InputGroup
        w={[200, 300]}
        maxW="80vw"
        alignSelf={["center", "center", "flex-start"]}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        {...rest}
      >
        <InputLeftElement
          as={m.div}
          pointerEvents="none"
          borderRadius={8}
          h={!isWideOrNormalVersion? 8:10}
          w={!isWideOrNormalVersion? 8:10}
          children={<NamedIcon name={iconName}/>}
          bgColor={isFocused && "alpha.50"}
          color={isFocused && (error? "red.400":"primary.500")}
        />
        <ChakraInput
          as={m.input}
          size={isWideOrNormalVersion? "md":"sm"}
          bgColor="solid.100"
          border="none"
          borderLeft={`2px solid var(--chakra-colors-${error? "red-400":"primary-500"})!important`}
          borderRadius={8}
          _placeholder={{
            color: "alt.400"
          }}
          placeholder={placeholder}
          animate={!isWideOrNormalVersion? isFocused? "smFocused":"smInitial":isFocused? "focused":"initial"}
          variants={{
            initial: {
              paddingLeft: 35
            },
            focused: {
              paddingLeft: 50,
              transition: {
                durantion: 1
              }
            },
            smInitial: {
              paddingLeft: 30
            },
            smFocused: {
              paddingLeft: 40,
              transition: {
                durantion: 1
              }
            }
          }}
          _focus={{
            bgColor: "search.100"
          }}
          onChange={onChange}
          value={value}
          name={name}
        />
      </InputGroup>
      { error && <Text
        mt={1}
        color="red.400"
        alignSelf={["center", "center", "flex-start"]}
      >
        {error.message}
      </Text> }
    </Box>
  );
};

export { Input };
