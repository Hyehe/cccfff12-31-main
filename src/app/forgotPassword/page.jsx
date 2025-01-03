"use client"
import React, { useState } from "react";
import { Button, TextField, Box, Typography, Container } from "@mui/material";

function FindPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailChange = (e) => setEmail(e.target.value);

  const handleFindPassword = () => {
    if (!email) {
      setMessage("이메일을 입력해주세요.");
    } else {
      // 비밀번호 찾기 로직 추가
      setMessage("입력한 이메일로 비밀번호 재설정 링크를 전송했습니다.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 5,
          padding: 3,
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Typography variant="h5" gutterBottom>
          비밀번호 찾기
        </Typography>

        {/* 이메일 입력 */}
        <TextField
          label="이메일"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={handleEmailChange}
        />

        {/* 메시지 표시 */}
        {message && <Typography color="error" sx={{ marginTop: 2 }}>{message}</Typography>}

        {/* 비밀번호 찾기 버튼 */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleFindPassword}
          sx={{ marginTop: 2 }}
        >
          비밀번호 찾기
        </Button>

        {/* 뒤로 가기 버튼 */}
        <Button
          variant="outlined"
          fullWidth
          sx={{ marginTop: 1 }}
          onClick={() => window.history.back()}
        >
          뒤로 가기
        </Button>
      </Box>
    </Container>
  );
}

export default FindPasswordPage;
