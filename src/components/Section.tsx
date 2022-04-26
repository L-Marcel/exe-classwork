import { Box, BoxProps } from "@chakra-ui/react";
import { ReactNode } from "react";

interface SectionProps extends BoxProps {
  children: ReactNode;
};

function Section({ children }: SectionProps) {
  return (
    <Box
      py={10}
      px={[10, 14, 28]}
    >
      {children}
    </Box>
  );
};

export { Section };
