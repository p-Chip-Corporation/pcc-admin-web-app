import { Box, Paper, Typography } from "@mui/material";
import BreadcrumbsComponent from "./BreadcrumbComponent";

const PageHeader = ({ title, icon, children }) => {
  return (
    <Box
      component={Paper}
      sx={{
        px: 2,
        py: 1,
        display: "flex",
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Box sx={{ display: "flex", alignItems: "end", gap: 2 }}>
          {icon && (
            <Box sx={{ display: "flex", alignItems: "center" }}>{icon}</Box>
          )}
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            {title}
          </Typography>
        </Box>

        <BreadcrumbsComponent />
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PageHeader;
