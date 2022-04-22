import { Box, BoxProps, Progress, Text } from "@chakra-ui/react";
import { m } from "framer-motion";
import { fadeToTop } from "../theme/animations/motion";
import { Logo } from "./Logo";

interface PageFallbackProps extends BoxProps {
  title?: string;
};

function PageFallback({ title = "exe classwork prod", ...rest }: PageFallbackProps) {
  return (
    <Box
      display="flex"
      flexDir="column"
      justifyContent="center"
      alignItems="center"
      h="100vh"
      {...rest}
    >
      <Logo
        mb={4}
        mt={-20}
      />
      <Progress
        as={m.div}
        isIndeterminate
        w={["80%", "50%"]}
        h={2}
        {...fadeToTop}
      />
      <Text
        as={m.p}
        mt={5}
        w={["78%", "40%"]}
        textAlign="center"
        {...fadeToTop}
      >
        {title}
      </Text>
    </Box> 
  );
};

export { PageFallback };