import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
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
  rowKey = "id",
  rowsPerPageOptions = [5, 10, 25],
  onRowClick, // ✅ add this
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
          paginatedData.map((row, i) => (
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
                    >
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row, i) => (
                  <TableRow
                    key={row[rowKey] || i}
                    hover
                    sx={{
                      transition: "background-color 0.2s",
                      cursor: onRowClick ? "pointer" : "default",
                    }}
                    onClick={() => onRowClick?.(row)} // ✅ invoke handler if provided
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
          count={data.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Paper>
  );
}
