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
} from "@mui/material";

export default function ResponsivePaginatedTableComponent({
  columns,
  data,
  meta,
  onPageChange,
  onRowsPerPageChange,
  onSort,
  order = "asc",
  orderBy = "",
  rowKey = "id",
  rowsPerPageOptions = [25, 50, 100],
  onRowClick,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSort = (colId) => {
    const isAsc = orderBy === colId && order === "asc";
    onSort?.(colId, isAsc ? "desc" : "asc");
  };

  return (
    <Paper
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
                  {columns.map((col) => (
                    <TableCell
                      key={col.id}
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: "grey.100",
                        textTransform: "uppercase",
                        whiteSpace: col.grow ? "normal" : "nowrap",
                        width: col.grow ? "auto" : "1%",
                      }}
                      sortDirection={orderBy === col.id ? order : false}
                    >
                      <TableSortLabel
                        active={orderBy === col.id}
                        direction={orderBy === col.id ? order : "asc"}
                        onClick={() => handleSort(col.id)}
                      >
                        {col.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, i) => (
                  <TableRow
                    key={row[rowKey] || i}
                    hover
                    sx={{
                      transition: "background-color 0.2s",
                      cursor: onRowClick ? "pointer" : "default",
                    }}
                    onClick={() => onRowClick?.(row)}
                  >
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
                ))}
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
          onPageChange={(_, newPage) => {
            onPageChange?.(newPage + 1);
          }}
          rowsPerPage={meta?.limit || rowsPerPageOptions[0]}
          onRowsPerPageChange={(e) => {
            const newLimit = parseInt(e.target.value, 10);
            onRowsPerPageChange?.(newLimit);
          }}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      </Box>
    </Paper>
  );
}
