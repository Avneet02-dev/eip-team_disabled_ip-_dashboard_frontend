import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { FaFilter } from "react-icons/fa";
import { selectAllEmails, deselectAllEmails } from "../features/emailSlice";

const EmailSelection = () => {
  const dispatch = useDispatch();
  const { projects, selectedProjects } = useSelector((state) => state.project);

  // Get only selected projects' full data
  const filteredProjects = projects.filter((proj) =>
    selectedProjects.includes(proj.project)
  );

  // State for menu anchor
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Open filter menu
  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Select all email checkboxes
  const handleSelectAll = () => {
    const allProjectIds = filteredProjects.map((project) => project._id);
    dispatch(selectAllEmails(allProjectIds));
    handleClose();
  };

  // Deselect all email checkboxes
  const handleDeselectAll = () => {
    dispatch(deselectAllEmails());
    handleClose();
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <Tooltip title="Email Options">
        <IconButton onClick={handleOpen}>
          <FaFilter  style={{fontSize:"16px"}}/>
        </IconButton>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleSelectAll}>Select All</MenuItem>
        <MenuItem onClick={handleDeselectAll}>Deselect All</MenuItem>
      </Menu>
    </div>
  );
};

export default EmailSelection;
