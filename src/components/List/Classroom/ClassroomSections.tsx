import { Text } from "@chakra-ui/react";
import { Section } from "../../Section";
import { Title } from "../../Title";
import { DynamicGridList } from "../DynamicGridList";

interface ClassroomSectionsProps {
  classroom: Classroom;
};

function ClassroomSections({
  classroom
}: ClassroomSectionsProps) {

  return (
    <DynamicGridList
      w="100%"
      my={[0, 0]}
      maxW="100vw"
      colsSpacing={0}
      rowsSpacing={0}
      colsMaxW={[
        "100%", 
        "100%", 
        "100%",
        "50%"
      ]}
      cols={{
        base: ["a"],
        xl: ["a", "b"],
        lg: ["a", "b"],
        md: ["a"],
        sm: ["a"]
      }}
      colsItemProps={{
       1: {
         pl: [10, 14, 28, 8]
       },
       0: {
         pr: [10, 14, 28, 8]
       }
      }}
      items={[
        <Section>
          <Title>
            {classroom.title}
          </Title>
          <Text>
            Created by: {classroom.users[0].user.username}
          </Text>
        </Section>,
        <></>,
        <Section forceWidth>
          <Text textAlign="center">This page will still undergo many changes.</Text>
        </Section>
      ]}
    />
  );
};

export { ClassroomSections };

