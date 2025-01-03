"use client";
import React, { useEffect, useState } from "react";
import { Button, Box, Typography, Checkbox, FormControlLabel, List, ListItem, ListItemText, Collapse, Grid } from "@mui/material";
import { useRouter } from "next/navigation";

import useSignup from "../../../authentication/signUp/hooks/useSignUP";
import CommonUserForm from "../../../component/CommonUserForm";

function updateUserInfoPage() {


  const router = useRouter();

  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  
  const {
    id, password, passwordConfirm, username, 
    zipcode, address, addressDetail, agreed, idStatus, passwordCheck,
    handleIdChange, handlePasswordChange, handlePasswordConfirmChange, handleUsernameChange,
    handleAgreeChange, handleZipcodeChange, handleAddressChange, handleAddressDetailChange,  //주소
    setError, handlePostCode,
    setUserType, userType
  } = useSignup(LOCAL_API_BASE_URL);

  useEffect(() => {
    // 카카오 주소 검색 스크립트 추가
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  

  //회원가입 버튼 클릭 이벤트
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  return (
    <CommonUserForm/>
  );
}

export default updateUserInfoPage;