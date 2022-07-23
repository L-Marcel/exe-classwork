import { Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup, useBreakpointValue } from "@chakra-ui/react";
import { useTable } from "../../contexts/hooks/useTable";
import { boxShadow } from "../../theme/effects/shadow";
import { IconButton } from "../Buttons/IconButton";
import { NamedIcon } from "../NamedIcon";

function TableFilter() {
  const {
    initialColumns,
    filter,
    setFilter
  } = useTable();

  const isWideOrNormalVersion = useBreakpointValue({
    base: false,
    sm: false,
    md: true,
    xl: true,
    lg: true
  });

  function handleOnChangeFilters(filters: string | string[]) {
    if(!Array.isArray(filters)) {
      filters = [filters];
    };

    const _filters: string[] = filters;

    Object.entries(filter).forEach(([key, value]) => {
      if(value !== _filters.some(f => f === key)) {
        setFilter(!value, key);
      };
    });
  };

  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        mb={5}
        pointerEvents="none"
      >
        <IconButton
          data-testid="icon-button"
          label="Filter columns"
          pointerEvents="all"
          size={isWideOrNormalVersion? "md":"sm"}
          icon={<NamedIcon name="tune"/>}
          aria-label="table-filter-button"
          fontSize={18}
        />
      </MenuButton>
      <MenuList 
        zIndex={899} 
        minWidth="240px"
        bgColor="solid.100"
        border="none"
        borderRadius={8}
        { ...boxShadow(false) as any }
        maxH="50vh"
        overflowY="auto"
        overflowX="hidden"
      >
        <MenuOptionGroup 
          type="checkbox"
          value={Object.entries(filter).filter(([, value]) => value).map(([key]) => key)}
          onChange={handleOnChangeFilters}
        >
          {
            initialColumns.filter(c => !c.reference).map(c => {
              return (
                <MenuItemOption
                  _hover={{
                    bgColor: "solid.200"
                  }}
                  _focus={{
                    bgColor: "solid.200"
                  }}
                  _focusVisible={{
                    bgColor: "solid.200"
                  }}
                  key={`menu-filter-${c.value}`}
                  value={c.value}
                >
                  {c.name || c.value}
                </MenuItemOption>
              );
            })
          }
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

export { TableFilter };

