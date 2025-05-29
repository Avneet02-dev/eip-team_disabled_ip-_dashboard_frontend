import { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const ArchiveModal = ({ onClose }) => {
  const [archivedProjects, setArchivedProjects] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Fetch archived projects on component mount
  useEffect(() => {
    const fetchArchivedProjects = async () => {
      try {
        const response = await axios.get("https://back.apps1-fm-int.icloud.intel.com/api/archive/archive-project-find");
        if (response.status === 200) {
          setArchivedProjects(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch archived projects:", error);
      }
    };

    fetchArchivedProjects();
  }, []);

  // Open delete confirmation dialog
  const handleDeleteConfirmation = (project) => {
    setProjectToDelete(project);
    setOpenConfirmDialog(true);
  };

  // Handle delete project
  const handleDeleteProject = async () => {
    try {
      const response = await axios.delete(`https://back.apps1-fm-int.icloud.intel.com/api/archive/delete/${projectToDelete._id}`);
      if (response.status === 200) {
        setArchivedProjects(archivedProjects.filter((proj) => proj._id !== projectToDelete._id));
        setOpenConfirmDialog(false); // Close confirmation dialog
        alert("Project deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete archived project:", error);
      alert("Failed to delete project.");
    }
  };

  // Cancel delete action
  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Archived Projects</DialogTitle>
      <DialogContent>
        {archivedProjects.length === 0 ? (
          <Typography>No archived projects found.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Project Name</strong></TableCell>
                  <TableCell><strong>IP Configuration</strong></TableCell>
                  <TableCell><strong>Supplier</strong></TableCell>
                  <TableCell><strong>Archived By</strong></TableCell>
                  <TableCell><strong>Reason</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {archivedProjects.map((project) => (
                  <TableRow key={project._id}>
                    <TableCell>{project.projectName}</TableCell>
                    <TableCell>{project.ipConfig}</TableCell>
                    <TableCell>{project.supplier}</TableCell>
                    <TableCell>{project.archivedBy}</TableCell>
                    <TableCell>{project.reason}</TableCell>
                    <TableCell>
                      <Button color="secondary" onClick={() => handleDeleteConfirmation(project)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openConfirmDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this project from the archive?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">Cancel</Button>
          <Button onClick={handleDeleteProject} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

// PropTypes validation
ArchiveModal.propTypes = {
  onClose: PropTypes.func.isRequired, // Validate the onClose prop as a required function
};

export default ArchiveModal;
