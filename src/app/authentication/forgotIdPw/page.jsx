"use client";

import React, { useState } from "react";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import { Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import styles from "../Authentication.module.css"
import Image from "next/image";
import InputForm from "@/app/component/InputForm";



// const handleEmailChange = () => {

// }

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState();
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  return (
    <>
      <div className="authenticationBox" style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
        <Box
          component="main"
          sx={{
            maxWidth: "510px",
            ml: "0",
            mr: "50px",
            padding: "50px 0 100px",
          }}
        >
          <Grid item xs={6} md={6} lg={6} xl={6}>
            <Box>
              <Typography as="h1" fontSize="28px" fontWeight="700" mb="5px">
                Forgot ID?{" "}
                <Image
                  src="/images/favicon.png"
                  alt="favicon"
                  className={styles.favicon}
                  width={30}
                  height={30}
                />
              </Typography>

              <Typography fontSize="15px" mb="30px">
                Enter your email and we′ll send you instructions to reset your
                password
              </Typography>

              <Box component="form" noValidate onSubmit={handleSubmit}>
                <Box
                  sx={{
                    background: "#fff",
                    padding: "30px 20px",
                    borderRadius: "10px",
                    mb: "20px",
                  }}
                  className="bg-black"
                >
                  <Grid container alignItems="center" spacing={2}>
                    <InputForm
                      label="이메일"
                      type="email"
                      name="email"
                      value={email}
                      // onChange={handleEmailChange}
                    />
                  </Grid>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 1,
                    textTransform: "capitalize",
                    borderRadius: "8px",
                    fontWeight: "500",
                    fontSize: "16px",
                    padding: "12px 10px",
                    color: "#fff !important"
                  }}
                >
                  Send Reset Link
                </Button>
              </Box>

              <Box as="div" textAlign="center" mt="20px">
                <Link
                  href="/authentication/sign-in/"
                  className="primaryColor text-decoration-none"
                >
                  <i className="ri-arrow-left-s-line"></i> Back to Sign in
                </Link>
              </Box>
            </Box>
          </Grid>
        </Box>
        <Divider
            orientation="vertical"
            flexItem
            sx={{ color: "#777E90", mx: 2 }}
          />
        <Box
          component="main"
          sx={{
            maxWidth: "510px",
            ml: "50px",
            mr: "0",
            padding: "50px 0 100px",
          }}
        >

          <Grid item xs={6} md={6} lg={6} xl={6}>
            <Box>
              <Typography as="h1" fontSize="28px" fontWeight="700" mb="5px">
                Forgot Password?{" "}
                <Image
                  src="/images/favicon.png"
                  alt="favicon"
                  className={styles.favicon}
                  width={30}
                  height={30}
                />
              </Typography>

              <Typography fontSize="15px" mb="30px">
                Enter your email and we′ll send you instructions to reset your
                password
              </Typography>

              <Box component="form" noValidate onSubmit={handleSubmit}>
                <Box
                  sx={{
                    background: "#fff",
                    padding: "30px 20px",
                    borderRadius: "10px",
                    mb: "20px",
                  }}
                  className="bg-black"
                >
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12}>
                      <Typography
                        component="label"
                        sx={{
                          fontWeight: "500",
                          fontSize: "14px",
                          mb: "10px",
                          display: "block",
                        }}
                      >
                        Email
                      </Typography>

                      <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        InputProps={{
                          style: { borderRadius: 8 },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 1,
                    textTransform: "capitalize",
                    borderRadius: "8px",
                    fontWeight: "500",
                    fontSize: "16px",
                    padding: "12px 10px",
                    color: "#fff !important"
                  }}
                >
                  Send Reset Link
                </Button>
              </Box>

              <Box as="div" textAlign="center" mt="20px">
                <Link
                  href="/authentication/sign-in/"
                  className="primaryColor text-decoration-none"
                >
                  <i className="ri-arrow-left-s-line"></i> Back to Sign in
                </Link>
              </Box>
            </Box>
          </Grid>
        </Box>
      </div>
    </>
  );
};

export default ForgotPasswordForm;
