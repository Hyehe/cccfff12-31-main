"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Box, Typography } from "@mui/material";

export default function RequestDetailPage() {
  const searchParams = useSearchParams();

  const title = searchParams.get("title") || "제목 없음";
  const writer = searchParams.get("writer") || "작성자 없음";
  const date = searchParams.get("date") || "날짜 없음";
  const content = searchParams.get("content") || "내용 없음";
  const image = searchParams.get("image");

  return (
    <Box sx={{ p: 3, maxWidth: "800px", margin: "auto", bgcolor: "#FFF", borderRadius: "10px" }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" gutterBottom>
        작성자: {writer} / 날짜: {date}
      </Typography>
      {image && (
        <Box
          component="img"
          src={image}
          alt="미리보기"
          sx={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "8px", mt: 2 }}
        />
      )}
      <Typography variant="body1" sx={{ mt: 3 }}>
        {content}
      </Typography>
    </Box>
  );
}
