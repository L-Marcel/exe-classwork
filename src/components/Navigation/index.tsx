import { Box, BoxProps, Stack, useBreakpointValue } from "@chakra-ui/react";
import { m } from "framer-motion";
import { useRouter } from "next/router";
import { useState } from "react";
import { useClassroom } from "../../contexts/hooks/useClassroom";
import { useUser } from "../../contexts/hooks/useUser";
import { IconButton } from "../Buttons/IconButton";
import { SignOutButton } from "../Buttons/SignOutButton";
import { ToggleColorButton } from "../Buttons/ToogleColorButton";
import { NamedIcon } from "../NamedIcon";
import { Overlay } from "../Overlay";
import { Profile } from "../Profile";
import { NavigationItem } from "./NavigationItem";

interface NavigationProps extends BoxProps {};

function Navigation({ ...rest }: NavigationProps) {
  const { user } = useUser();
  const { classroom } = useClassroom();
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
      accept: [
        `/app/${user.githubId}/classroom`,
        `/app/${user.githubId}/classrooms/${classroom?.id}`,
        `/app/${user.githubId}/classrooms/${classroom?.id}/qrcode`
      ],
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
      { (!isWideOrNormalVersion && !isOpen) && <Box
        position="absolute"
        display="flex"
        top={0}
        left={0}
        zIndex={900}
        w="100vw"
        h={16}
        bgColor="solid.25"
      /> }
      <Box
        position="absolute"
        top={0}
        left={0}
        w={isWideOrNormalVersion? null:"100vw"}
        zIndex={901}
        {...rest}
      >
        { (!isWideOrNormalVersion && isOpen) && <Overlay/> }
        <Profile
          position="absolute"
          user={user}
          m={3}
          mt={[4, 4, 3]}
          ml={[4, 4, 3]}
          padding={isWideOrNormalVersion? 2:"none"}
          showUsername={!isWideOrNormalVersion}
          avatarProps={{
            size: isWideOrNormalVersion? "md":"sm",
            pr: isWideOrNormalVersion? "2px":0,
            pt: isWideOrNormalVersion? "2px":0
          }}
        />
        <Stack
          as={m.div}
          data-testid="navigation"
          position="absolute"
          ml={[2, 2, "-12px"]}
          right={!isWideOrNormalVersion? 2:null}
          spacing={2}
          display="flex"
          flexDir="column"
          borderRadius={12}
          w="min-content"
          bgColor={(isWideOrNormalVersion || isOpen)? "solid.100":"solid.25"}
          top={[2, 2, "90px"]}
          zIndex={902}
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
                isWideOrNormalVersion={isWideOrNormalVersion}
                expandedAnimation={isWideOrNormalVersion? "expanded":"smExpanded"}
                isSelected={
                  asPath.toLowerCase() === n.path.toLowerCase() ||
                  n.accept?.includes(asPath.toLowerCase())
                }
            />
          );
        })}
        { (isWideOrNormalVersion || isOpen) && <SignOutButton
          zIndex={10}
          theme="red"
          colorIndexes={["400", "400", "400"]}
          forceHoverEffect
        /> }
      </Stack>
    </Box>
    </>
  );
};

export { Navigation };

