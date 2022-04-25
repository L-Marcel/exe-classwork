import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { m } from "framer-motion";
import { useState } from "react";
import { useSearch } from "../contexts/hooks/useSearch";
import { NamedIcon } from "./NamedIcon";

function Search() {
  const { setSaerch } = useSearch();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <InputGroup
      w={300}
      maxW="80vw"
      alignSelf={["center", "center", "flex-start"]}
      onFocus={() => {
        setIsFocused(true);
      }}
      onBlur={() => {
        setIsFocused(false);
      }}
    >
      <InputLeftElement
        as={m.div}
        pointerEvents="none"
        borderRadius={8}
        children={<NamedIcon name="search"/>}
        bgColor={isFocused && "alpha.50"}
        color={isFocused && "primary.500"}
      />
      <Input
        w={300}
        maxW="80vw"
        as={m.input}
        bgColor="solid.100"
        border="none"
        borderLeft={`2px solid var(--chakra-colors-primary-500)!important`}
        borderRadius={8}
        _placeholder={{
          color: "alt.400"
        }}
        placeholder="Search by title or subject..."
        animate={isFocused? "focused":"initial"}
        onChange={(e) => {
          setSaerch(e.target.value);
        }}
        variants={{
          initial: {
            paddingLeft: 35
          },
          focused: {
            paddingLeft: 50,
            transition: {
              durantion: 1
            }
          }
        }}
        _focus={{
          bgColor: "search.100"
        }}
      />
    </InputGroup>
  );
};

export { Search };

