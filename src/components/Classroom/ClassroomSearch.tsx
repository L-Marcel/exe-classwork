import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, HStack, Stack, Text } from "@chakra-ui/react";
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
      p="0px!important"
    >
      <Accordion
        allowMultiple
        allowToggle
        defaultIndex={[0]}
        w="100%"
        left={0}
        top={0}
      >
        <Stack
          as={AccordionItem}
          spacing={3}
          display="flex"
          w="100%"
        >
          <AccordionButton
            justifyContent="space-between"
            top={0}
            left={0}
            px={[10, 14, 28, 28, 28, 28]}
            py={10}
            pl={[10, 14, 28]}
            pr={[10, 14, 28]}
            backdropFilter="brightness(.95)"
            _hover={{
              backdropFilter: "brightness(.94)"
            }}
          >
            <Box
              display="flex"
              flexDir="column"
              alignItems="flex-start"
            >
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
            <AccordionIcon
              fontSize="2rem"
            />
          </AccordionButton>
          <AccordionPanel
            mt={0}
            px={[10, 14, 28, 28, 28, 28]}
            pb={10}
            pt="0px!important"
            pl={[10, 14, 28]}
            pr={[10, 14, 28]}
          >
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
          </AccordionPanel>
        </Stack>
      </Accordion>
    </Section>
  );
};

export { ClassroomSearch };

