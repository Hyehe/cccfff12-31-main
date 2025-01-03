"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Box, List, ListItemButton, ListItemText, ListItemIcon, Typography } from "@mui/material";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import AssignmentIcon from "@mui/icons-material/Assignment";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import Link from "next/link";

const menuSections = [
  {
    title: "고객센터",
    items: [
      { name: "공지사항", path: "/customer-center/notice", icon: <AnnouncementIcon /> },
      { name: "캠핑장 등록 및 수정 요청", path: "/customer-center/request", icon: <AssignmentIcon /> },
      { name: "자주 묻는 질문", path: "/customer-center/faq", icon: <QuestionAnswerIcon /> },
    ],
  },
];

export default function CustomerCenterLayout({ children }) {
  const pathname = usePathname(); // 현재 경로 가져오기

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        bgcolor: "#F8F9FA",
        padding: "0 250px",
      }}
    >
      {/* 사이드바 */}
      <Box
        sx={{
          width: "260px",
          backgroundColor: "#F5F5F5",
          borderRadius: "15px 0 0 15px",
          padding: 2,
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h6" fontWeight="bold" marginBottom="20px">
          Customer Service
        </Typography>

        {menuSections.map((section, index) => (
          <Box key={index} marginBottom="20px">
            <Typography
              variant="subtitle2"
              color="textSecondary"
              fontWeight="bold"
              marginBottom="10px"
            >
              {section.title}
            </Typography>
            <List>
              {section.items.map((item) => (
                <Link href={item.path} key={item.path} style={{ textDecoration: "none", color: "inherit" }} passHref>
                  <ListItemButton
                    sx={{
                      borderRadius: "10px",
                      backgroundColor: pathname === item.path ? "#d3d3d3" : "transparent",
                      color: pathname === item.path ? "#333333" : "#6C757D",
                      marginBottom: "5px",
                      "&:hover": {
                        backgroundColor: pathname === item.path ? "#bfbfbf" : "#E9ECEF",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: "40px",
                        color: pathname === item.path ? "#333333" : "#6C757D",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                </Link>
              ))}
            </List>
          </Box>
        ))}
      </Box>

      {/* 콘텐츠 영역 */}
      <Box
        sx={{
          flexGrow: 1,
          padding: 3,
          bgcolor: "#FFFFFF",
          borderRadius: "0 15px 15px 0",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          minHeight: "600px", // 여기를 추가하면 콘텐츠 박스가 아래로 늘어납니다
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
