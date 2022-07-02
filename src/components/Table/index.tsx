import { Box, Table as ChakraTable, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { useTable } from "../../contexts/hooks/useTable";
import { Input } from "../Inputs";
import { NamedIcon } from "../NamedIcon";

function Table() {
  const {
    columns,
    rows,
    initialRows,
    setSearch,
    page,
    onChangeColumnOrder
  } = useTable();

  return (
    <TableContainer 
      minW={["100%", "100%", "100%", 400]}
      borderRadius={10}
    >
      <ChakraTable>
        <Thead>
          <Tr 
            bgColor="solid.100"
          >
            {
              columns.map(c => {
                const canOrder = initialRows.length > 0 &&
                  typeof rows[0][c.value] !== "function"
                  && typeof rows[0][c.value] !== "object";

                return (
                  <Th
                    maxW="500px"
                    minW="60px"
                    key={c.value}
                    color="solid.900"
                    borderColor="solid.100"
                    _notLast={{
                      borderRight: "1px solid",
                      borderRightColor: "solid.200"
                    }}
                    onClick={() => canOrder && onChangeColumnOrder(c.value)}
                    cursor={canOrder && "pointer"}
                    _hover={{
                      opacity: .6
                    }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent={!canOrder && "center"}
                    >
                      {c.value}{ c.order !== "none" && <NamedIcon
                        ml={1}
                        name={c.order === "desc"? "down":"up"}
                      /> }
                    </Box>
                  </Th>
                );
              })
            }
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            {
              columns.map(c => {
                const canFilter = initialRows.length > 0 &&
                  typeof rows[0][c.value] !== "function"
                  && typeof rows[0][c.value] !== "object";

                return (
                  <Td
                    p={0}
                    key={`search-${c.value}`}
                    borderColor="solid.100" 
                    borderBottom="5px solid"
                    bgColor="solid.75"
                    maxW="500px"
                    minW="60px"
                    _notLast={{
                      borderRight: "1px solid",
                      borderRightColor: "solid.200"
                    }}
                  >
                    {
                      canFilter? <Input
                        iconName="search"
                        borderRadius="0px"
                        borderLeft="none"
                        inputClassName="border-on-focus"
                        onChange={(e) => setSearch(e.currentTarget.value, c.value)}
                        bgColor="solid.75"
                        maxW="100%"
                        w="min"
                        minW="100%"
                      />:<Text
                        textAlign="center"
                      >
                        -
                      </Text>
                    }
                  </Td>
                );
              })
            }
          </Tr>
          {
            rows.filter((r,i) => (i + 1) <= ((page + 1) * 12) && (i + 1) > (page * 12)).map((r, i) => {
              return (
                <Tr 
                  tabIndex={0}
                  key={r?.id} 
                  className="transparent-border-on-focus"
                  bgColor={(i % 2 === 0)? "solid.75":"solid.100"}
                  _last={{
                    "& td": { borderBottom: "none" },
                    borderBottomRadius: 10
                  }}
                >
                  {
                    columns.map(c => {
                      return (
                        <Td 
                          maxW="500px"
                          minW="60px"
                          whiteSpace="pre-wrap"
                          key={`${r?.id}-${c.value}`}
                          borderColor="solid.100" 
                          _notLast={{
                            borderRight: "1px solid",
                            borderRightColor: "solid.200"
                          }}
                        >
                          {r[c.value] ?? <Text
                            textAlign="center"
                          >
                            -
                          </Text>}
                        </Td>
                      );
                    })
                  }
                </Tr>
              );
            })
          }
        </Tbody>
      </ChakraTable>
    </TableContainer>
  );
};

export { Table };

