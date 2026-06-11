import { useState, useCallback } from 'react';
import {
  AppBar, Toolbar, Typography, Box, Avatar,
  IconButton, Tooltip, Menu, MenuItem,
  ListItemIcon, ListItemText, Divider
} from '@mui/material';
import { Person, ManageAccounts, Dashboard, Logout, AirplaneTicket } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Profile',   icon: <Person fontSize="small" />,         path: '/profile' },
  { label: 'Account',   icon: <ManageAccounts fontSize="small" />, path: '/settings' },
  { label: 'Dashboard', icon: <Dashboard fontSize="small" />,      path: '/' },
];

const getInitials = (name = '') => {
  const parts = name.trim().split(' ');
  return parts.length >= 2
    ? parts[0][0] + parts[1][0]
    : parts[0]?.[0] ?? '';
};

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = useCallback((e) => setAnchorEl(e.currentTarget), []);
  const handleClose = useCallback(() => setAnchorEl(null), []);

  const handleNav = useCallback((path) => {
    handleClose();
    navigate(path);
  }, [handleClose, navigate]);

  const handleLogout = useCallback(() => {
    handleClose();
    logout();
    navigate('/login');
  }, [handleClose, logout, navigate]);

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>

        {/* Left — Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AirplaneTicket sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: { xs: '.05rem', sm: '.2rem' },
              fontSize: { xs: '1rem', sm: '1.25rem' },
            }}
          >
            HireBoard
          </Typography>
        </Box>

        {/* Right — User */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, display: { xs: 'none', sm: 'block' } }}
          >
            {user?.name}
          </Typography>

          <Tooltip title="Account settings">
            <IconButton onClick={handleOpen} sx={{ p: 0 }}>
              <Avatar sx={{ width: 36, height: 36, fontSize: 14 }}>
                {getInitials(user?.name).toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            keepMounted
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            {NAV_ITEMS.map(({ label, icon, path }) => (
              <MenuItem key={label} onClick={() => handleNav(path)}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText>{label}</ListItemText>
              </MenuItem>
            ))}

            <Divider />

            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <ListItemIcon sx={{ color: 'error.main' }}>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Box>

      </Toolbar>
    </AppBar>
  );
}
