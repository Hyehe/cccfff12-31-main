"use client";

import React from "react";
import { Box, Typography, Button, Grid, Paper } from "@mui/material";
import Diversity3Icon from "@mui/icons-material/Diversity3"; // 정규 모임 아이콘
import FlashOnIcon from "@mui/icons-material/FlashOn"; // 번개 모임 아이콘

export default function MeetingMainPage() {
  return (
    <Box>
      {/* 배너 섹션 */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "auto",
          // maxHeight: "600px", // 배너의 최대 높이를 제한
          // aspectRatio: "16/7", // 이미지 비율 설정 (예: 16:9)
          overflow: "hidden",
          marginBottom: "30px",
        }}
      >
        <Box
          component="img"
          // src="/images/navystar.gif" // 배너 이미지 경로
          src="/images/starten1.jpg" // 배너 이미지 경로
          alt="배너 이미지"
          style={{
            width: "100%",
            height: "50vh",
            margin: '0', // 여백 제거
            padding: '0', // 패딩 제거
            objectFit: "cover",
          }}
        />

        {/* 배너 */}
        <Box>
          <Box
            sx={{
              position: "absolute",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              color: "white",
              // bgcolor: "rgba(0, 0, 0, 0.5)", // 텍스트 배경 반투명 처리
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            {/* 텍스트 애니메이션 적용 */}
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                animation: "fadeInUp 3s ease-in-out, textGlow 4s infinite" // 글자가 위로 올라오며 빛남
                
              }}
            >
              {/* 이미지 추가 */}
              <Box
                component="img"
                src="/images/starsss.png"
                alt="gold star"
                sx={{
                  width: "50px", // 이미지 너비 조정
                  height: "50px", // 이미지 높이 조정
                  marginRight: "10px", // 텍스트와 간격
                }}
              /><br />

              함께해요
            </Typography>
            <Typography
              variant="h6"
              sx={{
                marginTop: "20px",
                animation: "fadeInUp 3s ease-in-out", // 글자가 서서히 나타남
              }}
            >
              아래 버튼을 클릭하여 다양한 모임에 참여하세요
            </Typography>
          </Box>
        </Box>
        {/* CSS 애니메이션 추가 */}
        <style>
          {`
      @keyframes fadeInUp {
        0% {
          opacity: 0;
          transform: translateY(30px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeIn {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }

      @keyframes textGlow {
  from {
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  }
  50% {
    text-shadow: 0 0 20px rgba(255, 255, 255, 1);
  }
  to {
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  }
}

    `}
        </style>

      </Box>

      {/* 모임 선택 섹션 */}
      <Grid
        container
        spacing={5}
        sx={{
          padding: "40px",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          margin: "0 auto",
          width: "100%", // 부모 컨테이너 너비를 100%로 설정
          maxWidth: "1300px", // 최대 너비 제한
          gap: '100px'
        }}
      >

        {/* 정규 모임 */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={4}
            sx={{
              padding: "20px",
              textAlign: "center",
              transition: "transform 0.3s",
              "&:hover": {
                transform: "scale(1.05)",
              },
              maxWidth: '500px',
              height: "400px"
            }}
          >
            <Diversity3Icon sx={{ fontSize: "60px", color: "#79c75f", height: '130px', width: '100px' }} />
            {/* 노란색 color: "#ffca28" */}
            <Typography variant="h5" sx={{ margin: "20px 0" }}>
              정규 모임
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: "20px" }}>
              다양한 정기 모임에 참여하고 새로운 사람들을 만나보세요.
            </Typography>
            <Button
              variant="contained"
              color="success"
              href="/MeetingGroup/regular-Meeting"
            >
              정규 모임 보기
            </Button>
          </Paper>
        </Grid>

        {/* 번개 모임 */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={4}
            sx={{
              padding: "20px",
              textAlign: "center",
              transition: "transform 0.3s",
              "&:hover": {
                transform: "scale(1.05)",
              },
              maxWidth: '500px',
              height: "400px"
            }}
          >
            <FlashOnIcon sx={{ fontSize: "60px", color: "#ffca28", height: '130px', width: '100px' }} />
            <Typography variant="h5" sx={{ margin: "20px 0" }}>
              번개 모임
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: "20px" }}>
              즉흥적인 모임에 참여하며 다양한 경험을 쌓아보세요.
            </Typography>
            <Button
              variant="contained"
              color="warning"
              href="/MeetingGroup/lightning-Meeting"
              sx={{ marginBottom: '60px' }}
            >
              번개 모임 보기

            </Button>
          </Paper>
        </Grid>
      </Grid>
      {/* <Button
        variant="contained"
        color="warning"
        href="/MeetingGroup/my-Meeting"
        sx={{ marginBottom: '60px' }}
      >
        연습
      </Button> */}
    </Box>
  );
}
