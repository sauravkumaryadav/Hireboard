// AppLayout - Protected layout wrapper with Sidebar + Header + Outlet

import Sidebar from "./Sidebar";
import Header from "./Header";
import { Box,Toolbar  } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// TODO: Check auth, redirect to /login if not authenticated
export default function AppLayout() {

  const {user, loading} = useAuth();
  if(loading){
        return <div>Loading...</div>;
  }
  if(!user){
    return <Navigate to='/login' />;
  }
  return (<>
     <Box sx={{ display: "flex" }}>

      {/* Sidebar */}
      <Sidebar />

      {/* Right Side */}
      <Box
        component="main"
        sx={{
          flexGrow: 1
        }}
      >
        <Header />

        {/* Spacer for fixed AppBar */}
        <Toolbar />

        {/* Page Content */}
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>

      </Box>

    </Box>
  </>
    
  );
}
