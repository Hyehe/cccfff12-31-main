"use client";

import React from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Divider } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export default function FAQPage() {
  const faqs = [
    { question: "예약 최소 하고 싶어요.", answer: "최소 하루 전까지 예약 가능합니다." },
    { question: "캠핑장에 Wi-Fi가 제공되나요?", answer: "일부 캠핑장에서 제공됩니다." },
    { question: "결제는 어떤 방법이 가능한가요?", answer: "신용카드, 계좌이체, 간편결제(카카오페이, 네이버페이) 등이 가능합니다." },
    { question: "예약 취소 및 환불 정책은 어떻게 되나요?", answer: "예약 취소는 최소 2일 전까지 가능합니다. 환불은 결제 수단에 따라 3~5일 정도 소요됩니다." },
    { question: "반려동물 동반이 가능한가요?", answer: "일부 캠핑장은 반려동물 동반이 가능합니다. 캠핑장 별로 확인해 주세요." },
  ];

  return (
    <Box sx={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ textAlign: "center", color: "#333" }}>
        자주 묻는 질문
      </Typography>
      <Divider sx={{ marginBottom: "20px" }} />

      {faqs.map((faq, index) => (
        <Accordion
          key={index}
          sx={{
            marginBottom: "15px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            "&:hover": { boxShadow: "0 6px 12px rgba(0,0,0,0.15)" },
            "&::before": { display: "none" }, // 제거된 디폴트 스타일
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#597445" }} />}
            sx={{
              backgroundColor: "#f9f9f9",
              borderRadius: "10px 10px 0 0",
              "& .MuiTypography-root": { fontWeight: "bold", color: "#333" },
            }}
          >
            <HelpOutlineIcon sx={{ marginRight: "10px", color: "#597445" }} />
            <Typography>{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: "#fff", borderRadius: "0 0 10px 10px", padding: "15px" }}>
            <CheckCircleOutlineIcon sx={{ marginRight: "10px", color: "#28A745" }} />
            <Typography sx={{ color: "#555" }}>{faq.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
