import {styled} from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import {sidebarWidth} from "./SidebarParams";

/**
 * Mixin for opened Sidebar variant.
 * @param {Theme} theme - Base Sidebar theme.
 */
const openedMixin = (theme) => ({
    backgroundColor: '#252525',
    width: sidebarWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

/**
 * Mixin for closed Sidebar variant.
 * @param {Theme} theme - Base Sidebar theme.
 */
const closedMixin = (theme) => ({
    backgroundColor: '#252525',
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

/**
 * Styled Sidebar component to display app menu.
 */
export const Sidebar = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme}) => ({
        width: sidebarWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        variants: [
            {
                props: ({open}) => open,
                style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': openedMixin(theme),
                },
            },
            {
                props: ({open}) => !open,
                style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': closedMixin(theme),
                },
            },
        ],
    }),
);