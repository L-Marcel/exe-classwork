import { BoxProps } from "@chakra-ui/react";
import { boxShadow } from "./shadow";

interface BgOptions extends BoxProps { 
  hoverEffect?: boolean;
  cursorPointer?: boolean;
  stickyMode?: boolean;
};

function bg({ 
  bg = "white", 
  opacity = 0.6, 
  hoverEffect = false, 
  cursorPointer = false, 
  borderRadius = 15,
  stickyMode = false,
  ...rest
}: BgOptions) {
  return {
    position: "relative",
    bg: "transparent",
    _before: {
      content: `""`,
      position: "absolute",
      top: 0,
      left: 0,
      w: "100%",
      h: "100%",
      zIndex: -5,
      opacity: stickyMode? 1:opacity,
      bg: stickyMode? "whitesmoke":bg,
      borderRadius,
      ...rest,
      ...boxShadow(),
    },
    _hover: hoverEffect && {
      filter: "brightness(0.92)",
      cursor: cursorPointer? "pointer":null
    },
  };
};

export { bg };