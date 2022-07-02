import { IconButton, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup, useBreakpointValue } from "@chakra-ui/react";
import { useTable } from "../../contexts/hooks/useTable";
import { boxShadow } from "../../theme/effects/shadow";
import { getButtonStyle } from "../Buttons/styles/getButtonStyle";
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

    console.log(filters);

    Object.entries(filter).forEach(([key, value]) => {
      if(value !== _filters.some(f => f === key)) {
        setFilter(!value, key);
      };
    });
  };

  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        { ...getButtonStyle({ theme: "solid" }) }
        as={IconButton}
        data-testid="icon-button"
        size={isWideOrNormalVersion? "md":"sm"}
        icon={<NamedIcon name="tune"/>}
        aria-label="table-filter-button"
        fontSize={18}
      />
      <MenuList 
        zIndex={899} 
        minWidth="240px"
        bgColor="solid.100"
        border="none"
        borderRadius={8}
        { ...boxShadow(false) as any }
      >
        <MenuOptionGroup 
          type="checkbox"
          value={Object.entries(filter).filter(([, value]) => value).map(([key]) => key)}
          onChange={handleOnChangeFilters}
        >
          {
            initialColumns.map(c => {
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
                  {c.value}
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

