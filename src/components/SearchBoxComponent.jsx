import { useEffect, useState } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Close from "@mui/icons-material/Close";
import { useSearchParams } from "react-router-dom";

const SearchBoxComponent = ({ placeholder = "Search..." }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(searchParams.get("query") || "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams); // clone existing

      if (inputValue.trim() !== "") {
        newParams.set("query", inputValue.trim());
      } else {
        newParams.delete("query");
      }

      newParams.delete("page"); // optional: reset pagination
      setSearchParams(newParams, { replace: true });
    }, 400);

    return () => clearTimeout(timeout);
  }, [inputValue, searchParams, setSearchParams]);

  const handleClear = () => {
    const newParams = new URLSearchParams(searchParams); // clone existing
    newParams.delete("query");
    newParams.delete("page");
    setInputValue("");
    setSearchParams(newParams, { replace: true });
  };

  return (
    <TextField
      size="small"
      variant="outlined"
      placeholder={placeholder}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        ),
        endAdornment: inputValue.trim() !== "" && (
          <InputAdornment position="end">
            <IconButton onClick={handleClear} size="small">
              <Close fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{ minWidth: 250 }}
    />
  );
};

export default SearchBoxComponent;
