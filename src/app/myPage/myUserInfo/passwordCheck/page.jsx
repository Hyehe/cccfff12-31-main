"use client"
import InputForm from '../../../component/InputForm'; 
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, Grid, IconButton, InputAdornment, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

function page(props) {

  const [password, setPassword] = useState();
  const router = useRouter();
  const searchParams = useSearchParams();  // 쿼리 파라미터 접근
  const action = searchParams.get('action');  // action 값 가져오기

  // 비밀번호 표시 상태 변경 함수
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const handleSubmit = () => {
    if (action === 'update') {
      router.push('/myPage/myUserInfo/updateUserInfo');  // 수정 페이지로 이동
    } else if (action === 'delete') {
      router.push('/myPage/myUserInfo/deleteAccount');  // 삭제 페이지로 이동
    }
  };

  return (
    
 <Box sx={{
  display:'flex',
  flexDirection:'column',
  alignItems:'center'
 }}>
   <Typography as="h1" fontSize="28px" fontWeight="700" mb="5px">

     Forgot ID?{" "}
     {/* <Image
       src="/images/favicon.png"
       alt="favicon"
       className={styles.favicon}
       width={30}
       height={30}
     /> */}
   </Typography>

   <Typography fontSize="15px" mb="30px">
     Enter your email and we′ll send you instructions to reset your
     password
   </Typography>

     <Box xs={6} xl={6}
       sx={{
         maxWidth: '500px',
         minWidth: '500px',
         background: "#fff",
         padding: "30px 20px",
         borderRadius: "10px",
         mb: "20px",
       }}
       className="bg-black"
     >
      <InputForm
        label="비밀번호"
        type="password" // 보이는 상태에 따라 입력 타입 변경
        name="password"
        value={password}
        onChange={handlePasswordChange}
      />
     <Button
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
       onClick={handleSubmit}
     >
       Confirm
     </Button>
    <Box as="div" textAlign="center" mt="20px">
      <Link
        href="/myPage/myUserInfo"
        className="primaryColor text-decoration-none"
      >
        <i className="ri-arrow-left-s-line"></i> Back to Sign in
      </Link>
    </Box>
     </Box>

 </Box>
  );
}

export default page;