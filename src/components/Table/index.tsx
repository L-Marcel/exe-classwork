import { Box, Table as ChakraTable, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useTable } from "../../contexts/hooks/useTable";
import { Input } from "../Inputs";
import { NamedIcon } from "../NamedIcon";

function Table() {
  const {
    columns,
    rows,
    setSearch
  } = useTable();

  function handleOnChangeColumnSearch(search: string, column: string) {
    setSearch(search, column);
  };

  return (
    <TableContainer borderRadius={10}>
      <ChakraTable>
        <Thead>
          <Tr bgColor="solid.100">
            {
              columns.map(c => {
                return (
                  <Th
                    key={c}
                    color="solid.900"
                    borderColor="solid.100" 
                    _notLast={{
                      borderRight: "1px solid",
                      borderRightColor: "solid.200"
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      {c}<NamedIcon
                        ml={1}
                        name="down"
                      />
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
                return (
                  <Td
                    p={0}
                    key={`search-${c}`}
                    borderColor="solid.100" 
                    borderBottom="5px solid"
                    _notLast={{
                      borderRight: "1px solid",
                      borderRightColor: "solid.200"
                    }}
                  >
                    <Input
                      iconName="search"
                      borderRadius="0px"
                      borderLeft="none"
                      inputClassName="border-on-focus"
                      onChange={(e) => handleOnChangeColumnSearch(e.currentTarget.value, c)}
                      bgColor="solid.75"
                      maxW="auto"
                      w={null}
                      minW="100px"
                    />
                  </Td>
                );
              })
            }
          </Tr>
          {
            rows.map((r, i) => {
              return (
                <Tr 
                  key={r.id} 
                  bgColor={(i % 2 === 0)? "solid.75":"solid.50"}
                >
                  {
                    columns.map(c => {
                      return (
                        <Td 
                          key={`${r.id}-${c}`}
                          borderColor="solid.100" 
                          _notLast={{
                            borderRight: "1px solid",
                            borderRightColor: "solid.200"
                          }}
                        >
                          {r[c]}
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

