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
        top={8}
        right={8}
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
      <Stack
        as={m.div}
        position="absolute"
        data-testid="navigation"
        w="min-content"
        alignItems="center"
        spacing={4}
        m={8}
        {...rest}
      >
        { isWideOrNormalVersion && <Profile
          user={user}
        /> }
        <Stack
          as={m.div}
          spacing={2}
          display="flex"
          flexDir="column"
          borderRadius={12}
          w="min-content"
          bgColor="solid.100"
          p={2}
        >
          { !isWideOrNormalVersion && <>
            <IconButton
              aria-label="navigation-menu"
              icon={<NamedIcon name={isOpen? "close":"menu"}/>}
              zIndex={10}
              theme={isOpen? "red":"primary"}
              colorIndexes={isOpen? ["400", "400", "400"]:undefined}
              onClick={() => setIsOpen(o => !o)}
            />
            {
              isOpen && <ToggleColorButton
                zIndex={10}
                theme="orange"
                colorIndexes={isOpen? ["400", "400", "400"]:undefined}
              />
            }
          </> }
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
      </Stack>
      { isWideOrNormalVersion && <ToggleColorButton
        position="absolute"
        top={8}
        right={8}
        borderRadius={60}
        w={10}
        h={10}
      /> }
    </>
  );
};

export { Navigation };