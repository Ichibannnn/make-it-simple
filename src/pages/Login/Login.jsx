import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import background from "../../assets/svg/dotek-login-illustration4.svg";
import { LoadingButton } from "@mui/lab";
import { theme } from "../../theme/theme";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import logo from "../../assets/svg/dotek-login.svg";
import misLogo from "../../assets/images/misLogo.png";

import { signIn } from "../../features/auth/authSlice";
import { useSignInMutation } from "../../features/login/loginSlice";
import { setUserDetails } from "../../features/user/userSlice";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ReusableAlert from "../../hooks/ReusableAlert";

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
          <Box
            sx={{ height: "full", width: "100%", padding: 4 }}
            textAlign="center"
          >
            <Typography mt={5} color="white" fontWeight="bold" variant="h3">
              {" "}
              WELCOME!
            </Typography>
            <Typography color="white" fontSize="sm">
              One TEAM One RDF
            </Typography>
            <img src={background} alt="background" className="login-svg" />
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
          <Stack
            spacing={0}
            direction="column"
            sx={{ width: "100%" }}
            textAlign="center"
          >
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
      <Box
        zIndex="1"
        borderRadius="10px 0 0 10px"
        mt={6}
        flexDirection="column"
        display="flex"
        justifyContent="center"
      >
        <Box justifyContent="center" display="flex">
          <img
            src={misLogo}
            alt="logo"
            loading="lazy"
            style={{ width: "10%", height: "100%" }}
          />
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
  // const [isLoading, setIsLoading] = useState(false);

  const [logIn, { isLoading }] = useSignInMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({
    severity: "",
    title: "",
    description: "",
  });

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const {
    register,
    handleSubmit,
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
      const { token, ...user } = res.value;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch(signIn());
      dispatch(setUserDetails(user));

      navigate("/user-management/user-account", { replace: true });
      window.location.reload(false);
      setAlertData({
        severity: "success",
        title: "Success",
        description: "Welcome to Make It Simple, Fresh Morning!",
      });
      setShowAlert(true);
    } catch (error) {
      console.log("Error", error);
      if (error) {
        setAlertData({
          severity: "error",
          title: "Error!",
          description: `${error.data.error.message}`,
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
              // onChange={(event) => {
              //   setUsername(event.target.value);
              // }}
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
              // onChange={(event) => {
              //   setPassword(event.target.value);
              // }}
              fullWidth
              autoComplete="off"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      sx={{ color: "gray" }}
                      onClick={showPasswordHandler}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
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
      {/* <Stack
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button onClick={() => dispatch(increment())}>Increment</Button>
        <Typography color="white">{count}</Typography>
        <Button onClick={() => dispatch(decrement())}>Decrement</Button>
      </Stack> */}
      {showAlert && (
        <ReusableAlert
          severity={alertData.severity}
          title={alertData.title}
          description={alertData.description}
          onClose={handleAlertClose}
        />
      )}
      {/* <ChangePassword
        open={changePasswordModalOpen}
        storedPassword={storedPassword}
        setChangePasswordModalOpen={setChangePasswordModalOpen}
        userId={userId}
        setUsername={setUsername}
        setPassword={setPassword}
      /> */}
    </Container>
  );
};
