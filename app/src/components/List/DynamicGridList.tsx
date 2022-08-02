import { Box, BoxProps, HStack, Stack, useBreakpointValue } from "@chakra-ui/react";
import { m } from "framer-motion";
import { cloneElement } from "react";
import { fadeToTopOnScroll } from "../../theme/animations/motion";

export interface DynamicGridListProps extends BoxProps {
  items?: JSX.Element[];
  colsMaxW?: [string, string?, string?, string?, string?, string?] | string,
  colsSpacing?: number,
  rowsSpacing?: number,
  cols?: {
    base: [string, string?, string?, string?],
    xl: [string, string?, string?, string?],
    lg: [string, string?, string?, string?],
    md: [string, string?, string?, string?],
    sm: [string, string?, string?, string?]
  },
  notFoundElement?: JSX.Element;
  colsItemProps?: {
    [column: string]: any
  }
};

function DynamicGridList({
  items = [],
  cols,
  colsMaxW = ["100%", "100%", "100%", "50%", "25%", "25%"],
  colsSpacing = 7,
  rowsSpacing = 7, 
  notFoundElement,
  colsItemProps,
  ...rest
}: DynamicGridListProps) {
  const stacks = useBreakpointValue(cols ?? {
    base: ["a"],
    xl: ["a", "b", "c", "d"],
    lg: ["a", "b"],
    md: ["a"],
    sm: ["a"]
  }) ?? [];

  if(!items || items?.length <= 0) {
    return notFoundElement ?? null;
  };

  const qtdStacks = stacks.length;

  const rows = [];

  for(let c = 0; c < items.length/qtdStacks; c++) {
    let child = items.slice(c*qtdStacks, qtdStacks + (qtdStacks * c));
    rows.push(child);
  };

  const columns: MatrixOfElements = rows.reduce((pre: MatrixOfElements, cur) => {
    cur.length >= 1 && pre[0].push(cur[0]);
    cur.length >= 2 && pre[1].push(cur[1]);
    cur.length >= 3 && pre[2].push(cur[2]);
    cur.length >= 4 && pre[3].push(cur[3]);
    
    return pre;
  }, [[], [], [], []] as MatrixOfElements);

  return (
    <Box
      as={m.div}
      mt={1}
      position="relative"
      display="flex"
      justifyContent="center"
      alignItems="center"
      mb={[0, 5]}
      maxW="99vw"
      {...fadeToTopOnScroll}
      {...rest}
    >
      <HStack
        alignItems="flex-start"
        justifyContent="flex-start"
        spacing={colsSpacing}
        w="100%"
      >
        {stacks.map((a, i) => {
          if(i >= items.length) {
            return null;
          };

          return (
            <Stack
              key={a}
              w="100%"
              maxW={colsMaxW}
              spacing={rowsSpacing}
              mb={["20px", 0, 0, 0, 0, 0]}
            >
              {columns.length > i && columns[i].map(item => {
                let props;

                if(colsItemProps && colsItemProps[i]) {
                  props = {
                    ...item.props,
                    ...colsItemProps[i]
                  };
                };

                return cloneElement(item, props);
              })}
            </Stack>
          );
        })}
      </HStack>
    </Box>
  );
};

export { DynamicGridList };

