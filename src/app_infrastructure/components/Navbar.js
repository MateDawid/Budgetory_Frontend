import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {useNavigate} from "react-router-dom";

// TODO: User email from token
// Cypress
// Linting

/**
 * Navbar component displays navigation bar.
 */
export default function Navbar() {
  const navigate = useNavigate();

  /**
   * Handles User logout by removing token from localStorage.
   */
  const logOut = () => {
    window.localStorage.removeItem('budgetory.auth');
    navigate('/login')
  };

  return (
      <Box>
        <AppBar position="static" sx={{bgcolor: "#BD0000"}}>
        <Toolbar>
          <Typography variant="h6" component="a" href="" sx={{
            flexGrow: 1,
            textDecoration: 'none',
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
          }}>
            BUDGETORY
          </Typography>
          <Button color="inherit" onClick={() => logOut()}>Logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}