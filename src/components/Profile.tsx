import { Avatar, Box, BoxProps } from "@chakra-ui/react";
import { User } from "@prisma/client";

interface ProfileProps extends BoxProps {
  user?: User;
};

function Profile({ children, ...rest }: ProfileProps) {
  return (
    <Box
      display="flex"
      borderRadius={60}
      bgColor="solid.100"
      p={2}
    >
      <Avatar 
        bgColor="solid.250"
        pr="2px"
        pt="2px"
      />
    </Box>
  );
};

export { Profile };