import { Box, HStack } from "@chakra-ui/react";
import { ReactNode } from "react";
import { SearchProvider } from "../../contexts/SearchProvider";
import { AddInstanceButton } from "../Buttons/AddInstanceButton";
import { InputProps } from "../Inputs";
import { Pagination } from "../Pagination";
import { Search } from "../Search";
import { SectionProps } from "../Section";

interface ClassroomSearchProps extends SectionProps {
  placeholder: string;
  children: ReactNode;
  inputProps?: Omit<InputProps, "iconName">;
  addInstanceUrl?: string;
};

function ClassroomSearch({
  placeholder,
  children,
  inputProps,
  addInstanceUrl,
  ...rest
}: ClassroomSearchProps) {
  return (
    <SearchProvider>
      <Box
        display="flex"
        flexDir={["column", "column", "column", "row"]}
        alignItems="flex-start"
        flexWrap="wrap"
        justifyContent="space-between"
        w="100%"
      >
        <HStack 
          spacing={5}
          mb={5}
        >
          <Search
            placeholder={placeholder}
            {...inputProps}
          />
          { addInstanceUrl && <AddInstanceButton href={addInstanceUrl}/> }
        </HStack>
        <Pagination/>
      </Box>
      {children}
    </SearchProvider>
  );
};

export { ClassroomSearch };

