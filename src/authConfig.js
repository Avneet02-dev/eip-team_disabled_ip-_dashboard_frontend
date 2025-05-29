export const msalConfig = {
    auth: {
      clientId: clientId,  // Client ID from Azure AD
      authority: "https://login.microsoftonline.com/tenantid",  // Tenant ID from Azure AD
      redirectUri: window.location.origin, // Redirect URI (usually localhost in dev)
    },
    cache: {
      cacheLocation: "sessionStorage", // You can also use "localStorage"
      storeAuthStateInCookie: false, // Do not store authentication state in cookies
    },
  };
  
  export const loginRequest = {
    scopes: ["User.Read",  "Mail.ReadWrite","Mail.Send"], // Scopes for the app
  };
  