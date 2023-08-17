import React, { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { useLocalStorage } from "../Data/useLocalStorage";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

function Form_User(props) {
  const [userInfo] = useLocalStorage("json", []);
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("sm");
  const [pathName, setPathName] = useState(
    window.location.pathname.replace("/", "")
  );
  const fileInput = useRef();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validationSchema = Yup.object().shape({
    tb_username:
      pathName === "Register"
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
      pathName === "Register"
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
      pathName === "Register"
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
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tb_username: pathName === "Update" ? userInfo[0].UserName : "",
      tb_fitstname: pathName === "Update" ? userInfo[0].FirstName : "",
      tb_lastname: pathName === "Update" ? userInfo[0].LastName : "",
    },
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data) => {
    let user = userInfo.length === 0 ? data.tb_username : userInfo[0].UserName;
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
      file_name: file.length === 0 ? undefined : file[0].name,
      file: file.length === 0 ? undefined : file[0],
    };

    if (pathName === "Register") {
      console.log("Reg");
      console.log(k_data);
      axios
        .post("http://localhost:6180/reg_user", k_data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res.data);

          if (res.data.result === "ok") {
            // setUserInfo(localStorage.getItem("json"));
            handleClickOpen();

            reset();
            setSelectedImage("");
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
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res.data);

          if (res.data.result === "ok") {
            // setUserInfo(localStorage.getItem("json"));
            handleClickOpen();
          } else {
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

    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]));
      // setSelectedImage(e.target.files[0]);
    }
  };

  useEffect(() => {
    console.log("useEffect");

    if (pathName === "Register") {
      localStorage.clear();
    }

    pathName === "Update"
      ? setSelectedImage("http://127.0.0.1:6180/" + userInfo[0].file_name)
      : setSelectedImage("");
  }, []);

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
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={fullWidth}
        maxWidth={maxWidth}
      >
        <DialogTitle id="alert-dialog-title">
          <b>{pathName == "Register" ? "Register" : "Update"}</b>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {pathName == "Register"
              ? "Register is completed"
              : "Update  is completed"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>

      {pathName !== "Register" && (
        <Grid
          container
          direction="row"
          justifyContent="right"
          spacing={2}
          style={{
            display: "flex",
            justifyContent: "right",
          }}
        >
          <Grid item xs={4} m={2}>
            <Button
              type="button"
              variant="contained"
              color="secondary"
              sx={{ borderRadius: 28 }}
              onClick={() => {
                localStorage.clear();
                window.location.href = "/Login";
              }}
            >
              <b>Log Out</b>
            </Button>
          </Grid>
        </Grid>
      )}

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
        <Grid item xs={4}>
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
                    <b>
                      {pathName === "Register" ? "REGISTER" : "EDIT PROFILE"}
                    </b>
                  </Typography>
                </Grid>

                <Grid style={{ textAlign: "left" }}>
                  {pathName == "Register" ? (
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

                <Grid style={{ textAlign: "left" }}>
                  {/* <TextField
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
                  /> */}
                  <Grid>
                    <input
                      ref={fileInput}
                      id="tb_file"
                      type="file"
                      accept=".png, .jpg, .jpeg"
                      {...register("tb_file")}
                      style={{
                        paddingTop: "20px",
                        paddingBottom: "20px",
                      }}
                      onChange={previewImage}
                    />
                  </Grid>
                  <Grid>
                    <img
                      src={selectedImage}
                      alt="Preview"
                      loading="lazy"
                      height="200"
                      style={{
                        paddingBottom: "20px",
                      }}
                    />
                  </Grid>

                  <Typography variant="inherit" color="#dd2c00">
                    {errors.tb_file?.message}
                  </Typography>
                </Grid>

                <Grid style={{ textAlign: "center" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="info"
                    sx={{ borderRadius: 28 }}
                    style={{ width: "150px" }}
                  >
                    <b>{pathName === "Register" ? "Register" : "Update"}</b>
                  </Button>
                </Grid>
              </CardContent>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Form_User;
