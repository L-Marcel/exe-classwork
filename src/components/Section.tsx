import { Box, BoxProps } from "@chakra-ui/react";
import { ReactNode } from "react";

export interface SectionProps extends BoxProps {
  children: ReactNode;
  isNeabyOfNavigation?: boolean;
};

function Section({ 
  children, 
  isNeabyOfNavigation = false,
  bgColor,
  ...rest 
}: SectionProps) {
  return (
    <Box
      display="flex"
      flexDir="column"
      mt={isNeabyOfNavigation? [16, 16, 0]:null}
      alignItems="flex-start"
      px={[10, 14, 28, 28, 28, 28]}
      py={10}
      pl={[10, 14, 28]}
      pr={[10, 14, 28]}
      __css={{
        "&:nth-of-type(2n)": {
          bgColor: bgColor ?? "solid.25"
        }
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};

export { Section };

