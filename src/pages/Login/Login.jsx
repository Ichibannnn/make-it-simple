import React, { useState } from "react";
import { useEffect } from "react";
import { Box, Container, Dialog, DialogContent, Grid, IconButton, InputAdornment, Paper, Stack, TextField, Typography, useMediaQuery } from "@mui/material";
import { CheckCircle, CloseOutlined, Visibility, VisibilityOff } from "@mui/icons-material";

import { theme } from "../../theme/theme";
import { LoadingButton } from "@mui/lab";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import logo from "../../assets/svg/dotek-login.svg";
import misLogo from "../../assets/images/misLogo.png";
import background from "../../assets/svg/dotek-login-illustration4.svg";

import { signIn } from "../../features/auth/authSlice";
import { useSignInMutation } from "../../features/login/loginSlice";
import { setUserDetails } from "../../features/user_management_api/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import useDisclosure from "../../hooks/useDisclosure";
import ReusableAlert from "../../hooks/ReusableAlert";
import { Toaster, toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { notificationApi } from "../../features/api_notification/notificationApi";
import { useChangeUserPasswordMutation } from "../../features/user_management_api/user/userApi";
import { concernApi } from "../../features/api_request/concerns/concernApi";
import { concernIssueHandlerApi } from "../../features/api_ticketing/issue_handler/concernIssueHandlerApi";
import { ticketApprovalApi } from "../../features/api_ticketing/approver/ticketApprovalApi";
import { closingTicketApi } from "../../features/api_ticketing/receiver/closingTicketApi";
import { concernReceiverApi } from "../../features/api_request/concerns_receiver/concernReceiverApi";

const Login = () => {
  const hideLoginForm = useMediaQuery("(max-width: 958px)");

  return (
    <Stack
      display="flex"
      sx={{
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
        bgcolor: "bgForm.black1",
        overflow: "hidden",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={-5} mt={10}>
        <Paper
          elevation={6}
          className="paper-color"
          sx={{
            display: hideLoginForm ? "none" : "flex",
            width: "32rem",
            height: "33rem",
          }}
        >
          <Box sx={{ height: "full", width: "100%", padding: 4 }} textAlign="center">
            <Typography mt={5} color="white" fontWeight="bold" variant="h3">
              {" "}
              WELCOME!
            </Typography>
            <Typography color="white" fontSize="sm">
              One TEAM One RDF
            </Typography>
            <img src={background} alt="background" className="svg-styling" />
          </Box>
        </Paper>
        <Paper
          className="login-paper"
          elevation={6}
          sx={{
            width: 450,
            height: 480,
            padding: 4,
          }}
        >
          <Stack spacing={0} direction="column" sx={{ width: "100%" }} textAlign="center">
            <Box p={0} zIndex="100">
              <img src={logo} alt="dotek-icon" className="login-icon" />
            </Box>
            <Typography color="white" fontWeight="bold" variant="h5">
              {" "}
              Sign in your Account
            </Typography>
            <Typography color="gray" fontSize="sm">
              Management Information System
            </Typography>
            <LoginForm />
          </Stack>
        </Paper>
      </Stack>
      <Box zIndex="1" borderRadius="10px 0 0 10px" mt={6} flexDirection="column" display="flex" justifyContent="center">
        <Box justifyContent="center" display="flex">
          <img src={misLogo} alt="logo" loading="lazy" style={{ width: "10%", height: "100%" }} />
        </Box>
        <Typography fontSize="10px" color="gray" textAlign="center">
          &#169; 2023 Powered by <br /> Management Information System
        </Typography>
      </Box>
    </Stack>
  );
};

export default Login;

const schema = yup.object().shape({
  usernameOrEmail: yup.string().required().label("Username"),
  password: yup.string().required().label("Password"),
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [changePasswordDetails, setChangePasswordDetails] = useState([]);

  const [logIn, { isLoading }] = useSignInMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({
    severity: "",
    title: "",
    description: "",
    autoHideDuration: 2000,
  });

  const { open, onToggle, onClose } = useDisclosure();

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  const loginHandler = async (data) => {
    try {
      const res = await logIn(data).unwrap();

      // console.log("Response: ", res);
      const { token, ...user } = res.value;

      // console.log("Token: ", token);
      // console.log("User: ", user);

      if (res?.value?.isPasswordChanged === null) {
        setChangePasswordDetails(res);
        onToggle();
        reset();
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));

        dispatch(signIn());
        dispatch(setUserDetails(user));

        dispatch(notificationApi.util.resetApiState());
        dispatch(concernApi.util.resetApiState());
        dispatch(concernReceiverApi.util.resetApiState());
        dispatch(concernIssueHandlerApi.util.resetApiState());
        dispatch(ticketApprovalApi.util.resetApiState());
        dispatch(closingTicketApi.util.resetApiState());

        setAlertData({
          severity: "success",
          title: "Success",
          description: "Welcome to Make It Simple, Fresh Morning!",
        });
        setShowAlert(true);
        navigate("/overview", { replace: true });

        // setTimeout(() => {
        //   console.log("Checked");
        // }, 300);
      }
    } catch (error) {
      console.log("Error", error);
      if (error) {
        setAlertData({
          severity: "error",
          title: "Error!",
          description: `${error.data.error.message}`,
          autoHideDuration: 2000,
        });
        setShowAlert(true);
      }
    }
  };

  const showPasswordHandler = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="xs">
      <form onSubmit={handleSubmit(loginHandler)}>
        <Grid container spacing={2} mt={3}>
          <Grid item xs={12}>
            <TextField
              {...register("usernameOrEmail")}
              variant="outlined"
              label="Enter your username"
              helperText={errors?.usernameOrEmail?.message}
              error={!!errors.usernameOrEmail}
              sx={{ borderColor: "primary" }}
              fullWidth
              autoComplete="off"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              {...register("password")}
              label="Enter your password"
              helperText={errors?.password?.message}
              error={!!errors.password}
              type={showPassword ? "text" : "password"}
              fullWidth
              autoComplete="off"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton sx={{ color: "gray" }} onClick={showPasswordHandler} edge="end" aria-label="toggle password visibility">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
                inputProps: { style: { color: "#fff", bgcolor: "gray" } },
              }}
            />
          </Grid>
        </Grid>

        <LoadingButton
          variant="contained"
          sx={{
            marginTop: 3,
            ":disabled": { backgroundColor: theme.palette.secondary.main },
          }}
          type="submit"
          fullWidth
          loading={isLoading}
        >
          Login
        </LoadingButton>
      </form>

      {showAlert && (
        <ReusableAlert
          severity={alertData.severity}
          title={alertData.title}
          description={alertData.description}
          autoHideDuration={alertData.autoHideDuration}
          onClose={handleAlertClose}
        />
      )}

      <ChangePassword open={open} onClose={onClose} changePasswordDetails={changePasswordDetails} />
    </Container>
  );
};

