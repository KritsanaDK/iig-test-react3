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

const defaultTheme = createTheme();

function Form_User(props) {
  const [userInfo, setUserInfo] = useLocalStorage(props.json, {});
  const [file, setFile] = useState();

  const [open, setOpen] = useState(false);
  const [aletTitle, setAlertTitle] = useState("");
  const [alertMsg, setAlertMsg] = useState("");

  const validationSchema = Yup.object().shape({
    tb_username: Yup.string()
      .required("Username is required")
      .min(4, "Username must be at least 4 characters")
      .max(12, "Username must not exceed 12 characters")
      .matches(/^[a-zA-Z0-9_]*$/, "Invalid password"),

    tb_fitstname: Yup.string()
      .required("Password is required")
      .max(60, "Password must be at least 6 characters"),

    tb_file:
      props.json == ""
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
        : null,

    tb_password:
      props.json == ""
        ? Yup.string()
            .required("Password is required")
            .min(6, "Password must be at least 6 characters")
        : null,
  });
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tb_username: userInfo.Username,
      tb_fitstname: userInfo.FirstName,
      tb_lastname: userInfo.LastName,
      tb_file: userInfo.Path_file,
    },
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    // console.log(data)

    let user = data.tb_username;
    let pass = data.tb_password;
    let firstName = data.tb_fitstname;
    let lastname = data.tb_lastname;
    let file = data.tb_file;

    console.log(file);

    setFile(file);

    const k_data = {
      user: user,
      pass: pass,
      f_name: firstName,
      l_name: lastname,
      path_file: file[0].name,
    };

    if (Object.keys(userInfo).length === 0) {
      axios
        .post("http://localhost:6180/reg_user", k_data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => res.data[0])
        .then((json) => {
          console.log(json);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      let check =
        data.tb_password &&
        (await axios
          .post("http://localhost:6180/check_pass", k_data, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res) => res.data)
          .then((json) => {
            console.log(json);
            if (json.length >= 1) {
              return true;
            } else {
              return false;
            }
          })
          .catch((err) => {
            console.log(err);
          }));

      console.log(check);

      if (check) {
        setOpen(true);
        setAlertTitle("Password : Warning");
        setAlertMsg("Password is duplicate from 5 time ago");
      }
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

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    console.log(userInfo);

    Object.keys(userInfo).length !== 0
      ? setSelectedImage(require("../../image/" + userInfo.Path_file))
      : setSelectedImage("");
  }, []);

  return (
    <div>
      <div>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{aletTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {alertMsg}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>OK</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        {" "}
        <Container maxWidth={false}>
          <Stack direction="row" spacing={2}>
            <Grid item sm={12}>
              <Box
                sx={{
                  marginTop: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex",
                }}
              >
                <Typography variant="h4">
                  <b>
                    {Object.keys(userInfo).length === 0
                      ? "REGISTER"
                      : "EDIT PROFILE"}
                  </b>
                </Typography>
                <Box
                  component="form"
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  sx={{ mt: 1 }}
                >
                  <Grid item xs={12} sm={6}>
                    {Object.keys(userInfo).length === 0 ? (
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
                            readOnly:
                              Object.keys(userInfo).length === 0 ? false : true,
                            maxLength: 12,
                          }}
                        />
                        <Typography variant="inherit" color="textSecondary">
                          {errors.tb_username?.message}
                        </Typography>
                      </div>
                    ) : (
                      <div>
                        <h2>{userInfo.Username}</h2>
                      </div>
                    )}
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
                      inputProps={{
                        maxLength: 60,
                      }}
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
                      inputProps={{
                        maxLength: 60,
                      }}
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
                      inputProps={{ accept: "image/jpeg, image/png" }}
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

                  <Grid item xs={12} sm={6}>
                    <Box display="flex" justifyContent="flex-end">
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                      >
                        {Object.keys(userInfo).length === 0
                          ? "Register"
                          : "Update"}
                      </Button>
                    </Box>
                  </Grid>
                </Box>
              </Box>
            </Grid>

            <Grid item sm={12}>
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
            </Grid>
          </Stack>
        </Container>
      </div>
    </div>
  );
}

export default Form_User;
