import { Box, ButtonProps, Text } from "@chakra-ui/react";
import { m } from "framer-motion";
import { ReactNode } from "react";
import { boxShadow } from "../../theme/effects/shadow";
import { IconButton } from "../Buttons/IconButton";
import { Link } from "../Link";
import { NamedIcon } from "../NamedIcon";
interface NavigationItemProps extends ButtonProps {
  path: string;
  name: string;
  prefix?: string;
  isSelected: boolean;
  forceExpanded?: boolean;
  expandedAnimation: string;
  isWideOrNormalVersion?: boolean;
  needPayAttention?: boolean;
  button?: ReactNode;
};

function NavigationItem({ 
  path, 
  isSelected, 
  forceExpanded = false, 
  name,
  prefix,
  expandedAnimation,
  isWideOrNormalVersion = true,
  needPayAttention = false,
  button,
  ...rest 
}: NavigationItemProps) {
  return (
    <Box
      as={m.div}
      display="flex"
      alignItems="center"
      position="relative"
      initial={isWideOrNormalVersion? 
        "hidden":"smHidden"
      }
      w="100%"
      animate={forceExpanded? expandedAnimation:undefined}
      whileHover={expandedAnimation}
      whileFocus={expandedAnimation}
      _last={{
        mt: !isWideOrNormalVersion? 6:2
      }}
      { ...boxShadow() }
    >
      { button ?? <Link
        data-testid="navigation-item"
        href={path}
      >
        <IconButton
          aria-label={`${path}-navigation`}
          icon={<NamedIcon name={name}/>}
          forceHoverEffect={forceExpanded}
          theme={isSelected? "primary":needPayAttention? "orange":"solid"}
          colorIndexes={(needPayAttention && !isSelected)? ["400", "400", "400"]:undefined}
          color={isSelected && "black.100"}
          zIndex={10}
          {...rest}
        />
      </Link> }
      <Text
        as={m.p}
        position="absolute"
        bgColor="solid.300"
        left={isWideOrNormalVersion? 10:null}
        right={isWideOrNormalVersion? null:10}
        px={2}
        borderRightRadius={isWideOrNormalVersion? 8:0}
        borderLeftRadius={isWideOrNormalVersion? 0:8}
        pointerEvents="none"
        whiteSpace="nowrap"
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
          },
          smHidden: {
            opacity: 0,
            x: 10
          },
          smExpanded: {
            opacity: 1,
            x: 8,
            transition: {
              duration: .3
            }
          }
        }}
      >
        {prefix?.toLowerCase()}{name.toLowerCase()}
      </Text>
    </Box>
  );
};

export { NavigationItem };

