"use client"


import React, { useEffect, useState } from "react";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import styles from "../Authentication.module.css"
import Image from "next/image";
import { useRouter } from "next/navigation";
import InputForm from "../../component/InputForm";
// zustand store 호출
import useAuthStore from '../../../../store/authStore';
import axios from "axios";



const SignInForm = () => {

  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL
  
  const router = useRouter();  // useRouter 초기화

  const { login } = useAuthStore(); // zustand login 함수 가져오기 

  const initialize = useAuthStore((state) => state.initialize);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  // 텍스트필드 초기화
  const initMvo = {
    id: "",
    password: ""
  }

  // 앱 초기화 시 쿠키에서 정보 가져오기
  useEffect(() => {
    initialize();
  }, [initialize]);

  //사용자 정보
  const [mvo, setMvo] = useState(initMvo);

  // 로그인 처리
  // 서버에서 sendRedirect로 넘어오는 값을 받아서 로그인 처리
  useEffect(() => {
    // 주소창에 있는 파라미터 가져와서 로그인 처리한다.
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");
    const id = searchParams.get("username");
    const email = searchParams.get("email");

    if(token && id && email){
        alert("로그인 성공");
        const user = {id, email}
        login(user, token); // zustand에서 상태관리
        router.push("/");
    }
  }, [login, router])

  function changeMvo(e) {
    const { name, value } = e.target;
    setMvo(prev => ({
        ...prev, [name]: value
    }));
  }

 // SignInForm.jsx (로그인 페이지)
function goServer() {
  axios.post(`${LOCAL_API_BASE_URL}/users/login`, mvo)
    .then(response => {
      const data = response.data;
      if (data.success) {
        login(data.data, data.token); // zustand
        // data.data -> { id: "ro", email: "...", ... }
        // data.token -> "some-jwt-token"
        router.push('/');
      } else {
        alert(data.message);
        setMvo(initMvo);
      }
    });
}

  
  // 회원가입 페이지로 이동
  const handleSignup = () => {
    router.push("/signUp");  // 회원가입 페이지로 이동
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };


  // 소셜 로그인 인증 엔드 포인트(redirect 주소)
  function handleKakaoLogin() {
    window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
  }
  function handleGoogleLogin(){
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  }
  function handleNaverLogin(){
    window.location.href = "http://localhost:8080/oauth2/authorization/naver";
  }

  return (
    <div className="authenticationBox">
      <Box
        component="main"
        sx={{
          maxWidth: "510px",
          ml: "auto",
          mr: "auto",
          padding: "50px 0 100px",
        }}
      >
        <Grid item xs={12} md={12} lg={12} xl={12} >
          <Box>
            <Typography as="h1" fontSize="28px" fontWeight="700" mb="5px">
              Sign In{" "}
              <Image
                src="/images/favicon.png"
                alt="favicon"
                className={styles.favicon}
                width={30}
                height={30}
              />
            </Typography>

            <Typography fontSize="15px" mb="30px">
              Already have an account?{" "}
              <Link
                href="/authentication/signUp"
                className="primaryColor text-decoration-none"
              >
                Sign up
              </Link>
            </Typography>
            <div className={styles.or}>
              <span>or</span>
            </div>

            <Box component="form" noValidate onSubmit={handleSubmit}>
              <Box
                sx={{
                  background: "#fff",
                  padding: "30px 20px",
                  borderRadius: "10px",
                  mb: "20px"
                }}
                className="bg-black"
              >
                <Grid container alignItems="center" spacing={2}>

                  <InputForm
                    label="아이디"
                    name='id'
                    value={mvo.id}
                    onChange={changeMvo}
                  />
                  <InputForm
                    label="비밀번호"
                    name='password'
                    value={mvo.password}
                    onChange={changeMvo}
                  />
                </Grid>
              </Box>

              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={6} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox value="allowExtraEmails" color="primary" />
                    }
                    label="Remember me."
                  />
                </Grid>

                <Grid item xs={6} sm={6} textAlign="end">
                  <Link
                    href="/authentication/forgotIdPw"
                    className="primaryColor text-decoration-none"
                  >
                    Forgot your password?
                  </Link>
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  textTransform: "capitalize",
                  borderRadius: "8px",
                  fontWeight: "500",
                  fontSize: "16px",
                  padding: "12px 10px",
                  color: "#fff !important",
                }}
                onClick={goServer}
              >
                Sign In
              </Button>
              

            </Box>
            <Box
                sx={{
                  background: "#fff",
                  padding: "30px 20px",
                  borderRadius: "10px",
                  mb: "20px",
                  mt: "20px",
                  height:"auto"
                }}
                className="bg-black"
              >
                
              <Box
                sx={{
                  display:"flex",
                  flexDirection:"row",
                  justifyContent: "center"
                }}
              >
                <Button sx={{ padding:0, mr:"5%" }} onClick={handleKakaoLogin}>
                  <Image src="/login_icons/btn_kakao.svg" alt="kakao_icon" width={50} height={50}/>
                </Button>
                <Button sx={{ padding:0, mr:"5%" }} onClick={handleGoogleLogin}>
                  <Image src="/login_icons/btn_google.svg" alt="google_icon" width={40} height={40}/>
                </Button>
                <Button sx={{ padding:0 }} onClick={handleNaverLogin}>
                  <Image src="/login_icons/btn_naver_circle.png" alt="naver_icon" width={50} height={50}/>
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Box>
    </div>
  );
};

export default SignInForm;