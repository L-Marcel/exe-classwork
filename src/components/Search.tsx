import { useSearch } from "../contexts/hooks/useSearch";
import { Input } from "./Inputs";

function Search() {
  const { setSaerch } = useSearch();

  return (
    <Input
      placeholder="Search by title or subject..."
      iconName="search"
      w={[250, 300]}
      onChange={(e) => {
        setSaerch(e.target.value);
      }}
    />
  );
};

export { Search };

