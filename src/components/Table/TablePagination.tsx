import { HStack, StackProps } from "@chakra-ui/react";
import { m } from "framer-motion";
import { useTable } from "../../contexts/hooks/useTable";
import { scaleIn } from "../../theme/animations/motion";
import { IconButton } from "../Buttons/IconButton";
import { NumberInput } from "../Inputs/NumberInput";
import { NamedIcon } from "../NamedIcon";
import { TooltipOnHover } from "../TooltipOnHover";

interface TablePaginationProps extends StackProps {};

function TablePagination({ ...rest }: TablePaginationProps) {
  const { count, page, setPage } = useTable();

  const max = Math.ceil(count/12);
  const min = 1;

  return (
    <HStack
      spacing={2}
      display="inline-flex"
      w="min-content"
      mb={5}
      {...rest}
    >
      { page > min && <TooltipOnHover
        label="First page"
      >
        <IconButton
          as={m.button}
          aria-label="double-prev-page"
          icon={<NamedIcon name="double-prev"/>}
          theme="primary"
          onClick={() => setPage(min - 1)}
          {...scaleIn}
        />
      </TooltipOnHover> }
      { page > (min - 1) && <TooltipOnHover
        label="Previous page"
      >
        <IconButton
          as={m.button}
          aria-label="prev-page"
          icon={<NamedIcon name="prev"/>}
          theme="primary"
          onClick={() => setPage(page - 1)}
          {...scaleIn}
        />
      </TooltipOnHover> }
      <NumberInput
        allowMouseWheel
        display="inline-flex"
        iconName="number"
        minW="65px"
        w="min"
        max={max}
        min={min}
        value={page + 1}
        onChange={(value) => {
          let page = Number(value);
          setPage(page - 1);
        }}
      />
      { page < (max - 1) && <TooltipOnHover
        label="Next page"
      >
        <IconButton
          as={m.button}
          aria-label="next-page"
          icon={<NamedIcon name="next"/>}
          theme="primary"
          onClick={() => setPage(page + 1)}
          {...scaleIn}
        />
      </TooltipOnHover> }
      { page < (max - 2) && <TooltipOnHover
        label="Last page"
      >
        <IconButton
          as={m.button}
          aria-label="double-next-page"
          icon={<NamedIcon name="double-next"/>}
          theme="primary"
          onClick={() => setPage(max - 1)}
          {...scaleIn}
        />
      </TooltipOnHover> }
    </HStack>
  );
};

export { TablePagination };

