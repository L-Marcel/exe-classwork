import { StylesConfig } from "react-select";

export function selectStyle(borderRadius = 0) {
  return {
    control: (style) => {
      return {
        ...style,
        width: "100%",
        backgroundColor: "var(--chakra-colors-solid-100)",
        borderTop: "none !important",
        borderLeft: "3px solid var(--chakra-colors-primary-600) !important",
        borderRight: "none !important",
        borderBottom: "none !important",
        alignItems: "flex-start",
        boxShadow: undefined,
        borderRadius,
        cursor: "pointer",
        flexDirection: "row-reverse"
      };
    },
    indicatorsContainer: (style) => {
      return {
        ...style,
        display: "contents",
        color: "var(--chakra-colors-primary-600) !important"
      };
    },
    dropdownIndicator: (style) => {
      return {
        ...style,
        color: "var(--chakra-colors-primary-600) !important"
      };
    },
    indicatorSeparator: (style) => {
      return {
        ...style,
        display: "none"
      };
    },
    container: (style) => {
      return {
        ...style,
        width: "100%",
        borderRadius: 0
      };
    },
    placeholder: (style) => {
      return {
        ...style,
        color: "var(--chakra-colors-solid-400)"
      };
    },
    singleValue: (style) => {
      return {
        ...style,
        color: "var(--chakra-colors-solid-900)",
        caretColor: "transparent"
      };
    },
    valueContainer: (style) => {
      return {
        ...style,
        paddingLeft: 2
      };
    },
    menu: (style) => {
      return {
        ...style,
        padding: 0,
        margin: 0,
        marginTop: "8px !important",
        border: "none !important",
        borderRadius,
        backgroundColor: "var(--chakra-colors-solid-100)",
        boxShadow: undefined
      };
    },
    menuList: (style) => {
      return {
        ...style,
        margin: 0,
        padding: 0,
        borderRadius,
        backgroundColor: "var(--chakra-colors-solid-100)"
      };
    },
    option: (provided, data) => {
      return {
        ...provided,
        color: "var(--chakra-colors-solid-900)",
        backgroundColor: data.isDisabled? "var(--chakra-colors-solid-75)":
        "var(--chakra-colors-solid-100)",
        filter: data.isFocused && "brightness(.9)",
        cursor: "pointer",
        borderLeft: "3px solid var(--chakra-colors-primary-600)",
        padding: data.isDisabled? 5:10,
        paddingLeft: data.isDisabled? 10:15,
        paddingRight: 10,
        ":active": null
      };
    },
    loadingIndicator: (style) => {
      return {
        ...style,
        height: "min",
        alignSelf: "flex-start",
        marginTop: 8,
        color: "var(--chakra-colors-primary-600) !important"
      };
    },
    clearIndicator: (style) => {
      return {
        ...style,
        height: "min",
        alignSelf: "flex-start",
        paddingLeft: 0,
        cursor: "pointer",
        color: "var(--chakra-colors-primary-600) !important"
      };
    },
    input: (style) => {
      return {
        ...style,
        color: "var(--chakra-colors-solid-900)",
      };
    }
  } as StylesConfig;
};