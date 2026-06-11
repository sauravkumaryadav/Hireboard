import { useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Box, Drawer, CssBaseline, Toolbar, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Dashboard as DashboardIcon, ViewKanban as BoardIcon, Settings as SettingsIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 220;

const navItems = [
  { label: 'Dashboard', path: '/',         icon: <DashboardIcon /> },
  { label: 'Board',     path: '/board',    icon: <BoardIcon /> },
  { label: 'Settings',  path: '/settings', icon: <SettingsIcon /> },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />

        {/* Nav Links */}
        <List>
          {navItems.map(({ label, path, icon }) => (
            <ListItem key={label} disablePadding>
              <ListItemButton
                component={NavLink}
                to={path}
                end={path === '/'}
                sx={{
                  '&.active': {
                    bgcolor: 'action.selected',
                    fontWeight: 'bold',
                  },
                }}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Logout pinned to bottom */}
        <Box sx={{ mt: 'auto' }}>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{ color: 'error.main' }}
              >
                <ListItemIcon sx={{ color: 'error.main' }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

      </Drawer>
    </Box>
  );
}