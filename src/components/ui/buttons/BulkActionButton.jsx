import { useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";

const BulkActionsMenuButton = ({ selected = [], actions = [] }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button
        variant="contained"
        size="small"
        aria-controls="bulk-actions-menu"
        aria-haspopup="true"
        onClick={handleOpen}
        sx={{
          minWidth: 39,
          height: "100%",
          aspectRatio: 1,
          width: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected.length}
      </Button>
      <Menu
        id="bulk-actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {actions.map(({ label, onClick }) => (
          <MenuItem
            key={label}
            onClick={() => {
              onClick(selected);
              handleClose();
            }}
          >
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default BulkActionsMenuButton;
