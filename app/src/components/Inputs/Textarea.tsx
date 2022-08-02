import { Box, Text, Textarea as ChakraTextarea, TextareaProps as ChakraTextareaProps } from "@chakra-ui/react";
import { m } from "framer-motion";
import { ChangeEvent } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { useInputErrors } from "../../contexts/hooks/useInputErrors";

interface TextareaProps extends ChakraTextareaProps {
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  value?: string;
  name?: string;
  register?: UseFormRegisterReturn;
};

function Textarea({ 
  onChange, 
  placeholder, 
  value,
  name,
  register,
  as,
  ...rest 
}: TextareaProps) {
  const { inputErrors } = useInputErrors();
  const error = inputErrors[name ?? register?.name];

  return (
    <Box
      display="flex"
      flexDir="column"
    >
      <ChakraTextarea
        as={as ?? m.textarea}
        w={[300, 350, 500]}
        maxW="80vw"
        bgColor="solid.100"
        border="none"
        borderLeft={`2px solid var(--chakra-colors-${error? "red-400":"primary-700"})!important`}
        borderRadius={8}
        overflowY="scroll"
        _placeholder={{
          color: "alt.400"
        }}
        placeholder={placeholder}
        _focus={{
          bgColor: "search.100"
        }}
        {...rest}
        {...register}
      />
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

export { Textarea };

