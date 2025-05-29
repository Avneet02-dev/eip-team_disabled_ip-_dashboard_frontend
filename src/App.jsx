import  { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "./features/projectSlice";
import Header from "./components/Header";  //  Keep the Header component
import ProjectDropdown from "./components/ProjectDropdown";
import ProjectTable from "./components/ProjectTable";
import ProtectedRoute from "./components/ProtectedComponet";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./authConfig";
import {  Alert } from "@mui/material";


const pca = new PublicClientApplication(msalConfig);
const App = () => {
  const [isMsalInitialized, setIsMsalInitialized] = useState(false);
 

  
  const dispatch = useDispatch();
  const {  error } = useSelector((state) => state.project);

  useEffect(() => {
    dispatch(fetchProjects()); // Dispatch the action to fetch projects
  }, [dispatch]);
  useEffect(() => {
    pca.initialize()
      .then(() => setIsMsalInitialized(true))
      .catch(error => console.error("MSAL Initialization Error:", error));
  }, []);
  if (!isMsalInitialized) {
    return <div>Loading...</div>; // Show loading until MSAL is initialized
  }
  return (
    <MsalProvider instance={pca}>
       <ProtectedRoute>
       <Header />
       <ProjectDropdown />
       <ProjectTable />
       </ProtectedRoute>
      {/* Keep the Header component */}
     
      {error && <Alert severity="error">{error}</Alert>}
      
      
      </MsalProvider> 
 
  );
};

export default App;
