import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IconButton, Menu, MenuItem, Tooltip, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import { FaArchive } from "react-icons/fa";
import { selectAllArchives, deselectAllArchives, resetArchiveSelection } from "../features/archiveSlice";
import axios from "axios";
import { useMsal } from "@azure/msal-react";

const ArchiveSelection = () => {
  const dispatch = useDispatch();
  const { projects, selectedProjects } = useSelector((state) => state.project);
  const { selectedArchiveRows } = useSelector((state) => state.archive);
  const { accounts } = useMsal();
  const userEmail = accounts.length > 0 ? accounts[0].username : "Unknown User";

  const filteredProjects = projects.filter((proj) =>
    selectedProjects.includes(proj.project)
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [archiveReason, setArchiveReason] = useState("");
  const [error, setError] = useState("");
  const open = Boolean(anchorEl);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const handleSelectAll = () => {
    const allProjectIds = filteredProjects.map((project) => project._id);
    dispatch(selectAllArchives(allProjectIds));
    handleClose();
  };

  const handleDeselectAll = () => {
    dispatch(deselectAllArchives());
    handleClose();
  };

  const prepareArchiveData = () => {
    return selectedArchiveRows
      .map((projectId) => filteredProjects.find((project) => project._id === projectId))
      .filter(Boolean)
      .map((project) => ({
        projectName: project.project,
        ipConfig: project.ipConfig || "N/A",
        supplier: project.supplier || "N/A",
        archivedBy: userEmail, // Fetching from MSAL
        reason: archiveReason,
      }));
  };

  // Handle archive action after reason submission
  const handleArchive = async () => {
    if (selectedArchiveRows.length === 0) {
      alert("No projects selected for archive");
      return;
    }

    if (!archiveReason.trim()) {
      setError("Please provide a reason.");
      return;
    }

    const archiveData = prepareArchiveData();
   // console.log("Archiving data:", archiveData);

    try {
      const response = await axios.post("https://back.apps1-fm-int.icloud.intel.com/api/archive/archive-project", {
        archiveData,
      }, { headers: { 'Content-Type': 'application/json' } });

      if (response.status === 200) {
        alert("Projects archived successfully!");
        dispatch(resetArchiveSelection()); // Reset checkboxes after archive
        handleModalClose();
      } else {
        alert("Failed to archive projects.");
      }
    } catch (error) {
      alert("Error archiving projects.");
      console.error("Error details:", error);
    }
  };

  const isArchiveVisible = selectedArchiveRows.length > 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <Tooltip title="Archive Options">
        <IconButton onClick={handleOpen}>
          <FaArchive  style={{fontSize:"16px"}}/>
        </IconButton>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleSelectAll}>Select All</MenuItem>
        <MenuItem onClick={handleDeselectAll}>Deselect All</MenuItem>
        {isArchiveVisible && (
          <MenuItem onClick={handleModalOpen}>Move to Archive</MenuItem>
        )}
      </Menu>

      {/* Archive Reason Modal */}
      <Dialog open={openModal} onClose={handleModalClose}>
        <DialogTitle>Enter Archive Reason</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={4}
            label="Reason for Archiving"
            value={archiveReason}
            onChange={(e) => setArchiveReason(e.target.value)}
            helperText={error}
            error={!!error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Cancel</Button>
          <Button onClick={handleArchive} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ArchiveSelection;
