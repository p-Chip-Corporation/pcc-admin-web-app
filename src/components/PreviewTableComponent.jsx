import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material";
import RightDrawer from "./RightDrawerComponent";

export default function PreviewTableComponent({
  columns,
  data,
  rowKey = "id",
  onRowClick,
  onViewAllClick,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        backgroundColor: "background.paper",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {isMobile ? (
        data.map((row, i) => (
          <Box
            key={row[rowKey] || i}
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              backgroundColor: "grey.50",
              cursor: onRowClick ? "pointer" : "default",
            }}
            onClick={() => onRowClick?.(row)}
          >
            {columns.map((col) => (
              <Box key={col.id} sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
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
              </Box>
            ))}
          </Box>
        ))
      ) : (
        <TableContainer>
          <Table
            size="small"
            sx={{ borderCollapse: "separate", borderSpacing: 0 }}
          >
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell
                    key={col.id}
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      backgroundColor: "grey.100",
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      whiteSpace: col.grow ? "normal" : "nowrap",
                      width: col.grow ? "auto" : "1%",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {col.label}
                    </Typography>
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
                    cursor: onRowClick ? "pointer" : "default",
                    backgroundColor: i % 2 === 0 ? "grey.50" : "transparent",
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.id}
                      sx={{
                        borderBottom: "none",
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

      <Divider />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pt: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {data.length} record{data.length !== 1 ? "s" : ""}
        </Typography>
        <Button size="small" onClick={onViewAllClick}>
          View All
        </Button>
      </Box>
      <RightDrawer></RightDrawer>
    </Paper>
  );
}
