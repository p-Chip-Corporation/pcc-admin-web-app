import { Box, Paper, Typography } from "@mui/material";
import BreadcrumbsComponent from "../ui/BreadcrumbComponent";

const PageHeader = ({ title, icon, children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "end",
            gap: 2,
          }}
        >
          {icon && (
            <Box sx={{ display: "flex", alignItems: "center" }}>{icon}</Box>
          )}
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            {title}
          </Typography>
        </Box>
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
