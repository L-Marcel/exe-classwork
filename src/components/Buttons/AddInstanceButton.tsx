import { Link } from "../Link";
import { NamedIcon } from "../NamedIcon";
import { IconButton, IconButtonProps } from "./IconButton";

interface AddInstanceButtonProps extends IconButtonProps {
  href?: string;
};

function AddInstanceButton({ href, ...rest }: Partial<AddInstanceButtonProps>) {
  if(!href) {
    return (
      <IconButton
        data-testid="add-instance-button"
        aria-label="addInstanceButton"
        theme="primary"
        icon={<NamedIcon name="add"/>}
        {...rest}
      />
    );
  };

  return (
    <Link href={href}>
      <IconButton
        data-testid="add-instance-button"
        aria-label="addInstanceButton"
        theme="primary"
        icon={<NamedIcon name="add"/>}
        {...rest}
      />
    </Link>
  );
};

export { AddInstanceButton };

