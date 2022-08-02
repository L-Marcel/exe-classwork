import { Box, BoxProps, Progress, Text } from "@chakra-ui/react";
import { m } from "framer-motion";
import { fadeToTop } from "../theme/animations/motion";
import { Logo } from "./Logo";

interface PageFallbackProps extends BoxProps {
  title?: string;
  progress?: number;
  subtitle?: string;
};

function PageFallback({ title = "Loading.", subtitle, progress, ...rest }: PageFallbackProps) {
  return (
    <Box
      data-testid="page-fallback"
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
        isIndeterminate={!progress}
        w={["80%", "50%"]}
        h={2}
        value={progress}
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
      { subtitle && <Text
        as={m.p}
        mt={3}
        w={["78%", "40%"]}
        textAlign="center"
        fontSize=".8rem"
        {...fadeToTop}
      >
        {subtitle}
      </Text> }
    </Box> 
  );
};

export { PageFallback };

