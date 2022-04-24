import { Avatar, Box, BoxProps } from "@chakra-ui/react";

interface ProfileProps extends BoxProps {
  user?: User;
};

function Profile({ children, user, ...rest }: ProfileProps) {
  return (
    <Box
      data-testid="profile"
      display="flex"
      borderRadius={60}
      bgColor="solid.100"
      p={2}
      w="min-content"
      {...rest}
    >
      <Avatar
        src={user.avatarUrl}
        name={user.name ?? user.username}
        bgColor="solid.250"
        pr="2px"
        pt="2px"
      />
    </Box>
  );
};

export { Profile };