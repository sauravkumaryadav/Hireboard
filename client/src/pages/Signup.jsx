// Signup Page
// Name + email + password form
// Calls signup from AuthContext
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
  Box,
  LinearProgress,
  Link as MuiLink
} from '@mui/material';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { value: 20, label: 'Weak — try a longer password', color: '#f44336' };
  if (score === 2) return { value: 40, label: 'Fair — add uppercase or numbers', color: '#ff9800' };
  if (score === 3) return { value: 60, label: 'Good — add a symbol for stronger', color: '#66bb6a' };
  if (score === 4) return { value: 80, label: 'Strong', color: '#43a047' };
  return { value: 100, label: 'Very strong', color: '#2e7d32' };
};


export default function Signup() {

  const navigate = useNavigate();
  const { signup } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });


  // Error State
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: ''
  });


  // Loader State
  const [loader, setLoader] = useState(false);


  // Password Visibility State
  const [showPassword, setShowPassword] = useState(false);


  // Toggle Password Visibility
  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };


  // Prevent default mouse behavior
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };


  // Form Validation
  const validateForm = () => {

    const newErrors = {
      name: '',
      email: '',
      password: ''
    };

    // Name Validation
    if (formData.name.trim().length < 3) {

      newErrors.name =
        'Name must be at least 3 characters';

    }

    // Email Validation
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (
      !emailRegex.test(
        formData.email.trim()
      )
    ) {

      newErrors.email =
        'Please enter a valid email';

    }

    // Password Validation
    if (formData.password.length < 6) {

      newErrors.password =
        'Password must be at least 6 characters';

    }

    // Set Errors
    setErrors(newErrors);

    // Return Validation Status
    return !(
      newErrors.name ||
      newErrors.email ||
      newErrors.password
    );
  };


  // Handle Form Submit
  const handleSubmit = async (e) => {

    e.preventDefault();

    // Validate Form
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    setLoader(true);

    try {

      // Clean Payload
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      };

      // Call Signup API
      const response = await signup(payload);

      // Success Toast
      toast.success(
        response?.message || 'Account created successfully'
      );

      // Redirect to Dashboard
      navigate('/');

    } catch (err) {

      // Error Toast
      toast.error(
        err?.response?.data?.message || 'Signup failed'
      );

    } finally {

      setLoader(false);
    }
  };

  const passwordStrength = formData.password ? getPasswordStrength(formData.password) : null;

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
            Create your account
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Start tracking your job search — free forever
          </Typography>

        </Box>


        {/* Form */}
        <form onSubmit={handleSubmit}>

          <Grid container spacing={2}>


            {/* Name Field */}
            <Grid size={12}>

              <TextField
                variant="outlined"
                size="small"
                fullWidth
                required
                autoFocus
                label="Full name"
                type="text"
                autoComplete="name"
                error={!!errors.name}
                helperText={errors.name}
                value={formData.name}
                onChange={(e) => {

                  setFormData((prev) => ({
                    ...prev,
                    name: e.target.value
                  }));

                  setErrors((prev) => ({
                    ...prev,
                    name: ''
                  }));
                }}
              />

            </Grid>


            {/* Email Field */}
            <Grid size={12}>

              <TextField
                variant="outlined"
                size="small"
                fullWidth
                required
                label="Email address"
                type="email"
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email}
                value={formData.email}
                onChange={(e) => {

                  setFormData((prev) => ({
                    ...prev,
                    email: e.target.value
                  }));

                  setErrors((prev) => ({
                    ...prev,
                    email: ''
                  }));
                }}
              />

            </Grid>


            {/* Password Field */}
            <Grid size={12}>

              <TextField
                variant="outlined"
                size="small"
                fullWidth
                required
                label="Password"
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                autoComplete="new-password"
                error={!!errors.password}
                value={formData.password}
                onChange={(e) => {

                  setFormData((prev) => ({
                    ...prev,
                    password: e.target.value
                  }));

                  setErrors((prev) => ({
                    ...prev,
                    password: ''
                  }));
                }}

                inputProps={{
                  minLength: 6
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

              {/* Password strength or error */}
              {errors.password ? (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block', ml: '14px' }}>
                  {errors.password}
                </Typography>
              ) : passwordStrength && (
                <Box sx={{ mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength.value}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: passwordStrength.color,
                        borderRadius: 2,
                      }
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: passwordStrength.color, mt: 0.5, display: 'block' }}
                  >
                    {passwordStrength.label}
                  </Typography>
                </Box>
              )}

            </Grid>


            {/* Submit Button */}
            <Grid size={12}>

              <Button
                type="submit"
                variant="outlined"
                fullWidth
                disabled={
                  !formData.name.trim() ||
                  !formData.email.trim() ||
                  !formData.password ||
                  loader
                }
                sx={{
                  borderColor: 'grey.800',
                  color: 'grey.800',
                  '&:hover': {
                    borderColor: 'grey.900',
                    backgroundColor: 'grey.50',
                  }
                }}
              >

                {
                  loader
                    ? 'Creating Account...'
                    : 'Create account →'
                }

              </Button>

            </Grid>


            {/* Legal Text */}
            <Grid size={12}>
              <Typography
                variant="caption"
                color="text.secondary"
                align="center"
                display="block"
              >
                By creating an account you agree to our{' '}
                <Link
                  to="#"
                  style={{ color: 'inherit', textDecoration: 'underline' }}
                >
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link
                  to="#"
                  style={{ color: 'inherit', textDecoration: 'underline' }}
                >
                  Privacy Policy
                </Link>
              </Typography>
            </Grid>


            {/* Login Link */}
            <Grid size={12}>

              <Typography variant="body2" align="center">

                Already have an account?

                <MuiLink
                  component={Link}
                  to="/login"
                  sx={{
                    ml: '5px',
                    fontWeight: 600,
                    color: '#1976d2',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Sign in
                </MuiLink>

              </Typography>

            </Grid>

          </Grid>

        </form>

      </Paper>

    </Container>
  );
}
