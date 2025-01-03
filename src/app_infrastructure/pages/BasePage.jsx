import {Outlet, useNavigate} from "react-router-dom";
import * as React from 'react';
import {useEffect, useState} from 'react';
import {useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SidebarList from "./SidebarList";
import Toolbar from "@mui/material/Toolbar";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuIcon from "@mui/icons-material/Menu";
import {Navbar} from "./Navbar";
import {Sidebar} from "./Sidebar";
import {SidebarHeader} from "./SidebarHeader";
import {getAccessToken, removeTokens} from "../../app_users/services/LoginService";

/**
 * Base layout for subpages.
 */
export default function Layout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

    useEffect(() => {
        /**
         * Asynchronously obtains access token. If token does not exist, navigates to login page.
         */
        const checkIfTokenExists = async () => {
            getAccessToken().then((token) => {
                if (!token) {
                    navigate('/login');
                }
            })
        }
        checkIfTokenExists()
    }, []);


  /**
   * Handles opening sidebar.
   */
  const handleSidebarOpen = () => {
    setOpen(true);
  };

  /**
   * Handles closing sidebar.
   */
  const handleSidebarClose = () => {
    setOpen(false);
  };

   /**
   * Handles User logout.
   */
  const handleLogout = () => {
      removeTokens();
      navigate('/login');
  }

  return (
      <Box sx={{display: 'flex'}}>
        <CssBaseline/>
        <Navbar position="fixed" open={open}>
          <Toolbar>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleSidebarOpen}
                edge="start"
                sx={[{marginRight: 5,}, open && {display: 'none'},]}
            >
              <MenuIcon/>
            </IconButton>
            <Typography
                variant="h6"
                component="a"
                href=""
                sx={{
                  flexGrow: 1,
                  textDecoration: 'none',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                }}>
              BUDGETORY
            </Typography>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Toolbar>
        </Navbar>
        <Sidebar variant="permanent" open={open}>
          <SidebarHeader>
            <IconButton onClick={handleSidebarClose}>
                {theme.direction === 'rtl' ? <ChevronRightIcon style={{color: '#BD0000'}}/> : <ChevronLeftIcon style={{color: '#BD0000'}}/>}
            </IconButton>
          </SidebarHeader>
          <Divider sx={{bgcolor: "#3E3E3E"}}/>
          <SidebarList/>

        </Sidebar>
        <Box component="main" sx={{flexGrow: 1, p: 3}}>
          {/* SidebarHeader added for positioning */}
          <SidebarHeader/>
          <Outlet/>
        </Box>
      </Box>
  )
      ;
}