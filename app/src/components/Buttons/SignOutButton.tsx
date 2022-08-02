import { useUser } from "../../contexts/hooks/useUser";
import { NamedIcon } from "../NamedIcon";
import { IconButton, IconButtonProps } from "./IconButton";

interface SignOutButtonProps extends IconButtonProps {};

function SignOutButton({ ...rest }: Partial<SignOutButtonProps>) {
  const { signOut } = useUser();

  return (
    <IconButton
      data-testid="toggle-button"
      aria-label="signOutButton"
      icon={<NamedIcon name="exit"/>}
      onClick={() => signOut()}
      {...rest}
    />
  );
};

export { SignOutButton };

