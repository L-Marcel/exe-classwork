import { Link } from "../Link";
import { NamedIcon } from "../NamedIcon";
import { TooltipOnHover } from "../TooltipOnHover";
import { IconButton, IconButtonProps } from "./IconButton";

interface AddInstanceButtonProps extends IconButtonProps {
  href?: string;
};

function AddInstanceButton({ href, ...rest }: Partial<AddInstanceButtonProps>) {
  if(!href) {
    return (
      <TooltipOnHover
        label="Add"
      >
        <IconButton
          data-testid="add-instance-button"
          aria-label="addInstanceButton"
          theme="primary"
          icon={<NamedIcon name="add"/>}
          {...rest}
        />
      </TooltipOnHover>
    );
  };

  return (
    <Link href={href}>
      <TooltipOnHover
        label="Add"
      >
        <IconButton
          data-testid="add-instance-button"
          aria-label="addInstanceButton"
          theme="primary"
          icon={<NamedIcon name="add"/>}
          {...rest}
        />
      </TooltipOnHover>
    </Link>
  );
};

export { AddInstanceButton };

