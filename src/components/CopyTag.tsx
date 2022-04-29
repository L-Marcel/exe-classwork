import { Box, Tag, Text, useBreakpointValue } from "@chakra-ui/react";
import { useState } from "react";
import { IconButton } from "./Buttons/IconButton";
import { NamedIcon } from "./NamedIcon";

interface CopyTagProps {
  text?: string;
  successMessage?: string;
  time?: number;
};

function CopyTag({ text, successMessage, time = 3000 }: CopyTagProps) {
  const isWideOrNormalVersion = useBreakpointValue({
    base: false,
    sm: false,
    md: true,
    xl: true,
    lg: true
  });
  const [message, setMessage] = useState(null);
  let timer;

  if(!text) {
    return null;
  };

  if(!isWideOrNormalVersion) {
    return (
      <>
        <IconButton 
          aria-label="copy-button"
          icon={<NamedIcon name="copy"/>}
          theme="primary"
          h={8}
          w={8}
          minW="auto"
        />
        <Text>
          -{'>'} Invite code
        </Text>
      </>
    );
  };

  return (
    <Box
      position="relative"
      maxW={280}
    >
      <Tag 
        bg="solid.100"
        position="relative"
        px={3}
        pr="44px"
        h={8}
        userSelect="text"
        onClick={() => {
          navigator.clipboard.writeText(text)
          .then(() => {
            setMessage(successMessage ?? "Copied!");
            clearTimeout(timer);
            setTimeout(() => {
              setMessage(null);
            }, time);
          }).catch(() => {
            setMessage("Error on copy!");
            clearTimeout(timer);
            setTimeout(() => {
              setMessage(null);
            }, time);
          })
        }}
        overflow="hidden"
        whiteSpace="nowrap"
        maxW={"auto"}
        style={{
          lineClamp: 2
        }}
        _hover={{
          cursor: "pointer"
        }}
      >
        {text}
        <IconButton 
          aria-label="copy-button"
          icon={<NamedIcon name="copy"/>}
          theme="primary"
          position="absolute"
          right={0}
          m={0}
          p={4}
          mr={0}
          h="min-content"
          w="10px"
          minW="auto"
        />
      </Tag>
      {
        message && <Text
          position="absolute"
          bottom={-5}
          mt="2px"
          ml="2px"
          fontSize=".8rem"
        >
          {message}
        </Text>
      }
    </Box>
  );
};

export { CopyTag };

