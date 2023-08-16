import React, { useState } from "react";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

function LoginPage() {
  const [logIn, setLogIn] = useState(false);

  const validationSchema = Yup.object().shape({
    tb_username: Yup.string()
      .required("Username is required")
      .min(4, "Username must be at least 4 characters")
      .max(12, "Username must not exceed 12 characters"),
    tb_password: Yup.string()
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
    // console.log(param);

    axios
      .post("http://localhost:6180/logIn", param, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => res.data)
      .then((json) => {
        console.log(json);

        if (json.length == 1) {
          setLogIn(false);
          let json_data = JSON.stringify(json, null, 2);
          console.log(json_data);
          localStorage.setItem("json", json_data);
          window.location.href = "/Update";
        } else {
          setLogIn(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container
      component="main"
      maxWidth={false}
      style={{
        background: "#e0f2f1",
        height: "100vh",
        margin: "0px",
      }}
    >
      <Grid
        container
        direction="row"
        justifyContent="center"
        spacing={2}
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid xs={4}>
          <Card>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              sx={{ mt: 1 }}
            >
              <CardContent>
                <Grid style={{ textAlign: "center" }}>
                  <Typography component="h4" variant="h5">
                    <b>LOGIN</b>
                  </Typography>
                </Grid>

                <Grid style={{ textAlign: "left" }}>
                  <TextField
                    required
                    id="tb_username"
                    label="User Name"
                    fullWidth
                    margin="dense"
                    {...register("tb_username")}
                    error={errors.tb_username ? true : false}
                    inputProps={{
                      maxLength: 12,
                    }}
                  />
                  <Typography variant="inherit" color="textSecondary">
                    {errors.tb_username?.message}
                  </Typography>
                </Grid>

                <Grid style={{ textAlign: "left" }}>
                  <TextField
                    required
                    id="tb_password"
                    label="Password"
                    type="password"
                    fullWidth
                    margin="dense"
                    {...register("tb_password")}
                    error={errors.tb_password ? true : false}
                    // value={"Password12346"}
                  />
                  <Typography variant="inherit" color="textSecondary">
                    {errors.tb_password?.message}
                  </Typography>
                </Grid>

                <Grid style={{ textAlign: "center" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    sx={{ borderRadius: 28 }}
                    style={{ width: "150px" }}
                  >
                    Login
                  </Button>
                </Grid>

                <Grid style={{ textAlign: "right" }}>
                  <Grid>
                    <Link
                      href="/Register"
                      variant="body2"
                      onClick={() => {
                        localStorage.clear();
                      }}
                    >
                      Register
                    </Link>
                  </Grid>
                </Grid>

                {logIn && (
                  <Grid style={{ textAlign: "center" }}>
                    <Typography variant="inherit" color="error">
                      Login fail
                    </Typography>
                  </Grid>
                )}
              </CardContent>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default LoginPage;
