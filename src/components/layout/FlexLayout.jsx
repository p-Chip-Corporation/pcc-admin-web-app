import { Box } from "@mui/material";

const FlexLayout = ({ children }) => {
  return (
    <Box
      sx={{
        padding: 0,
        margin: 0,
        gap: 1,
        display: "flex",
        flexDirection: "column",
        flex: 1,
        height: "100%",
        width: "100%",
      }}
    >
      {children}
    </Box>
  );
};

export default FlexLayout;
