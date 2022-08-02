import { m } from "framer-motion";

interface ButtonStyle {
  color?: string | any;
  theme?: string;
  colorIndexes?: [string, string, string];
  forceHoverEffect?: boolean;
};

function getButtonStyle({
  theme = "solid", 
  color = "black.50", 
  colorIndexes = ["700", "700", "800"],
  forceHoverEffect = false
}: ButtonStyle) {
  if(theme === "solid") {
    colorIndexes = ["100", "200", "250"];
    color = "solid.900";
  };

  if(forceHoverEffect) {
    colorIndexes[0] = colorIndexes[1];
  };
  
  return {
    as: m.button,
    tabIndex: 0,
    bgColor: `${theme}.${colorIndexes[0]}`,
    color,
    _hover: {
      bgColor: `${theme}.${colorIndexes[1]}`
    },
    _active: {
      bgColor: `${theme}.${colorIndexes[2]}`
    },
  };
};

export { getButtonStyle };

