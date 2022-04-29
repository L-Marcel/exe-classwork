import { Box, Stack, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import { SearchProvider } from "../../contexts/SearchProvider";
import { InputProps } from "../Inputs";
import { Search } from "../Search";
import { Section, SectionProps } from "../Section";
import { Title } from "../Title";

interface ClassroomSearchProps extends SectionProps {
  title: string;
  subtitle: string;
  placeholder: string;
  children: ReactNode;
  inputProps?: Omit<InputProps, "iconName">;
};

function ClassroomSearch({
  title,
  subtitle,
  placeholder,
  children,
  inputProps,
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
          <Search
            placeholder={placeholder}
            {...inputProps}
          />
          {children}
        </SearchProvider>
      </Stack>
    </Section>
  );
};

export { ClassroomSearch };

