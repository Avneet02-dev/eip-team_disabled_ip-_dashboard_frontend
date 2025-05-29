import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import axios from "axios";
import { useMsal } from "@azure/msal-react";
import { deselectAllEmails } from "../features/emailSlice";

const SendEmail = () => {
  const { selectedEmailRows } = useSelector((state) => state.email);
  const { projects, selectedProjects } = useSelector((state) => state.project);
  const { instance, accounts } = useMsal();
  const dispatch=useDispatch()

  // Get only the selected projects' full data
  const filteredProjects = projects.filter((proj) =>
    selectedProjects.includes(proj.project)
  );

  // Prepare email data
  const prepareEmailData = () => {
    return selectedEmailRows
      .map((projectId) => filteredProjects.find((project) => project._id === projectId))
      .filter(Boolean) // Ensures no `null` or `undefined` values
      .map((project) => ({
        project: project.project || "N/A",
        ipConfig: project.ipConfig || "N/A",
        licenseStatus: project.licenseStatus || "N/A",
        ipStatus: project.ipStatus || "N/A",
        requesterEmail: project.requesterEmail || "N/A",
      }));
  };

  // Send Email Function
  const handleSendEmail = async () => {
    if (selectedEmailRows.length === 0) {
      alert("No emails selected");
      return;
    }

    const emailData = prepareEmailData();
   // console.log("Email data being sent:", emailData);

    try {
      if (!accounts.length) {
        alert("User is not authenticated");
        return;
      }

      const response = await instance.acquireTokenSilent({
        scopes: ["User.Read","Mail.ReadWrite"], // Required scopes
        account: accounts[0],
      });

      const accessToken = response.accessToken;
     // console.log("Access Token:", accessToken);

      const currentUserEmail = accounts[0]?.username || accounts[0]?.email;
      //console.log("Current User Email:", currentUserEmail);
      //console.log("email data in send emaol ",emailData)

      const backendResponse = await axios.post(
        "https://back.apps1-fm-int.icloud.intel.com/api/email/send-email",
        { emailData, sendersEmail: currentUserEmail },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (backendResponse.status === 200) {
        alert("Email sent successfully!");
        dispatch(deselectAllEmails())
      } else {
        alert("Failed to send email.");
      }
    } catch (error) {
      alert("Failed to send email.");
      console.error("Error details:", error);
    }
  };

  return (
    selectedEmailRows.length > 0 && (
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
        <Button variant="contained" color="primary" onClick={handleSendEmail}>
          Send Email
        </Button>
      </div>
    )
  );
};

export default SendEmail;
