import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import { FaFileExcel } from "react-icons/fa";
import axios from "axios";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";
import { useMsal } from "@azure/msal-react"; // MSAL for authentication

const ViewLogsDialog = ({ open, handleClose }) => {
  const [emailLogs, setEmailLogs] = useState([]);
  const { instance, accounts } = useMsal();
  const currentUserEmail = accounts[0]?.username || accounts[0]?.email; // User email from MSAL
 // console.log("current user",currentUserEmail)

  useEffect(() => {
    if (open) {
      fetchEmailLogs();
    }
  }, [open]);

  const fetchEmailLogs = async () => {
    try {
      console.log("Fetching access token...");
      const response = await instance.acquireTokenSilent({
        scopes: ["User.Read", "Mail.ReadWrite"], // Ensure correct API scopes
        account: accounts[0],
      });

      //console.log("Access Token Response:", response);
      const accessToken = response.accessToken;

      if (!accessToken) {
        console.error("❌ Access token is missing!");
        return;
      }

      //console.log("✅ Token retrieved, fetching email logs...");
      const logsResponse = await axios.get(
        "https://back.apps1-fm-int.icloud.intel.com/api/logs",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      //console.log("✅ Logs fetched successfully:", logsResponse.data);
      setEmailLogs(logsResponse.data);
    } catch (error) {
      //console.error("❌ Error fetching email logs:", error);
      if (error.response) {
        //console.error("🔴 Status Code:", error.response.status);
        //console.error("🔴 Response Data:", error.response.data);
      } else if (error.request) {
        //console.error("🔴 No response received:", error.request);
      } else {
        //console.error("🔴 Request Setup Error:", error.message);
      }
    }
  };

  const handleFollowUpEmail = async (log) => {
    try {
     // console.log("🔄 Fetching project details for:", log.project, log.ipConfig);
      const projectResponse = await axios.get(
        "https://back.apps1-fm-int.icloud.intel.com/api/projects/details",
        {
          params: { project: log.project, ipConfig: log.ipConfig },
        }
      );

      if (!projectResponse.data) {
       // console.error("❌ Project details not found");
        return;
      }

      //console.log("✅ Project details retrieved:", projectResponse.data);
      
      //console.log("🔄 Acquiring new access token...");
      const tokenResponse = await instance.acquireTokenSilent({
        scopes: ["User.Read", "Mail.ReadWrite"],
        account: accounts[0],
      });

      const accessToken = tokenResponse.accessToken;
      if (!accessToken) {
        console.error("❌ Failed to retrieve access token");
        return;
      }

     // console.log("✅ Access token acquired, sending follow-up email...");
      

      const emailsData = {
        project: log.project || "N/A",
        ipConfig: log.ipConfig || "N/A",
        ipStatus: projectResponse.data.ipStatus || "N/A",
        licenseStatus: projectResponse.data.licenseStatus || "N/A",
        requesterEmail: projectResponse.data.requesterEmail || "N/A",
      };
      //console.log("🔄 Sending email with payload:", emailData);
      const emailData = Array.isArray(emailsData) ? emailsData : [emailsData];
      //console.log("formatted dATA IS",formattedEmailData)


      await axios.post(
        "https://back.apps1-fm-int.icloud.intel.com/api/email/send-email",
        { emailData, sendersEmail: currentUserEmail },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      //console.log("✅ Follow-up email sent successfully!");
      fetchEmailLogs(); // Refresh logs after sending email
    } catch (error) {
      console.error("❌ Error sending follow-up email:", error);
      if (error.response) {
        console.error("🔴 Status Code:", error.response.status);
        console.error("🔴 Response Data:", error.response.data);
      }
    }
  };

  const handleExportToExcel = () => {
   // console.log("📁 Exporting logs to Excel...");
    const worksheet = XLSX.utils.json_to_sheet(emailLogs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "EmailLogs");
    XLSX.writeFile(workbook, "Email_Logs.xlsx");
   // console.log("✅ Excel file exported successfully.");
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>Email Logs</DialogTitle>
      <DialogContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project</TableCell>
              <TableCell>IP Configuration</TableCell>
              <TableCell>Emails Sent</TableCell>
              <TableCell>Sender Email</TableCell>
              <TableCell>Sent At</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emailLogs.map((log, index) => (
              <TableRow
                key={index}
                style={{ backgroundColor: log.reminderCount > 3 ? "#ffcccc" : "transparent" }} // Highlight rows with reminderCount > 3
              >
                <TableCell>{log.project}</TableCell>
                <TableCell>{log.ipConfig}</TableCell>
                <TableCell>{log.reminderCount}</TableCell>
                <TableCell>{log.senderEmail}</TableCell>
                <TableCell>{new Date(log.sentAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ fontSize: "8px", padding: "4px 8px", minWidth: "auto" }}
                    onClick={() => handleFollowUpEmail(log)}
                  >
                  Follow-Up
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button
          onClick={handleExportToExcel}
          variant="contained"
          color="success"
          startIcon={<FaFileExcel />}
          style={{ marginTop: "10px" }}
        >
          Export to Excel
        </Button>
      </DialogContent>
    </Dialog>
  );
};

ViewLogsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ViewLogsDialog;
