import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();


function Login() {

  const validationSchema = Yup.object().shape({
    tb_username: Yup.string()
      .required("Username is required")
      .min(4, "Username must be at least 4 characters")
      .max(12, "Username must not exceed 12 characters"),
    tb_username: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data) => {

    let user = data.tb_username;
    let pass = data.tb_password;

    const param = { user: user, pass: pass };
    console.log(param)

    axios
      .post("http://localhost:6180/logIn", param, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data[0])
      .then((json) => {
        console.log(json);
        let json_data = JSON.stringify(json, null, 2);
        localStorage.setItem("json", json_data);

        window.location.href = "/Register";
      })
      .catch((err) => {
        console.log(err);
      });


  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">

        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex',
          }}
        >
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="tb_username"
                label="User Name"
                fullWidth
                margin="dense"
                {...register("tb_username")}
                error={errors.tb_username ? true : false}
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.tb_username?.message}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="tb_password"
                label="Password"
                type="password"
                fullWidth
                margin="dense"
                {...register("tb_password")}
                error={errors.tb_password ? true : false}
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.tb_password?.message}
              </Typography>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>

          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default Login