import { Box, BoxProps } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useUser } from "../contexts/hooks/useUser";

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
  const { user } = useUser();

  return (
    <Box
      display="flex"
      flexDir="column"
      mt={isNeabyOfNavigation? [16, 16, 0]:null}
      alignItems="flex-start"
      px={user? [10, 14, 28, 28, 28, 28]:10}
      py={10}
      pl={user? [10, 14, 28]:10}
      pr={user? [10, 14, 28]:10}
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

