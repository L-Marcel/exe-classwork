import { Avatar, AvatarProps, Box, BoxProps, Text } from "@chakra-ui/react";

interface ProfileProps extends BoxProps {
  user?: User;
  avatarProps?: AvatarProps;
  showUsername?: boolean;
};

function Profile({ 
  children, 
  user, 
  avatarProps,
  position,
  showUsername = false,
  ...rest 
}: ProfileProps) {
  return (
    <Box
      data-testid="profile"
      display="flex"
      w="min-content"
      alignItems="center"
      position={position}
    >
      <Box
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
          {...avatarProps}
        />
      </Box>
      { showUsername && <Text
        flexWrap="nowrap"
        w="max-content"
      >
        {user.name ?? user.username}
      </Text> }
    </Box>
  );
};

export { Profile };

