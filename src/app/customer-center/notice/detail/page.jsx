"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Box, Typography, Paper, Divider } from "@mui/material";

export default function NoticeDetailPage() {
  const searchParams = useSearchParams();

  const title = searchParams.get("title") || "제목 없음";
  const writer = searchParams.get("writer") || "작성자 없음";
  const date = searchParams.get("date") || "날짜 없음";
  const content = searchParams.get("content") || "내용 없음";
  const image = searchParams.get("image");

  return (
    <Paper
      sx={{
        p: 4,
        maxWidth: "900px",
        margin: "auto",
        mt: 5,
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        작성자: {writer} / 날짜: {date}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {image && (
        <Box
          component="img"
          src={image}
          alt="공지사항 이미지"
          sx={{
            width: "100%",
            maxHeight: "400px",
            objectFit: "cover",
            borderRadius: "8px",
            mb: 3,
          }}
        />
      )}
      <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
        {content}
      </Typography>
    </Paper>
  );
}
