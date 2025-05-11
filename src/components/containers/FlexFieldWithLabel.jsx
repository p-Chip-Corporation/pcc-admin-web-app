import { Box, Typography } from "@mui/material";

const FlexFieldWithLabel = ({ label, value }) => {
  return (
    <Box
      sx={{
        flex: "1 1 300px",
        minWidth: 250,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
        {value}
      </Typography>
    </Box>
  );
};

export default FlexFieldWithLabel;
