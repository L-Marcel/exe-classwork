import { useSearch } from "../contexts/hooks/useSearch";
import { Input, InputProps } from "./Inputs";

interface SearchProps extends Omit<InputProps, "iconName"> {
  placeholder: string;
};

function Search({ placeholder, ...rest }: SearchProps) {
  const { setSearch } = useSearch();

  return (
    <Input
      placeholder={placeholder}
      iconName="search"
      w={[250, 300]}
      onChange={(e) => {
        setSearch(e.target.value);
      }}
      {...rest}
    />
  );
};

export { Search };

