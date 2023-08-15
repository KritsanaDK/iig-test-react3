import { useState } from "react";
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

const defaultTheme = createTheme();

function Register() {

  const validationSchema = Yup.object().shape({
    tb_username: Yup.string()
      .required("Username is required")
      .min(4, "Username must be at least 4 characters")
      .max(12, "Username must not exceed 12 characters"),
    tb_password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),

    tb_fitstname: Yup.string()
      .required("Password is required")
      .max(60, "Password must be at least 6 characters"),

    tb_file: Yup.mixed()
      .test("required", "photo is required", value => value.length > 0)
      .test("fileType", "Unsupported File Format", (value) => {
        return value.length && ["image/jpeg", "image/png", "image/jpg"].includes(value[0].type)
      }).test("fileSize", "The file is too large", (value) => {
        if (!value.length) return true // attachment is optional
        return value[0].size <= 1024 * 1024 * 5
      })
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

    // console.log(data)

    let user = data.tb_username;
    let pass = data.tb_password;
    let firstName = data.tb_fitstname;
    let lastname = data.tb_lastname;
    let file = data.tb_file;

    const k_data = { user: user, pass: pass, f_name: firstName, l_name: lastname, path_file: file[0].name };
    console.log(k_data)


    // reg_user(user, pass, f_name, l_name, path_file)

    axios
      .post("http://localhost:6180/reg_user", k_data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((res) => res.data[0])
      .then((json) => {
        console.log(json)

        // window.location.href = "/Register";
      })
      .catch((err) => {
        console.log(err);
      });


  };

  const [selectedImage, setSelectedImage] = useState("https://i.imgur.com/ndu6pfe.png");

  const previewImage = (e) => {
    const file = e.target.files[0];


    console.log(file)

    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]));
      // setSelectedImage(e.target.files[0]);
    }


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
            Register
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="tb_username"
                label="User Name"
                type="text"
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

            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="tb_fitstname"
                label="First Name"
                type="text"
                fullWidth
                margin="dense"
                {...register("tb_fitstname")}
                error={errors.tb_fitstname ? true : false}
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.tb_fitstname?.message}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="tb_lastname"
                label="Last Name"
                type="text"
                fullWidth
                margin="dense"
                {...register("tb_lastname")}
                error={errors.tb_lastname ? true : false}
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.tb_lastname?.message}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="tb_file"
                type="file"
                fullWidth
                inputProps={{ accept: 'image/jpeg, image/png' }}
                onChange={previewImage}
                margin="dense"
                {...register("tb_file")}
                error={errors.tb_file ? true : false}
              />

              <img
                src={selectedImage}
                alt="Preview"
                loading="lazy"
                height="200"
              />

              <Typography variant="inherit" color="textSecondary">
                {errors.tb_file?.message}
              </Typography>

            </Grid>




            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>

          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default Register