import { Button } from "@mui/material";

const SquareButton = ({ variant, onClick, children }) => {
  return (
    <Button
      variant={variant}
      size="small"
      onClick={onClick}
      sx={{
        minWidth: 0,
        aspectRatio: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </Button>
  );
};

export default SquareButton;
