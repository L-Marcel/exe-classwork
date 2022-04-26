import { Box, BoxProps } from "@chakra-ui/react";
import { ReactNode } from "react";

interface SectionProps extends BoxProps {
  children: ReactNode;
};

function Section({ children }: SectionProps) {
  return (
    <Box
      display="flex"
      flexDir="column"
      alignItems={["center", "center", "flex-start"]}
      py={10}
      px={[10, 14, 28]}
    >
      {children}
    </Box>
  );
};

export { Section };

