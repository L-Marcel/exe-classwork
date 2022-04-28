import { Box, BoxProps } from "@chakra-ui/react";
import { ReactNode } from "react";

interface SectionProps extends BoxProps {
  children: ReactNode;
  forceWidth?: boolean;
  isNeabyOfNavigation?: boolean;
};

function Section({ 
  children, 
  forceWidth = false,
  isNeabyOfNavigation = false,
  ...rest 
}: SectionProps) {
  return (
    <Box
      display="flex"
      flexDir="column"
      mt={isNeabyOfNavigation? [10, 10, 0]:null}
      alignItems="flex-start"
      px={forceWidth && [10, 14, 28, 28, 28, 28]}
      w={forceWidth && "calc(100vw - 5px)!important"}
      py={10}
      pl={[10, 14, 28]}
      pr={[10, 14, 28]}
      __css={{
        "&:nth-of-type(2n)": {
          bgColor: "solid.25"
        }
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};

export { Section };

