import * as React from 'react';
import Box from '@mui/material/Box';
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
const drawerWidth = 240;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

export default function ProtectedRoute(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate()
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const sideBarMenu = [
    {
      title: 'แดชบอร์ด',
      to: '/dashboard',
      isShow: true,
      icon: <DashboardIcon />
    },
    {
      title: 'กลุ่มเรียน',
      to: '/section',
      isShow: true,
      icon: <GroupsIcon />
    },
    {
      title: 'แบบฝึกหัด',
      to: '/assignment',
      isShow: true,
      icon: <AssignmentIcon />
    },
    {
      title: 'รายชื่อนักศึกษา',
      to: '/student',
      isShow: true,
      icon: <PeopleIcon />
    },
  ]

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {sideBarMenu.map((menu, index) => (
          menu.isShow === true && <ListItem key={index} disablePadding onClick={() => navigate(menu.to)}>
            <ListItemButton>
              <ListItemIcon>
                {menu.icon}
              </ListItemIcon>
              <ListItemText primary={menu.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex', width: '100%', minWidth: '100vw' }}>
      <CssBaseline />
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Box 
        sx={{
          display: { xs: 'none', lg: 'block' }, width: drawerWidth,
        }}
      >
        {drawer}
      </Box>
      <Divider orientation="vertical" flexItem/>
      <Box
        className='min-h-screen'
        // sx={{ width: { lg: `calc(100% - ${drawerWidth}px)` } }}
        sx={{ width: '100%' }}
      >
        <Box
          sx={{
            width: '100%',
            background: '#352F44'
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { lg: 'none' }, color: '#ffffff' }}
            >
              <MenuIcon />
            </IconButton>
            <div className='flex flex-row justify-between items-center'>
              <Typography variant="h6" noWrap component="div" className='hidden md:block text-white'>
                รายวิชา Fundamental of Computer Engineering
              </Typography>
            </div>
          </Toolbar>
        </Box>
        <Outlet />
      </Box>
    </Box>
  );
}