import { Box, Typography } from "@mui/material";

const MetaFooter = ({ createdBy, createdAt, updatedAt }) => {
  return (
    <Box
      sx={{
        mt: "auto",
        pt: 2,
        px: 2,
        borderRadius: 1,
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center", // ✅ center vertically
        flexWrap: "wrap",
        gap: 1,
        fontSize: "0.75rem",
        color: "text.secondary",
        backgroundColor: "background.paper",
      }}
    >
      <Typography variant="caption">
        Created by <strong>{createdBy}</strong>
      </Typography>
      <Typography variant="caption">
        Created: {new Date(createdAt).toLocaleString()}
      </Typography>
      <Typography variant="caption">
        Updated: {new Date(updatedAt).toLocaleString()}
      </Typography>
    </Box>
  );
};

export default MetaFooter;
