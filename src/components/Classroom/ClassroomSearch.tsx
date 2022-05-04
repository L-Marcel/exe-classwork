import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import { SearchProvider } from "../../contexts/SearchProvider";
import { AddInstanceButton } from "../Buttons/AddInstanceButton";
import { InputProps } from "../Inputs";
import { Pagination } from "../Pagination";
import { Search } from "../Search";
import { Section, SectionProps } from "../Section";
import { Title } from "../Title";

interface ClassroomSearchProps extends SectionProps {
  title: string;
  subtitle: string;
  placeholder: string;
  children: ReactNode;
  inputProps?: Omit<InputProps, "iconName">;
  addInstanceUrl?: string;
};

function ClassroomSearch({
  title,
  subtitle,
  placeholder,
  children,
  inputProps,
  addInstanceUrl,
  ...rest
}: ClassroomSearchProps) {
  return (
    <Section
      w="100%"
      {...rest}
    >
      <Stack
        spacing={3}
        display="flex"
        w="100%"
      >
        <Box>
          <Title
            fontSize="1.8rem"
            fontWeight="bold"
          >
            {title}
          </Title>
          <Text
            fontSize="1.2rem"
          >
            {subtitle}
          </Text>
        </Box>
        <SearchProvider>
          <Box
            display="flex"
            flexDir={["column", "column", "column", "row"]}
            alignItems={["center", "flex-start"]}
            flexWrap="wrap"
            mt={5}
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
      </Stack>
    </Section>
  );
};

export { ClassroomSearch };

