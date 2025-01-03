import React from "react";

const ChangePassword = () => {
  return <div>ChangePassword</div>;
};

export default ChangePassword;

// import { Stack } from "@mui/material";
// import React from "react";

// const ChangePassword = () => {
//   return <Stack sx={{ width: "100%", height: "100vh", bgcolor: "bgForm.black1", overflow: "hidden" }}>

// <Container maxWidth="xs">
//       <form onSubmit={handleSubmit(loginHandler)}>
//         <Grid container spacing={2} mt={3}>
//           <Grid item xs={12}>
//             <TextField
//               {...register("usernameOrEmail")}
//               variant="outlined"
//               label="Enter your username"
//               helperText={errors?.usernameOrEmail?.message}
//               error={!!errors.usernameOrEmail}
//               sx={{ borderColor: "primary" }}
//               fullWidth
//               autoComplete="off"
//             />
//           </Grid>

//           <Grid item xs={12}>
//             <TextField
//               {...register("password")}
//               label="Enter your password"
//               helperText={errors?.password?.message}
//               error={!!errors.password}
//               type={showPassword ? "text" : "password"}
//               fullWidth
//               autoComplete="off"
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton sx={{ color: "gray" }} onClick={showPasswordHandler} edge="end" aria-label="toggle password visibility">
//                       {showPassword ? <Visibility /> : <VisibilityOff />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//                 inputProps: { style: { color: "#fff", bgcolor: "gray" } },
//               }}
//             />
//           </Grid>
//         </Grid>

//         <LoadingButton
//           variant="contained"
//           sx={{
//             marginTop: 3,
//             ":disabled": { backgroundColor: theme.palette.secondary.main },
//           }}
//           type="submit"
//           fullWidth
//           loading={isLoading}
//         >
//           Login
//         </LoadingButton>
//       </form>
//     </Container>
//   </Stack>;
// };

// export default ChangePassword;
