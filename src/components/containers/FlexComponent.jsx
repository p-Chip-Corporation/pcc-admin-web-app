import { Box } from "@mui/material";

const FlexComponent = ({ component, children, fit }) => {
  return (
    <Box
      component={component || "div"}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        ...(fit
          ? {}
          : {
              flex: 1,
              height: "100%",
            }),
        padding: 2,
        gap: 2,
      }}
    >
      {children}
    </Box>
  );
};

export default FlexComponent;
