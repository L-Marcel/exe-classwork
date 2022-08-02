import { Box, NumberDecrementStepper, NumberIncrementStepper, NumberInput as ChakraNumberInput, NumberInputField, NumberInputProps as ChakraNumberInputProps, NumberInputStepper, Text, useBreakpointValue } from "@chakra-ui/react";
import { UseFormRegisterReturn } from "react-hook-form";
import { useInputErrors } from "../../contexts/hooks/useInputErrors";

export interface NumberInputProps extends ChakraNumberInputProps {
  iconName: string;
  register?: UseFormRegisterReturn;
};

function NumberInput({ 
  iconName,
  register,
  name,
  bgColor,
  ...rest 
}: NumberInputProps) {
  const { inputErrors } = useInputErrors();
  const isWideOrNormalVersion = useBreakpointValue({
    base: false,
    sm: false,
    md: true,
    xl: true,
    lg: true
  });

  const error = inputErrors[name ?? register?.name];

  return (
    <Box
      display="flex"
      flexDir="column"
    >
      <ChakraNumberInput
        allowMouseWheel
        size={isWideOrNormalVersion? "md":"sm"}
        bgColor={bgColor ?? "solid.100"}
        border="none"
        minW="80px"
        borderLeft={`2px solid var(--chakra-colors-${error? "red-400":"primary-700"})!important`}
        borderRadius={8}
        w="100%"
        _focus={{
          bgColor: "search.100"
        }}
        {...register as any}
        {...rest}
      >
        <NumberInputField
          border="none"
          outline="none"
          boxShadow="none!important"
          borderRadius={8}
        />
        <NumberInputStepper>
          <NumberIncrementStepper/>
          <NumberDecrementStepper/>
        </NumberInputStepper>
      </ChakraNumberInput>
      { error && <Text
        mt={1}
        color="red.400"
      >
        {error.message}
      </Text> }
    </Box>
  );
};

export { NumberInput };

