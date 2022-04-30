import { Box, Input as ChakraInput, InputGroup, InputGroupProps, InputLeftElement, Text, useBreakpointValue } from "@chakra-ui/react";
import { m } from "framer-motion";
import { ChangeEvent, useState } from "react";
import { useInputErrors } from "../../contexts/hooks/useInputErrors";
import { NamedIcon } from "../NamedIcon";

export interface InputProps extends InputGroupProps {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  iconName: string;
  placeholder?: string;
  value?: string;
  name?: string;
  register?: any;
  disableAnimation?: boolean;
};

function Input({ 
  onChange, 
  placeholder, 
  value,
  name,
  iconName,
  register,
  bgColor,
  as,
  disableAnimation = false,
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
  const error = inputErrors[name ?? register?.name];

  return (
    <Box
      display="flex"
      flexDir="column"
    >
      <InputGroup
        w={[300, 350, 500]}
        maxW="80vw"
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
          bgColor={(!disableAnimation && isFocused) && "alpha.50"}
          color={isFocused && (error? "red.400":"primary.700")}
        />
        <ChakraInput
          as={as ?? m.input}
          size={isWideOrNormalVersion? "md":"sm"}
          bgColor={bgColor ?? "solid.100"}
          border="none"
          minW="80px"
          borderLeft={`2px solid var(--chakra-colors-${error? "red-400":"primary-700"})!important`}
          borderRadius={8}
          _placeholder={{
            color: "alt.400"
          }}
          w="100%"
          placeholder={placeholder}
          initial={
            !isWideOrNormalVersion? "smInitial":"initial"
          }
          animate={
            !isWideOrNormalVersion? 
              !disableAnimation && (isFocused? "smFocused":"smInitial"):
              !disableAnimation && (isFocused? "focused":"initial")
          }
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
          {...register}
        />
      </InputGroup>
      { error && <Text
        mt={1}
        color="red.400"
      >
        {error.message}
      </Text> }
    </Box>
  );
};

export { Input };

