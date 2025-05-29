import { PublicClientApplication } from "@azure/msal-browser";

// MSAL Configuration
const msalConfig = {
  auth: {
    clientId: clientid, // Your app's client ID from Azure AD
    authority: "https://login.microsoftonline.com/tenantid", // Tenant ID or common
    redirectUri: window.location.origin,  // Redirect URI after login
  },
  cache: {
    cacheLocation: "localStorage", // Where the token is stored
    storeAuthStateInCookie: true, // Helpful for Safari
  },
};

// Declare msalInstance globally, but initialize it later
let msalInstance;

// Function to initialize MSAL
const initializeMSAL = () => {
  if (!msalInstance) {
    msalInstance = new PublicClientApplication(msalConfig);  // Initialize MSAL instance here
  }
};

// Initialize request object
const loginRequest = {
  scopes: ["User.Read"],  // Define the scope you need
};

// Function to sign in and initialize MSAL
export const signIn = async () => {
  try {
    initializeMSAL();  // Ensure MSAL is initialized

    const accounts = msalInstance.getAllAccounts(); // Get any available accounts

    if (accounts.length === 0) {
      // If no accounts, perform the login
      const response = await msalInstance.loginPopup(loginRequest);
      console.log("Login successful:", response);
    } else {
      console.log("User is already logged in:", accounts[0]);
    }
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// To get the access token
export const getAccessToken = async () => {
  try {
    initializeMSAL();  // Ensure MSAL is initialized

    const accounts = msalInstance.getAllAccounts(); // Get all accounts

    if (accounts.length === 0) {
      throw new Error("No account found. User is not signed in.");
    }

    const silentRequest = {
      scopes: ["User.Read"],  // Scopes for token acquisition
      account: accounts[0],   // Select the first account
    };

    // Attempt to acquire the token silently
    const response = await msalInstance.acquireTokenSilent(silentRequest);
    return response.accessToken; // Return the access token
  } catch (error) {
    console.error("Token acquisition failed", error);
    throw error;
  }
};

export default msalInstance; // Export msalInstance for later use
