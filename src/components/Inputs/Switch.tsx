import { HStack, Switch as ChakraSwitch, SwitchProps as ChakraSwitchProps, Text } from "@chakra-ui/react";
import { UseFormRegisterReturn, UseFormWatch } from "react-hook-form";

interface SwitchProps extends ChakraSwitchProps {
  register?: UseFormRegisterReturn;
  text?: string;
  watch?: UseFormWatch<any>;
};

function Switch({ text, register, watch, ...rest }: SwitchProps) {
  return (
    <HStack>
      <ChakraSwitch
        {...register}
        {...rest}
      />
      { text && <Text>
        {text} {(watch && register) && (watch(register?.name)? "Yes.":"No.")}
      </Text>}
    </HStack>
  );
};

export { Switch };

