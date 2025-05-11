import { Box, CircularProgress } from "@mui/material";

const LoadingSpinner = ({ title }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 2,
        }}
      >
        <CircularProgress />
        {title}
      </Box>
    </Box>
  );
};

export default LoadingSpinner;
