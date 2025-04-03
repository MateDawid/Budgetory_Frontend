import {Outlet, useNavigate} from "react-router-dom";
import * as React from 'react';
import {useEffect} from 'react';
import Box from '@mui/material/Box';
import Navbar from "../components/Navbar";
import {getAccessToken} from "../../app_users/services/LoginService";
import {Stack} from "@mui/material";
import Leftbar from "../components/Leftbar";
import Rightbar from "../components/Rightbar";

/**
 * Base layout for subpages.
 */
export default function BasePage() {
  const navigate = useNavigate();

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

  return (
      <Box>
          <Navbar/>
          <Stack direction="row" justifyContent="space-between" alignItems="stretch">
              <Leftbar/>
              <Box flex={5} p={2}>
                  <Outlet/>
              </Box>
              <Rightbar/>
          </Stack>
      </Box>
  )
      ;
}