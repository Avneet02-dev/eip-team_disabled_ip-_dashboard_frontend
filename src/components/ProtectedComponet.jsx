import  { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser"; // Import the error type
import { loginRequest } from "../authConfig";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const { instance, accounts } = useMsal();

  useEffect(() => {
    const authenticate = async () => {
      try {
        if (accounts.length > 0) {
          // Attempt to acquire a token silently
          const response = await instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0],
          });
          //console.log("Access token acquired silently:", response.accessToken);
        } else {
          // Initiate loginPopup if not authenticated
          await instance.loginPopup(loginRequest);
          console.log("User successfully authenticated via popup.");
        }
      } catch (error) {
        // Check if the error is an InteractionRequiredAuthError
        if (error instanceof InteractionRequiredAuthError) {
          console.log("Silent token acquisition failed. Triggering loginPopup.");
          try {
            await instance.loginPopup(loginRequest);
            console.log("User authenticated successfully via popup after silent acquisition failed.");
          } catch (popupError) {
            console.error("Popup login failed:", popupError);
          }
        } else {
          console.error("Unexpected error during silent token acquisition:", error);
        }
      }
    };

    authenticate();
  }, [instance, accounts]);

  const isAuthenticated = accounts && accounts.length > 0;

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Cannot Login. Please Contact the Administrator
      </div>
    );
  }

  return <>{children}</>;

};
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };


export default ProtectedRoute;
