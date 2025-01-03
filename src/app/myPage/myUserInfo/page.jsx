"use client"
import { Avatar, Box, Button, Container, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import useAuthStore from '../../../../store/authStore';
import axios from 'axios';
import Cookies from 'js-cookie'; // 쿠키 관리 라이브러리 사용

function MyUserInfo(props) {
  const [userProfile, setUserProfile] = useState({});
  const router = useRouter();

  const initialize = useAuthStore((state) => state.initialize);
  
  useEffect(() => {
    const token = Cookies.get('token');
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;

    //zustand에 토큰과 사용자 정보가 있으면 초기화, 아니면 경고창 
    if (token && user) {
      initialize({ user, token });
    } else {
      alert("로그인이 필요합니다.");
    }
  }, [initialize]);
  // 토큰 가져오기
  const token = useAuthStore((state) => state.token);  // zustand에서 token 값 가져오기

  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;

  // 회원 정보 (예시)
  // const userInfo = {
  //   name: '홍길동',
  //   nickname: '길동이',
  //   userId: 'honggildong123',
  //   profileImage: 'https://www.example.com/profile.jpg' // 프로필 이미지 URL
  // };


  const getProfile = async () => {

    try {
      const API_URL = `${LOCAL_API_BASE_URL}/users/profile`;
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`  // JWT 토큰을 Authorization header에 담아서 전송
        }
      });
      console.log(response);
      
      if(response.data.success){
        setUserProfile(response.data.data);
        // alert(response.data.message);
      } else{
        // alert(response.data.message);
      }

    } catch (error) {
      console.error(error);
      // alert("불러오기에 실패하였습니다.");
    }
  }



  useEffect(() => {
    if (token) {
      getProfile();  // token이 있으면 getProfile 호출
    }
  }, [token]);

  const handleModifyClick = () => {
    router.push("/myPage/myUserInfo/passwordCheck?action=update");  // 수정 페이지로 이동
  };
  const handleDeleteClick = () => {
    router.push("/myPage/myUserInfo/passwordCheck?action=delete");
  }

  const displayEmail = userProfile.email || userProfile.sns_email_kakao || userProfile.sns_email_naver || userProfile.sns_email_google;


  return (
    <Container maxWidth="sm"
        sx={{
          marginTop: "50px",
          marginRight:"auto",
          marginLeft:"auto"
        }}>
      <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
        {/* 프로필 사진 */}
        <Avatar
          alt="Profile Image"
          src={userProfile.profileImage}
          sx={{ width: 120, height: 120, margin: '0 auto' }}
        />
      </Box>

      <Box sx={{ marginBottom: 2 }}>
        {/* 이름 */}
        <Typography variant="h5" gutterBottom>
          {userProfile.username}
        </Typography>
        {/* 닉네임 */}
        <Typography variant="h6" color="textSecondary" gutterBottom>
          {userProfile.id}
        </Typography>
        {/* 아이디 */}
        <Typography variant="body1" color="textSecondary" gutterBottom>
          {displayEmail ? displayEmail : "이메일 정보 없음"}
        </Typography>
      </Box>

      <Box sx={{ marginTop: 4 }}>
        {/* 회원정보 수정 버튼 */}
        <Button variant="contained" color="primary" fullWidth sx={{ marginBottom: 2 }} onClick={handleModifyClick}>
          회원정보 수정
        </Button>
        {/* 회원 탈퇴하기 버튼 */}
        <Button variant="outlined" color="error" fullWidth onClick={handleDeleteClick}>
          회원 탈퇴하기
        </Button>
      </Box>
    </Container>
  );
};

export default MyUserInfo;
