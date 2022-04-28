import { DynamicGridList } from "../DynamicGridList";

interface ClassroomSectionsProps {
  sections?: JSX.Element[];
};

function ClassroomSections({
  sections
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
      items={sections}
    />
  );
};

export { ClassroomSections };

