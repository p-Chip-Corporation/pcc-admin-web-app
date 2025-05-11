import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Divider,
  Checkbox,
} from "@mui/material";
import { useSearchParams } from "react-router";

export default function DynamicTable({
  columns,
  data,
  meta,
  rowKey = "id",
  onRowClick,
  selected = [],
  onSelectChange = () => {},
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchParams, setSearchParams] = useSearchParams();
  const orderBy = searchParams.get("orderBy") || "createdAt";
  const order = searchParams.get("order") || "asc";
  const rowsPerPageOptions = [25, 50, 100];

  const handleSort = (field, direction) => {
    if (field === "createdAt" && direction === "asc") {
      // Reset to default → remove params
      searchParams.delete("orderBy");
      searchParams.delete("order");
    } else {
      searchParams.set("orderBy", field);
      searchParams.set("order", direction);
    }
    setSearchParams(searchParams);
  };

  const handlePageChange = (newPage) => {
    const newPageNum = newPage + 1;
    if (newPageNum === 1) {
      searchParams.delete("page");
    } else {
      searchParams.set("page", newPageNum.toString());
    }
    setSearchParams(searchParams, { replace: true });
  };

  const handleRowsPerPageChange = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    if (newLimit === 25) {
      searchParams.delete("limit");
    } else {
      searchParams.set("limit", newLimit.toString());
    }
    // Reset page to 1 when changing limit
    searchParams.delete("page");
    setSearchParams(searchParams, { replace: true });
  };

  return (
    <Box
      elevation={3}
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <Box sx={{ flex: 1, overflow: "auto", p: isMobile ? 2 : 0 }}>
        {isMobile ? (
          data.map((row, i) => (
            <Box
              key={row[rowKey] || i}
              sx={{
                mb: 2,
                p: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                backgroundColor: "background.paper",
                boxShadow: 1,
              }}
            >
              {columns.map((col) => (
                <Box key={col.id} sx={{ mb: 1 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 500, textTransform: "uppercase" }}
                  >
                    {col.label}
                  </Typography>
                  <Typography variant="body2">
                    {(() => {
                      const value = row[col.id];
                      switch (col.type) {
                        case "boolean":
                          return value ? "Yes" : "No";
                        case "date":
                          return value
                            ? new Date(value).toLocaleDateString()
                            : "";
                        case "string":
                        default:
                          return typeof value === "string" ||
                            typeof value === "number"
                            ? value
                            : "";
                      }
                    })()}
                  </Typography>
                  <Divider sx={{ mt: 1 }} />
                </Box>
              ))}
            </Box>
          ))
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selected.length > 0 && selected.length < data.length
                      }
                      checked={
                        data.length > 0 && selected.length === data.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          onSelectChange(data.map((row) => row[rowKey]));
                        } else {
                          onSelectChange([]);
                        }
                      }}
                      inputProps={{ "aria-label": "select all rows" }}
                    />
                  </TableCell>
                  {columns.map((col) => (
                    <TableCell
                      key={col.id}
                      sx={{
                        whiteSpace: col.grow ? "normal" : "nowrap",
                        width: col.grow ? "auto" : "1%",
                      }}
                      sortDirection={orderBy === col.id ? order : false}
                    >
                      <TableSortLabel
                        active={orderBy === col.id}
                        direction={orderBy === col.id ? order : "asc"}
                        onClick={() =>
                          handleSort(
                            col.id,
                            orderBy === col.id && order === "asc"
                              ? "desc"
                              : "asc"
                          )
                        }
                      >
                        {col.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, i) => {
                  const rowId = row[rowKey] || i;
                  const isSelected = selected.includes(rowId);

                  return (
                    <TableRow
                      key={rowId}
                      hover
                      sx={{
                        transition: "background-color 0.2s",
                        cursor: onRowClick ? "pointer" : "default",
                      }}
                      selected={isSelected}
                      onClick={() => onRowClick?.(row)}
                    >
                      {/* Selection checkbox */}
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onClick={(e) => {
                            e.stopPropagation(); // prevent triggering row click
                            if (isSelected) {
                              onSelectChange(
                                selected.filter((id) => id !== rowId)
                              );
                            } else {
                              onSelectChange([...selected, rowId]);
                            }
                          }}
                        />
                      </TableCell>

                      {/* Data cells */}
                      {columns.map((col) => (
                        <TableCell
                          key={col.id}
                          sx={{
                            whiteSpace: col.grow ? "normal" : "nowrap",
                            width: col.grow ? "auto" : "1%",
                          }}
                        >
                          {(() => {
                            const value = row[col.id];
                            switch (col.type) {
                              case "boolean":
                                return value ? "Yes" : "No";
                              case "date":
                                return value
                                  ? new Date(value).toLocaleDateString()
                                  : "";
                              case "string":
                              default:
                                return typeof value === "string" ||
                                  typeof value === "number"
                                  ? value
                                  : "";
                            }
                          })()}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <Divider />
      <Box sx={{ flexShrink: 0 }}>
        <TablePagination
          component="div"
          count={meta?.total || 0}
          disabled={meta?.total <= Math.min(...rowsPerPageOptions)}
          page={(meta?.page || 1) - 1}
          onPageChange={(_, newPage) => handlePageChange(newPage)}
          rowsPerPage={meta?.limit || rowsPerPageOptions[0]}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[25, 50, 100]}
        />
      </Box>
    </Box>
  );
}
