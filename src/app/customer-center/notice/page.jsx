"use client";

import React from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Divider } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function NoticePage() {
  const notices = [
    {
      id: 1,
      title: "서울로 떠나는 캠핑-나는 서울에서 논다",
      writer: "관리자",
      date: "2024-12-01",
      content: "캠핑장 관련 공지사항의 상세 내용입니다. 운영 시간, 변경 사항 등에 대한 정보를 확인하세요.",
      image: "/images/m_main_0512.jpg",
    },
    {
      id: 2,
      title: "공지사항 테스트",
      writer: "관리자",
      date: "2024-11-30",
      content: "함께해요 공지사항 테스트",
      image: "/images/15055_63027_3713.jpg",
    },
  ];

  return (
    <Box sx={{ p: 3, maxWidth: "900px", margin: "auto" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ textAlign: "center", color: "#333" }}>
              공지사항
            </Typography>
      <Divider sx={{ mb: 3 }} />
      {notices.map((notice) => (
        <Accordion
          key={notice.id}
          sx={{
            mb: 2,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: "#f5f5f5" }}>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {notice.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                작성자: {notice.writer} / 날짜: {notice.date}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {notice.image && (
              <Box
                component="img"
                src={notice.image}
                alt="공지 이미지"
                sx={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  mb: 2,
                }}
              />
            )}
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              {notice.content}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
