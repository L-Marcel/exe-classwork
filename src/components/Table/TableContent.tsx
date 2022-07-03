import { Box, Table as ChakraTable, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { useTable } from "../../contexts/hooks/useTable";
import { getPercent } from "../../utils/getPercent";
import { Input } from "../Inputs";
import { NamedIcon } from "../NamedIcon";

const headerOrderIcon = {
  "desc": "down",
  "asc": "up",
  "percent-desc": "down",
  "percent-asc": "up"
};

function TableContent() {
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
              columns.length > 0 && columns.map(c => {
                const canOrder = initialRows.length > 0 &&
                  typeof initialRows[0][c.value] !== "function"
                  && typeof initialRows[0][c.value] !== "object";

                return (
                  <Th
                    maxW="500px"
                    minW="60px"
                    key={c.value}
                    color="solid.900"
                    borderColor="solid.100"
                    justifyContent=""
                    _notLast={{
                      borderRight: "1px solid",
                      borderRightColor: "solid.200"
                    }}
                    onClick={() => canOrder && onChangeColumnOrder(c.value)}
                    cursor={canOrder && "pointer"}
                    _hover={{
                      opacity: .6
                    }}
                    {...c.thProps}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent={!canOrder && "center"}
                    >
                      {c.name || c.value}{ c.order !== "none" && <NamedIcon
                        ml={1}
                        name={headerOrderIcon[c.order]}
                      />}{(c.order === "percent-asc" || c.order === "percent-desc")? " %":""}
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
              columns.length > 0 && columns.map(c => {
                const canFilter = initialRows.length > 0 &&
                  typeof initialRows[0][c.value] !== "function"
                  && typeof initialRows[0][c.value] !== "object";

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
                        iconName={c.icon || "search"}
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
            rows.length > 0 && rows
              .sort((a, b) => b["_isResult"] - a["_isResult"])
              .filter((r,i) => (i + 1) <= ((page + 1) * 12) && (i + 1) > (page * 12))
              .map((r, i) => {
              return (
                <Tr 
                  tabIndex={0}
                  key={r?.id} 
                  className="transparent-border-on-focus"
                  bgColor={(i % 2 === 0)? "solid.75":"solid.100"}
                  opacity={r?._isResult === false? .2:1}
                  filter={r?._isResult === false? "blur(1px)":undefined}
                  _last={{
                    "& td": { borderBottom: "none" },
                    borderBottomRadius: 10
                  }}
                >
                  {
                    columns.length > 0 && columns.map(c => {
                      const value = r[c.value];
                      const percentOfData = r[c.percentOfData];
                      const allIsNumber = 
                        typeof value === "number" && 
                        typeof percentOfData === "number";

                      return (
                        <Td 
                          maxW="500px"
                          minW="60px"
                          key={`${r?.id}-${c.value}`}
                          borderColor="solid.100" 
                          _notLast={{
                            borderRight: "1px solid",
                            borderRightColor: "solid.200"
                          }}
                          {...c.tdProps}
                        >
                          {value? <>
                            {!c.showOnlyPercent && value}{ (percentOfData && allIsNumber) && 
                              `${!c.showOnlyPercent? ` (`:""}${getPercent(value, percentOfData)}%${!c.showOnlyPercent? `)`:""}`
                            }
                          </>:<Text
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

export { TableContent };

