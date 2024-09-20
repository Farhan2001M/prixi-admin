import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { FaCar, FaChartPie, FaUserShield, FaTachometerAlt, FaFileAlt, FaSignOutAlt } from 'react-icons/fa';
import { RxHamburgerMenu } from "react-icons/rx";
import Link from 'next/link'

type Anchor = 'top' | 'left' | 'bottom' | 'right';

export default function SwipeableTemporaryDrawer() {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      
      <Divider />
      <List>
        {[
          { text: 'Add/Update Vehicles', icon: <FaCar className="h-6 w-6" />, path: '/addupdatevehicles' },
          { text: 'System Overview', icon: <FaChartPie className="h-6 w-6" />, path: '/system-overview' },
          { text: 'Admin Controls', icon: <FaUserShield className="h-6 w-6" />, path: '/admin-controls' },
          { text: 'My Dashboard', icon: <FaTachometerAlt className="h-6 w-6" />, path: '/my-dashboard' },
          { text: 'Generate Reports', icon: <FaFileAlt className="h-6 w-6" />, path: '/generate-reports' },
        ].map(({ text, icon, path }) => (
          <ListItem key={text} disablePadding>
            <Link href={path} style={{ textDecoration: 'none', color: 'inherit' }}>
              <ListItemButton>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>

      <Divider />
      <List>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItemButton>
                <ListItemIcon> <FaSignOutAlt className="h-6 w-6" /> </ListItemIcon>
                <ListItemText primary={"Logout"} />
            </ListItemButton>
        </Link>
        
      </List>
    </Box>
  );

  return (
    <div>
      {(['left'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)} className="p-3">
            <RxHamburgerMenu className="h-8 w-8 text-black" />
          </Button>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}
