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
          background: "solid.200"
        },
        "textarea::-webkit-scrollbar-thumb": {
          background: "primary.500"
        },
        "textarea::-webkit-scrollbar-thumb:hover": {
          background: "primary.600"
        },
        "::-webkit-resizer": {
          backgroundColor: "var(--chakra-colors-solid-300)"
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
        "a:hover": {
          textDecoration: "none!important",
        },
        "button:hover": {
          filter: "brightness(0.95)"
        },
        ".js-focus-visible :focus:not([data-focus-visible-added])": { 
          outline: "none",
          boxShadow: "none" 
        },
        /*".chakra-checkbox__control:not([data-checked])": {
          color: "var(--primary) !important",
          bgColor: "primary.100"
        },*/
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