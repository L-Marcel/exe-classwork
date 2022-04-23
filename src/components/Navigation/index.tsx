import { Box, BoxProps } from "@chakra-ui/react";
import { ToggleColorButton } from "../Buttons/ToogleColorButton";
import { NavigationItem } from "./NavigationItem";

interface NavigationProps extends BoxProps {};

function Navigation({ ...rest }: NavigationProps) {
  const user = false;

  return (
    <Box
      data-testid="navigation"
      display="flex"
      borderRadius={12}
      bgColor="solid.100"
      p={2}
      {...rest}
    >
      { 
        user && <>
          <NavigationItem 
            path="/"
            title="Home"
          />
          <NavigationItem 
            path="/app"
            title="Home"
          />
          <NavigationItem 
            path="/a"
            title="Home"
          />
          <NavigationItem 
            path="/b"
            title="Home"
          />
        </>
      }
      <ToggleColorButton
        borderLeftRadius={user? 0:null}
      />
    </Box>
  );
};

export { Navigation };