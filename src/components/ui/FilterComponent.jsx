import { useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";

const FilterComponent = ({ users = [], onApply }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    createdBy: searchParams.get("createdBy") || "",
    createdAt_gte: searchParams.get("createdAt_gte") || "",
    createdAt_lte: searchParams.get("createdAt_lte") || "",
    isActive: searchParams.get("isActive") || "",
  });

  const handleFieldChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    const filterKeys = [
      "createdBy",
      "createdAt_gte",
      "createdAt_lte",
      "isActive",
    ];

    filterKeys.forEach((key) => {
      const value = filters[key];
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    newParams.delete("page"); // Reset pagination
    setSearchParams(newParams, { replace: true });
    onApply();
  };

  const clearFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    const filterKeys = [
      "createdBy",
      "createdAt_gte",
      "createdAt_lte",
      "isActive",
    ];

    filterKeys.forEach((key) => {
      newParams.delete(key);
    });

    newParams.delete("page");
    setFilters({
      createdBy: "",
      createdAt_gte: "",
      createdAt_lte: "",
      isActive: "",
    });
    setSearchParams(newParams, { replace: true });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <FormControl size="small">
        <Select
          value={filters.createdBy}
          onChange={(e) => handleFieldChange("createdBy", e.target.value)}
          displayEmpty
        >
          <MenuItem value="">All Creators</MenuItem>
          {users.map((u) => (
            <MenuItem key={u.id} value={u.id}>
              {u.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        size="small"
        type="date"
        label="Created After"
        InputLabelProps={{ shrink: true }}
        value={filters.createdAt_gte}
        onChange={(e) => handleFieldChange("createdAt_gte", e.target.value)}
      />

      <TextField
        size="small"
        type="date"
        label="Created Before"
        InputLabelProps={{ shrink: true }}
        value={filters.createdAt_lte}
        onChange={(e) => handleFieldChange("createdAt_lte", e.target.value)}
      />

      <FormControl size="small">
        <Select
          value={filters.isActive}
          onChange={(e) => handleFieldChange("isActive", e.target.value)}
          displayEmpty
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="true">Active</MenuItem>
          <MenuItem value="false">Inactive</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="contained" size="small" onClick={applyFilters}>
          Apply
        </Button>
        <Button variant="outlined" size="small" onClick={clearFilters}>
          Clear
        </Button>
      </Box>
    </Box>
  );
};

export default FilterComponent;
