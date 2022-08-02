function boxShadow(withHoverEffect = false) {
  return withHoverEffect? {
    filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)) !important",
    _hover: {
      filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)) brightness(0.9) !important",
    }
  }:{
    filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)) !important",
  };
};

export { boxShadow };