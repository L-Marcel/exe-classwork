import { Stack, StackProps, useBreakpointValue } from "@chakra-ui/react";
import { m } from "framer-motion";
import { useRouter } from "next/router";
import { useState } from "react";
import { useUser } from "../../contexts/hooks/useUser";
import { IconButton } from "../Buttons/IconButton";
import { ToggleColorButton } from "../Buttons/ToogleColorButton";
import { NamedIcon } from "../NamedIcon";
import { Profile } from "../Profile";
import { NavigationItem } from "./NavigationItem";

interface NavigationProps extends StackProps {};

function Navigation({ ...rest }: NavigationProps) {
  const { user } = useUser();
  const { asPath } = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const isWideOrNormalVersion = useBreakpointValue({
    base: false,
    sm: false,
    md: true,
    xl: true,
    lg: true
  });
 
  if(!user) {
    return (
      <ToggleColorButton
        position="absolute"
        top={6}
        right={6}
        borderRadius={60}
        w={10}
        h={10}
      />
    );
  };

  const paths = [
    {
      path: `/app/${user.githubId}`,
      name: "Home"
    },
    {
      path: `/app/${user.githubId}/classrooms`,
      name: "Classrooms"
    },
    {
      path: `/app/${user.githubId}/teams`,
      name: "Teams"
    },
    {
      path: `/app/${user.githubId}/repositories`,
      name: "Repositories"
    },
    {
      path: `/app/${user.githubId}/alerts`,
      name: "Alerts"
    }
  ];

  return (
    <>
      { isWideOrNormalVersion && <Profile
        position="absolute"
        user={user}
        m={3}
      /> }
      <Stack
        as={m.div}
        data-testid="navigation"
        position="absolute"
        ml={[4, 4, "-12px", "-12px", "-12px", "-12px"]}
        spacing={2}
        display="flex"
        flexDir="column"
        borderRadius={12}
        w="min-content"
        bgColor="solid.100"
        top={[4, 4, "90px", "90px", "90px", "90px"]}
        p={2}
      >
        { !isWideOrNormalVersion && 
          <IconButton
            aria-label="navigation-menu"
            icon={<NamedIcon name={isOpen? "close":"menu"}/>}
            zIndex={10}
            theme={isOpen? "red":"primary"}
            colorIndexes={isOpen? ["400", "400", "400"]:undefined}
            onClick={() => setIsOpen(o => !o)}
          /> }
        { (isWideOrNormalVersion || isOpen) && <ToggleColorButton
          zIndex={10}
          colorIndexes={isOpen? ["400", "400", "400"]:undefined}
          forceHoverEffect
        /> }
        { (isWideOrNormalVersion || isOpen) && paths.map(n => {
          return (
            <NavigationItem
              key={n.path}
              path={n.path}
              name={n.name}
              forceExpanded={!isWideOrNormalVersion && isOpen}
              isSelected={asPath.toLowerCase() === n.path.toLowerCase()}
            />
          );
        })}
      </Stack>
    </>
  );
};

export { Navigation };
