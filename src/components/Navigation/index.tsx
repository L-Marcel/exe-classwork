import { BoxProps, Stack } from "@chakra-ui/react";
import { m } from "framer-motion";
import { useRouter } from "next/router";
import { useUser } from "../../contexts/hooks/useUser";
import { Profile } from "../Profile";
import { NavigationItem } from "./NavigationItem";

interface NavigationProps extends BoxProps {};

function Navigation({ ...rest }: NavigationProps) {
  const { user } = useUser();
  const { asPath } = useRouter();
 
  if(!user) {
    return null;
  };

  const items = [
    {
      path: `/app/${user.githubId}`,
      name: "Home"
    },
    {
      path: `/app/${user.githubId}/classrooms`,
      name: "Classroom"
    }
  ];

  return (
    <>
      <Profile
        user={user}
      />
      <Stack
        m={8}
        as={m.div}
        spacing={2}
        data-testid="navigation"
        display="flex"
        flexDir="column"
        borderRadius={12}
        w="min-content"
        bgColor="solid.100"
        p={2}
        {...rest}
      >
        {items.map(n => {
          return (
            <NavigationItem
              key={n.path}
              path={n.path}
              name={n.name}
              isSelected={asPath.toLowerCase() === n.path.toLowerCase()}
            />
          );
        })}
      </Stack>
    </>
  );
};

export { Navigation };