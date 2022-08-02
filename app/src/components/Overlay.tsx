import { Box } from "@chakra-ui/react";

function Overlay() {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      h="100vh"
      zIndex={900}
      bgColor="alpha.alt.900"
    />
  );
};

export { Overlay };

