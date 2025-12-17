import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  Box
} from '@mui/material';

import { apiPost } from '../../../utils/api';
import AnimateButton from 'ui-component/extended/AnimateButton';
import CustomFormControl from 'ui-component/extended/Form/CustomFormControl';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ===========================|| JWT - REGISTER (REAL BACKEND) ||=========================== //

export default function AuthRegister() {
  const navigate = useNavigate();

  // Form values
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'citizen' // default user role
  });

  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(true);

  // Password strength
  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  // -------------------------------------------------------------
  // 🔥 SUBMIT REGISTER FORM
  // -------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullName = `${formData.firstName} ${formData.lastName}`;

    const payload = {
      fullName,
      email: formData.email,
      password: formData.password,
      role: formData.role
    };

    try {
      // const response = await fetch('http://localhost:5000/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // });

      const response = await apiPost('/api/auth/register', JSON.stringify(payload));


      if (response.success) {
        console.log('✅ Register success:', response);
        navigate('/login');
      } else {
        console.error('❌ Register failed:', response.message || response.error);
        alert(response.message || 'Registration failed');
      }
    } catch (err) {
      console.error('⚠️ Error connecting to backend:', err);
      alert('Error connecting to server');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack sx={{ mb: 2, alignItems: 'center' }}>
        <Typography variant="subtitle1">Sign up with Email address</Typography>
      </Stack>

      {/* ---- Name Fields ---- */}
      <Grid container spacing={{ xs: 0, sm: 2 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomFormControl fullWidth>
            <InputLabel htmlFor="first-register">First Name</InputLabel>
            <OutlinedInput
              id="first-register"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </CustomFormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomFormControl fullWidth>
            <InputLabel htmlFor="last-register">Last Name</InputLabel>
            <OutlinedInput
              id="last-register"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </CustomFormControl>
        </Grid>
      </Grid>

      {/* ---- Email ---- */}
      <CustomFormControl fullWidth>
        <InputLabel htmlFor="email-register">Email Address</InputLabel>
        <OutlinedInput
          id="email-register"
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </CustomFormControl>

      {/* ---- Password ---- */}
      <CustomFormControl fullWidth>
        <InputLabel htmlFor="password-register">Password</InputLabel>
        <OutlinedInput
          id="password-register"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={(e) => {
            setFormData({ ...formData, password: e.target.value });
            changePassword(e.target.value);
          }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="large"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          required
        />
      </CustomFormControl>

      {/* ---- Password Strength Meter ---- */}
      {strength !== 0 && (
        <FormControl fullWidth>
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" sx={{ gap: 2, alignItems: 'center' }}>
              <Box sx={{ width: 85, height: 8, borderRadius: '7px', bgcolor: level?.color }} />
              <Typography variant="subtitle1" sx={{ fontSize: '0.75rem' }}>
                {level?.label}
              </Typography>
            </Stack>
          </Box>
        </FormControl>
      )}

      {/* ---- Terms ---- */}
      <FormControlLabel
        control={<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} color="primary" required />}
        label={
          <Typography variant="subtitle1">
            Agree with&nbsp;
            <Typography variant="subtitle1" component={Link} to="#">
              Terms & Conditions.
            </Typography>
          </Typography>
        }
      />

      {/* ---- Submit ---- */}
      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button disableElevation fullWidth size="large" type="submit" variant="contained" color="secondary">
            Sign up
          </Button>
        </AnimateButton>
      </Box>
    </form>
  );
}
