import { extendTheme } from "@chakra-ui/react";
import { mode, StyleFunctionProps } from "@chakra-ui/theme-tools";
import { Dict } from "@chakra-ui/utils";
import colorsConfig from "./colors.json";

const { semanticTokens, colors } = colorsConfig;

export const theme = extendTheme({
  initialColorMode: 'dark',
  useSystemColorMode: false,
  semanticTokens,
  colors,
  fonts: {
    heading: "'Manrope', sans-serif",
    body: "'Manrope', sans-serif",
  },
  styles: {
    global: (props) => {
      function getColorMode(color: string) {
        return (props: Dict<any> | StyleFunctionProps) => mode(
          semanticTokens.colors[color].default, 
          semanticTokens.colors[color]._dark
        )(props);
      };

      return {
        "*": {
          userSelect: "none",
          transition: "filter .2s linear !important, color .2s linear !important, background-color .5s linear !important",
          WebkitTapHighlightColor: "transparent"
        },
        "::-webkit-scrollbar": {
          w: 2,
          mr: -2
        },
        "::-webkit-scrollbar-track": {
          h: 5,
          background: getColorMode("solid.100")(props)
        },
        "::-webkit-scrollbar-thumb": {
          background: "primary.800"
        },
        "::-webkit-scrollbar-thumb:hover": {
          background: "primary.900"
        },
        "textarea::-webkit-scrollbar": {
          w: "10px",
          mr: -2
        },
        "textarea::-webkit-scrollbar-track": {
          h: 5,
          background: getColorMode("solid.200")(props),
        },
        "textarea::-webkit-scrollbar-thumb": {
          background: "primary.500"
        },
        "textarea::-webkit-scrollbar-thumb:hover": {
          background: "primary.600"
        },
        "::-webkit-resizer": {
          backgroundColor: getColorMode("solid.300")(props),
        },
        html: {
          height: "-webkit-fill-available",
          overscrollBehaviorY: "contain"
        },
        body: {
          bg: getColorMode("solid.50")(props),
          w: "100vw",
          h: "100vh",
          minHeight: "100vh",
          minH: "-webkit-fill-available",
          overscrollBehaviorY: "contain",
          overflowY: "hidden",
          overflowX: "hidden",
          isRandom: true
        },
        'div[role="progressbar"]': {
          bgGradient: "linear(to-r, transparent, primary.700)",
        },
        '.chakra-switch__track[data-checked]': {
          bgColor: "var(--chakra-colors-primary-600) !important"
        },
        "a:hover": {
          textDecoration: "none!important",
        },
        "button:hover": {
          filter: "brightness(0.95)"
        },
        "button:focus-visible, input:focus-visible, select:focus-visible, section:focus-visible, .focus-visible:focus-visible": {
          outline: "2px solid var(--chakra-colors-primary-600)"
        },
        ".js-focus-visible :focus:not(.focus-visible)": { 
          outline: "none"
        },
        ".chakra-avatar__svg": {
          color: "var(--chakra-colors-solid-450)!important",
          "& path:last-of-type": {
            color: "var(--chakra-colors-solid-400)!important",
          }
        }
      }
    }
  }
});