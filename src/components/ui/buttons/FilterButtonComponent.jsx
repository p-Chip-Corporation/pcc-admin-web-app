import { FilterList } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useSearchParams } from "react-router-dom";

const FilterButton = ({ onClick }) => {
  const [searchParams] = useSearchParams();

  const ignoredKeys = new Set(["orderBy", "order", "query"]);
  const hasFilters = Array.from(searchParams.keys()).some(
    (key) => !ignoredKeys.has(key)
  );

  return (
    <Button
      variant={hasFilters ? "contained" : "outlined"}
      size="small"
      onClick={onClick}
      sx={{
        minWidth: 0,
        aspectRatio: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <FilterList fontSize="small" />
    </Button>
  );
};

export default FilterButton;

