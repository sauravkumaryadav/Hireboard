// Login Page
// Email + password form
// Calls login from AuthContext
// Redirects to dashboard after success

import {
  Paper,
  Button,
  Typography,
  Grid,
  TextField,
  IconButton,
  InputAdornment,
  Container,
  Box
} from '@mui/material';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


export default function Login() {

  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loader, setLoader] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const response = await login(formData);
      toast.success(response?.message);
      navigate('/');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoader(false);
    }
  };

  return (

    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}
    >

      <Paper
        elevation={2}
        sx={{
          p: 4,
          borderRadius: 3,
          width: '100%',
          maxWidth: 420
        }}
      >

        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Box
            component="img"
            src="/favicon.svg"
            alt="HireBoard logo"
            sx={{ width: 32, height: 32, borderRadius: 1.5 }}
          />
          <Typography fontWeight={600} fontSize={15}>
            HireBoard
          </Typography>
        </Box>


        {/* Heading */}
        <Box sx={{ mb: 3 }}>

          <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
            Welcome back
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Sign in to track your job applications
          </Typography>

        </Box>


        {/* Form */}
        <form onSubmit={handleSubmit}>

          <Grid container spacing={2}>


            {/* Email Field */}
            <Grid size={12}>

              <TextField
                variant="outlined"
                size="small"
                fullWidth
                required
                autoFocus
                label="Email address"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, email: e.target.value }));
                }}
              />

            </Grid>


            {/* Password Field */}
            <Grid size={12}>

              {/* Label row with Forgot password link */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Password
                </Typography>
                <Link
                  to="#"
                  style={{
                    fontSize: '0.75rem',
                    color: '#1976d2',
                    textDecoration: 'none',
                    fontWeight: 500
                  }}
                >
                  Forgot password?
                </Link>
              </Box>

              <TextField
                variant="outlined"
                size="small"
                fullWidth
                required
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, password: e.target.value }));
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />

            </Grid>


            {/* Submit Button */}
            <Grid size={12}>

              <Button
                type="submit"
                variant="outlined"
                fullWidth
                disabled={!formData.email || !formData.password || loader}
                sx={{
                  borderColor: 'grey.800',
                  color: 'grey.800',
                  '&:hover': {
                    borderColor: 'grey.900',
                    backgroundColor: 'grey.50',
                  }
                }}
              >
                {loader ? 'Signing in...' : 'Sign in →'}
              </Button>

            </Grid>


            {/* Signup Link */}
            <Grid size={12}>

              <Typography variant="body2" align="center">

                Don't have an account?

                <Link
                  to="/signup"
                  style={{
                    marginLeft: '5px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    color: '#1976d2'
                  }}
                >
                  Create one
                </Link>

              </Typography>

            </Grid>

          </Grid>

        </form>

      </Paper>

    </Container>
  );
}
