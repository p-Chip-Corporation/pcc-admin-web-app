import { Button, Menu } from "@mui/material";
import { useState, cloneElement } from "react";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

const DropdownButton = ({ children, label = "Actions" }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const wrappedChildren = Array.isArray(children)
    ? children.map((child, index) =>
        cloneElement(child, {
          key: index,
          onClick: (e) => {
            child.props.onClick?.(e);
            handleMenuClose();
          },
        })
      )
    : cloneElement(children, {
        onClick: (e) => {
          children.props.onClick?.(e);
          handleMenuClose();
        },
      });

  return (
    <>
      <Button
        variant="contained"
        size="small"
        sx={{ borderRadius: 1 }}
        onClick={handleMenuOpen}
        endIcon={open ? <ArrowDropUp /> : <ArrowDropDown />}
      >
        {label}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {wrappedChildren}
      </Menu>
    </>
  );
};

export default DropdownButton;
