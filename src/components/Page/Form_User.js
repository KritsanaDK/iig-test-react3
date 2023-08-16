import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { useLocalStorage } from "../Data/useLocalStorage";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const defaultTheme = createTheme();

function Form_User(props) {
  const [userInfo, setUserInfo] = useLocalStorage("json", []);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validationSchema = Yup.object().shape({
    tb_username:
      props.mode == "Register"
        ? Yup.string()
            .required("Username is required")
            .min(4, "Username must be at least 4 characters")
            .max(12, "Username must not exceed 12 characters")
            .matches(/^[a-zA-Z0-9_]*$/, "Invalid password")
        : Yup.string(),

    tb_fitstname: Yup.string()
      .required("Password is required")
      .max(60, "Password must be at least 6 characters"),

    tb_file:
      props.mode == "Register"
        ? Yup.mixed()
            .test("required", "photo is required", (value) => value.length > 0)
            .test("fileType", "Unsupported File Format", (value) => {
              return (
                value.length &&
                ["image/jpeg", "image/png", "image/jpg"].includes(value[0].type)
              );
            })
            .test("fileSize", "The file is too large", (value) => {
              if (!value.length) return true; // attachment is optional
              return value[0].size <= 1024 * 1024 * 5;
            })
        : Yup.mixed(),

    tb_password:
      props.mode == "Register"
        ? Yup.string()
            .required("Password is required")
            .min(6, "Password must be at least 6 characters")
            .test("Find 0-9", "The number is not order 0-9", (val) => {
              return !"0123456789".includes(val);
            })
            .test("Find a-z", "The alphabet is not order a-z", (val) => {
              return !"abcdefghijklmnopqrstuvwxyz".includes(val);
            })
            .test("Find A-Z", "The alphabet is not order A-Z", (val) => {
              return !"ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(val);
            })
        : Yup.string(),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tb_username: props.mode == "Update" ? userInfo[0].UserName : "",
      tb_fitstname: props.mode == "Update" ? userInfo[0].FirstName : "",
      tb_lastname: props.mode == "Update" ? userInfo[0].LastName : "",
    },
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data) => {
    let user = userInfo.length == 0 ? data.tb_username : userInfo[0].UserName;
    let pass = data.tb_password;
    let firstName = data.tb_fitstname;
    let lastname = data.tb_lastname;
    let file = data.tb_file;

    // console.log(file)

    const k_data = {
      user: user,
      pass: pass,
      f_name: firstName,
      l_name: lastname,
      file_name: file.length == 0 ? undefined : file[0].name,
    };

    if (props.mode == "Register") {
      console.log("Reg");
      console.log(k_data);
      axios
        .post("http://localhost:6180/reg_user", k_data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res.data);

          if (res.data.result == "ok") {
            // setUserInfo(localStorage.getItem("json"));
            setOpen(true);
          }
        })

        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("Update");
      console.log(k_data);

      axios
        .post("http://localhost:6180/update_user", k_data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res.data);

          if (res.data.result == "ok") {
            // setUserInfo(localStorage.getItem("json"));
            setOpen(true);
          }

          // return res.data;
        })

        .catch((err) => {
          console.log(err);
          return err;
        });
    }
  };

  const [selectedImage, setSelectedImage] = useState("");

  const previewImage = (e) => {
    const file = e.target.files[0];

    console.log(file);

    // if (e.target.files && e.target.files.length > 0) {
    //   setSelectedImage(URL.createObjectURL(e.target.files[0]));
    //   // setSelectedImage(e.target.files[0]);
    // }
  };

  useEffect(() => {
    console.log("useEffect");

    console.log(userInfo.length);
    console.log(userInfo[0]);
    console.log(props.mode);

    if (props.mode == "Register") {
      localStorage.clear();
    }

    props.mode == "Update"
      ? setSelectedImage(require("../../image/" + userInfo[0].file_name))
      : setSelectedImage("");
  }, []);

  return (
    <Container maxWidth={false}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {props.mode == "Register" ? "Register" : "Update"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.mode == "Register"
              ? "Register is completed"
              : "Update  is completed"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>

      <CssBaseline />

      <Grid
        container
        spacing={2}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Card sx={{ m: 12 }}>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            <CardContent>
              <Grid style={{ textAlign: "center" }}>
                <Typography component="h4" variant="h5">
                  <b>
                    {props.mode == "Register" ? "REGISTER" : "EDIT PROFILE"}
                  </b>
                </Typography>
              </Grid>

              <Grid style={{ textAlign: "left" }}>
                {props.mode == "Register" ? (
                  <div>
                    <TextField
                      required
                      id="tb_username"
                      label="User Name"
                      type="text"
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
                  </div>
                ) : (
                  <div>
                    <h2>{userInfo.UserName}</h2>
                  </div>
                )}
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
                />
                <Typography variant="inherit" color="textSecondary">
                  {errors.tb_password?.message}
                </Typography>
              </Grid>

              <Grid style={{ textAlign: "left" }}>
                <TextField
                  required
                  id="tb_fitstname"
                  label="First Name"
                  type="text"
                  fullWidth
                  margin="dense"
                  {...register("tb_fitstname")}
                  error={errors.tb_fitstname ? true : false}
                  inputProps={{
                    maxLength: 60,
                  }}
                />
                <Typography variant="inherit" color="textSecondary">
                  {errors.tb_fitstname?.message}
                </Typography>
              </Grid>

              <Grid style={{ textAlign: "left" }}>
                <TextField
                  required
                  id="tb_lastname"
                  label="Last Name"
                  type="text"
                  fullWidth
                  margin="dense"
                  {...register("tb_lastname")}
                  error={errors.tb_lastname ? true : false}
                  inputProps={{
                    maxLength: 60,
                  }}
                />
                <Typography variant="inherit" color="textSecondary">
                  {errors.tb_lastname?.message}
                </Typography>
              </Grid>

              <Grid style={{ textAlign: "center" }}>
                <TextField
                  required
                  id="tb_file"
                  type="file"
                  fullWidth
                  inputProps={{
                    accept: "image/jpeg, image/jpg, image/png, image/bmp",
                  }}
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

              <Grid style={{ textAlign: "left" }}>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    {props.mode == "Register" ? "Register" : "Update"}
                  </Button>
                </Box>
              </Grid>
            </CardContent>
          </Box>
        </Card>
      </Grid>

      {/* <Grid item sm={12}>
              <Box display="flex" justifyContent="flex-end">
                {Object.keys(userInfo).length !== 0 && (
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={() => {
                      localStorage.clear();
                      window.location.href = "/Login";
                    }}
                  >
                    Log Out
                  </Button>
                )}
              </Box>
            </Grid> */}
    </Container>
  );
}

export default Form_User;
