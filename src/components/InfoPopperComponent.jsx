import React, { useState } from "react";
import { IconButton, Popover, Typography, Box } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function InfoPopperComponent({ title, children }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const open = Boolean(anchorEl);
  const id = open ? "info-popover" : undefined;

  return (
    <>
      <IconButton aria-describedby={id} onClick={handleOpen} size="medium">
        <InfoOutlinedIcon fontSize="medium" />
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        disableRestoreFocus
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        PaperProps={{
          sx: { p: 2, maxWidth: 300 },
        }}
      >
        <Box>
          {title && (
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {title}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            {children}
          </Typography>
        </Box>
      </Popover>
    </>
  );
}
