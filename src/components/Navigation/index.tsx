import { Box, BoxProps, Stack, useBreakpointValue } from "@chakra-ui/react";
import { m } from "framer-motion";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useClassroom } from "../../contexts/hooks/useClassroom";
import { useGlobal } from "../../contexts/hooks/useGlobal";
import { useIsLoading } from "../../contexts/hooks/useIsLoading";
import { useUser } from "../../contexts/hooks/useUser";
import { Api } from "../../services/api";
import { boxShadow } from "../../theme/effects/shadow";
import { IconButton } from "../Buttons/IconButton";
import { SignOutButton } from "../Buttons/SignOutButton";
import { ToggleColorButton } from "../Buttons/ToogleColorButton";
import { NamedIcon } from "../NamedIcon";
import { Overlay } from "../Overlay";
import { Profile } from "../Profile";
import { NavigationDataInfo } from "./NavigationDataInfo";
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

  const { global: globalSocket } = useGlobal();
  const [haveAlert, setHaveAlert] = useState(false);

  const { 
    isLoading 
  } = useIsLoading();

  const checkIfHaveAlerts = useCallback(() => {
    Api.get("user/alerts/check").then(res => {
      if(res.data.count > 0) {
        setHaveAlert(true);
      } else {
        setHaveAlert(false);
      };
    }).catch(() => {});
  }, [setHaveAlert]);
  
  useEffect(() => {
    if(globalSocket !== null && user !== null) {
      checkIfHaveAlerts();
      
      globalSocket.on("@alerts/new", () => {
        checkIfHaveAlerts();
      })
    };
  }, [globalSocket, setHaveAlert, checkIfHaveAlerts]);

  useEffect(() => {
    if(user !== null) {
      checkIfHaveAlerts();
    };
  }, [isLoading]);
 
  if(!user || asPath === "/") {
    return (
      <ToggleColorButton
        position="absolute"
        top={6}
        right={6}
        borderRadius={60}
        w={10}
        h={10}
        zIndex={900}
      />
    );
  };

  const paths = [
    {
      path: `/app`,
      name: "Home"
    },
    {
      path: `/app/classrooms`,
      accept: [
        `/app/classroom`,
        `/app/classrooms/${classroom?.id}`,
        `/app/classrooms/${classroom?.id}/qrcode`
      ],
      name: "Classrooms"
    },
    {
      path: `/app/repositories`,
      accept: [
        "/repositories"
      ],
      name: "Repositories"
    },
    {
      path: `/app/alerts`,
      name: "Alerts"
    }
  ];

  return (
    <>
      <NavigationDataInfo
        haveOverlay={isOpen}
      />
      { (!isWideOrNormalVersion) && <Box
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
            size: isWideOrNormalVersion? "md":"sm"
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
          zIndex={903}
          p={2}
        >
          { !isWideOrNormalVersion && 
            <Box
              position="relative"
              display="flex"
              alignItems="center"
            >
              <IconButton
                aria-label="navigation-menu"
                icon={<NamedIcon name={isOpen? "close":"menu"}/>}
                zIndex={10}
                theme={isOpen? "red":"primary"}
                colorIndexes={isOpen? ["400", "400", "400"]:undefined}
                onClick={() => setIsOpen(o => !o)}
                isDisabled={isLoading}
                { ...boxShadow() }
              />
            </Box>
          }
          { (isWideOrNormalVersion || isOpen) && <ToggleColorButton
            zIndex={10}
            colorIndexes={isOpen? ["400", "400", "400"]:undefined}
            isDisabled={isLoading}
            forceHoverEffect
            { ...boxShadow() }
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
                needPayAttention={haveAlert && n.name === "Alerts"}
                isSelected={
                  asPath.toLowerCase() === n.path.toLowerCase() ||
                  n.accept?.some(a => asPath.toLowerCase().startsWith(a.toLowerCase()))
                }
                isDisabled={isLoading}
            />
          );
          })}
          { (isWideOrNormalVersion || isOpen) && <SignOutButton
            zIndex={10}
            theme="red"
            isDisabled={isLoading}
            colorIndexes={["400", "400", "400"]}
            forceHoverEffect
            { ...boxShadow() }
          /> }
        </Stack>
      </Box>
    </>
  );
};

export { Navigation };

