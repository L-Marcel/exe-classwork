import { m} from "framer-motion";
import { scaleOnInteract } from "../../../theme/animations/motion";

interface ButtonStyle {
  color?: string | any;
  theme?: string;
  colorIndexes?: [string, string, string];
  forceHoverEffect?: boolean;
};

function getButtonStyle({
  theme = "solid", 
  color = "black.50", 
  colorIndexes = ["500", "600", "600"],
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
    ...scaleOnInteract,
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