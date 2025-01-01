import {styled} from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import {sidebarWidth} from "./SidebarParams";


/**
 * Styled Navbar component to display navigation bar on top of the page.
 */
export const Navbar = styled(MuiAppBar, {
      shouldForwardProp: (prop) => prop !== 'open',
    })(({theme}) => ({
      backgroundColor: "#BD0000",
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      variants: [
        {
          props: ({open}) => open,
          style: {
            marginLeft: sidebarWidth,
            width: `calc(100% - ${sidebarWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        },
      ],
    }));
