import { HStack, StackProps } from "@chakra-ui/react";
import { Navigation } from "./Navigation";
import { Profile } from "./Profile";

interface HeaderProps extends StackProps {};

function Header({ ...rest }: HeaderProps) {
  return (
    <HStack
      data-testid="header"
      justifyContent="space-between"
      spacing={[2, 4]}
      w="100%"
      {...rest}
    >
      <Profile/>
      <Navigation/>
    </HStack>
  );
};

export { Header };
