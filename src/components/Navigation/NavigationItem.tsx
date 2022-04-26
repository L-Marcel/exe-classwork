import { Box, ButtonProps, Text } from "@chakra-ui/react";
import { m } from "framer-motion";
import { IconButton } from "../Buttons/IconButton";
import { Link } from "../Link";
import { NamedIcon } from "../NamedIcon";
interface NavigationItemProps extends ButtonProps {
  path: string;
  name: string;
  isSelected: boolean;
  forceExpanded?: boolean;
};

function NavigationItem({ path, isSelected, forceExpanded = false, name, ...rest }: NavigationItemProps) {
  return (
    <Box
      as={m.div}
      display="flex"
      alignItems="center"
      position="relative"
      initial="hidden"
      w="100%"
      animate={forceExpanded? "expanded":undefined}
      whileHover="expanded"
      whileFocus="expanded"
    >
      <Link
        data-testid="navigation-item"
        href={path}
      >
        <IconButton
          aria-label={`${path}-navigation`}
          icon={<NamedIcon name={name}/>}
          forceHoverEffect={forceExpanded}
          theme={isSelected? "primary":"solid"}
          color={isSelected && "black.100"}
          zIndex={10}
          {...rest}
        />
      </Link>
      <Text
        as={m.p}
        position="absolute"
        bgColor="solid.300"
        left={10}
        px={2}
        borderRightRadius={8}
        pointerEvents="none"
        variants={{
          hidden: {
            opacity: 0,
            x: -3
          }, 
          expanded: {
            opacity: 1,
            x: -1,
            transition: {
              duration: .3
            }
          }
        }}
      >
        {name.toLowerCase()}
      </Text>
    </Box>
  );
};

export { NavigationItem };

