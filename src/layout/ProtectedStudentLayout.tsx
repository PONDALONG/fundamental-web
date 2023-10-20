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
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import BookIcon from '@mui/icons-material/Book';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Logout from '@mui/icons-material/Logout';
import { logoutAlert } from '../utils/SweetAlert';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../stores/slice/user.slice';
import { UserModel } from '../types/userModel';
import { RootState } from '../stores/store';
import SideBarLogo from '/sidebar-logo.jpg'
const drawerWidth = 240;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

export default function ProtectedStudentRoute(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate()

  const user: UserModel = useSelector((state: RootState) => state.userReducer)
  const userDispatch = useDispatch()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    logoutAlert().then((res) => {
      if (res.isConfirmed) {
        localStorage.removeItem('access-token')
        userDispatch(clearUser())
        navigate('/')
      }
    })
  }
  const sideBarMenu = [
    {
      title: 'แบบฝึกหัด',
      to: '/assignment',
      isShow: true,
      icon: <AssignmentIcon />
    },
    {
      title: 'ข้อมูลส่วนตัว',
      to: '/profile',
      isShow: true,
      icon: <AccountCircleIcon />
    },
  ]

  const drawer = (
    <div>
      <Toolbar className='flex justify-center items-center'>
        <img src={SideBarLogo} height={50} alt="" />
      </Toolbar>
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
      <Divider orientation="vertical" flexItem />
      <Box
        className='min-h-screen'
        sx={{ width: '100%' }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '100vw',
            background: '#352F44'
          }}
        >
          <Toolbar className='flex justify-between'>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { lg: 'none' }, color: '#ffffff' }}
            >
              <MenuIcon />
            </IconButton>
            <div className='flex flex-row justify-end md:justify-between items-center w-full'>
              <Typography variant="h6" noWrap component="div" className='hidden md:block text-white'>
                รายวิชา Fundamental of Computer Engineering
              </Typography>
              <div>
                <IconButton
                  onClick={handleClickMenu}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={openMenu ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={openMenu ? 'true' : undefined}
                >
                  {!user.image && <Avatar className='bg-secondary'>{!!user.studentNo ? user.studentNo.charAt(0) + user.studentNo.charAt(1) : ''}</Avatar>}
                  {!!user.image && <Avatar className='bg-secondary' src={`${import.meta.env.VITE_API_ENDPOINT}/${user.image}`}></Avatar>}
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={openMenu}
                  onClose={handleCloseMenu}
                  onClick={handleCloseMenu}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  sx={{ width: 200 }}
                >
                  <MenuItem onClick={() => navigate('/profile')}>
                    <Typography variant='inherit' noWrap>{!!user.nameTH ? user.nameTH : ''}</Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogoutClick}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            </div>
          </Toolbar>
        </Box>
        <Outlet />
      </Box>
    </Box>
  );
}