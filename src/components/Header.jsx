import { useState } from "react";
import { FiFileText } from "react-icons/fi"; // Logs icon
import { FaArchive } from "react-icons/fa"; // Archive icon
import { AppBar, Toolbar, Typography, IconButton, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import ArchiveModal from "./ArchiveModal";
import ViewLogsDialog from "./ViewEmailLogs"
import logo from '../assets/Intel-Logo.png';
const Navbar = () => {

  const [openArchiveModal, setOpenArchiveModal] = useState(false);
  const [openLogs, setOpenLogs] = useState(false);

  // Handle opening the archive modal
  const handleArchiveClick = () => {
    setOpenArchiveModal(true);
  };

  // Handle closing the archive modal
  const handleCloseArchiveModal = () => {
    setOpenArchiveModal(false);
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Box component="img" src={logo} alt="logo" sx={{ height: 60 }} />

        {/* Heading */}
        <Typography variant="h6">Disabled IP License Dashboard</Typography>

        {/* Icons with Tooltips */}
        <Box>
          <Tooltip title="View Logs">
            <IconButton color="inherit" onClick={() => setOpenLogs(true)}>
              <FiFileText size={24} />
            </IconButton>
          </Tooltip>
          <Tooltip title="View Archive">
            <IconButton color="inherit" onClick={handleArchiveClick}>
              <FaArchive size={24} />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
      {openArchiveModal && <ArchiveModal onClose={handleCloseArchiveModal} />}
      <ViewLogsDialog open={openLogs} handleClose={() => setOpenLogs(false)} />
    </AppBar>
     
  );
};

export default Navbar;
