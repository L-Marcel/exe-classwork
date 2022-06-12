import { Text, TextProps } from "@chakra-ui/react";

function RepositoryProfileStatistic({ ...rest }: TextProps) {
  return (
    <Text
      ml="2px"
      fontSize="md" 
      lineHeight="1.2"
      fontWeight="medium"
      { ...rest }
    />
  );
};

export { RepositoryProfileStatistic };