export const ChangePassword = ({ changePasswordDetails, open, onClose }) => {
  // console.log("User Name: ", changePasswordDetails.value.username);

  const [changeUserPassword, { isSuccess: isPostSuccess }] = useChangeUserPasswordMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changePasswordSchema = yup.object().shape({
    id: yup.string().nullable(),
    current_Password: yup.string().required().label("Current Password"),
    new_Password: yup.string().required().label("New Password"),
    confirm_Password: yup.string().required().label("Confirm Password"),
  });

  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      id: null,
      current_Password: "",
      new_Password: "",
      confirm_Password: "",
    },
  });

  const onChangePasswordForm = (data) => {
    const payload = {
      id: changePasswordDetails?.value.id,
      current_Password: data.current_Password,
      new_Password: data.new_Password,
      confirm_Password: data.confirm_Password,
    };

    const { token, ...user } = changePasswordDetails.value;

    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user", JSON.stringify(user));

    dispatch(setUserDetails(user));

    changeUserPassword(payload)
      .unwrap()
      .then(() => {
        navigate("/overview", { replace: true });
        setTimeout(
          () =>
            toast.success("Success!", {
              description: "Password has been changed!",
              duration: 1500,
            }),
          300
        );
      })
      .catch((error) => {
        toast.error("Error!", {
          description: error.data.error.message,
          duration: 1500,
        });
      });
  };

  const onCloseAction = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (changePasswordDetails) {
      setValue("id", changePasswordDetails?.value?.id);
    }
  }, [changePasswordDetails]);

  // useEffect(() => {}, [input]);

  return (
    <div>
      <Dialog fullWidth maxWidth="xs" open={open}>
        <Toaster richColors position="top-right" closeButton />
        <IconButton
          aria-label="close"
          onClick={onCloseAction}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseOutlined />
        </IconButton>
        <DialogContent>
          <Stack
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography fontWeight="bold" variant="h5">
              Change your password
            </Typography>
            <Typography color="gray" fontSize="sm">
              To change your password, please fill in the fields below.
            </Typography>
          </Stack>

          <form onSubmit={handleSubmit(onChangePasswordForm)}>
            <Stack sx={{ marginTop: 3, padding: "5px", gap: 1.5 }}>
              <Controller
                control={control}
                name="current_Password"
                render={({ field: { ref, value, onChange } }) => {
                  return (
                    <TextField
                      inputRef={ref}
                      size="medium"
                      value={value}
                      label="Current Password"
                      type="password"
                      onChange={onChange}
                      fullWidth
                      autoComplete="off"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {changePasswordDetails?.value?.username === watch("current_Password") ? <CheckCircle color="success" /> : ""}
                          </InputAdornment>
                        ),
                      }}
                    />
                  );
                }}
              />

              <Controller
                control={control}
                name="new_Password"
                render={({ field: { ref, value, onChange } }) => {
                  return (
                    <TextField
                      inputRef={ref}
                      size="medium"
                      value={value}
                      label="New Password"
                      type="password"
                      onChange={onChange}
                      fullWidth
                      autoComplete="off"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {watch("new_Password") === watch("confirm_Password") && watch("new_Password") !== null && watch("confirm_Password") ? (
                              <CheckCircle color="success" />
                            ) : (
                              ""
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                  );
                }}
              />

              <Controller
                control={control}
                name="confirm_Password"
                render={({ field: { ref, value, onChange } }) => {
                  return (
                    <TextField
                      inputRef={ref}
                      size="medium"
                      value={value}
                      label="Confirm Password"
                      type="password"
                      onChange={onChange}
                      fullWidth
                      autoComplete="off"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {watch("new_Password") === watch("confirm_Password") && watch("new_Password") !== null && watch("confirm_Password") ? (
                              <CheckCircle color="success" />
                            ) : (
                              ""
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                  );
                }}
              />
            </Stack>

            <Stack width="100%" padding={2}>
              <LoadingButton
                type="submit"
                variant="contained"
                disabled={
                  changePasswordDetails?.value?.username !== watch("current_Password") ||
                  !watch("new_Password") ||
                  !watch("confirm_Password") ||
                  watch("new_Password") !== watch("confirm_Password")
                }
                sx={{
                  ":disabled": {
                    backgroundColor: theme.palette.secondary.main,
                    color: "black",
                  },
                }}
                size="small"
              >
                Change Password
              </LoadingButton>
            </Stack>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
