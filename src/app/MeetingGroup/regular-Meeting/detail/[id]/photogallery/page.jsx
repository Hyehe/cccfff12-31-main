"use client";

import React, { useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  Link,
  ListItem,
  ListItemText,
  Dialog,
  DialogContent,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import "../../../../../globals.css";

export default function PhotoGallery() {
  const photos = [
    { id: 1, image: "/images/다운로드.jpg", alt: "사진 1" },
    { id: 2, image: "/images/다운로드55 (1).jpg", alt: "사진 1" },
    { id: 3, image: "/images/im562652ages.jpg", alt: "사진 1" },
    { id: 4, image: "/images/campingnav.gif", alt: "사진 1" },
    { id: 6, image: "/images/camping1.png", alt: "사진 1" },
    { id: 7, image: "/images/car2.jpg", alt: "사진 1" },
    { id: 8, image: "/images/car1.jpg", alt: "사진 1" },
    { id: 9, image: "/images/bg-dark.jpg", alt: "사진 1" },
  ];
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(null);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // 사진 크게 보기
  const handleClickOpen = (photo) => {
    setCurrentPhoto(photo);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentPhoto(null);
  };

  return (
    <Box
      sx={{
        padding: "20px",
        maxWidth: "900px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      {/* 네비게이션 리스트 아이콘 */}
      <IconButton
        onClick={handleDrawerToggle}
        sx={{
          position: "fixed",
          bottom: "26px",
          right: "26px",
          backgroundColor: "#28a745",
          color: "white",
          boxShadow: 3,
          "&:hover": { backgroundColor: "#218838" },
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* 제목 */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          mb: 4,
          color: "#28a745",
        }}
      >
        사진첩
      </Typography>

      {/* 사진첩 */}
      <Grid container spacing={2}>
        {photos.map((photo) => (
          <Grid item xs={6} sm={4} key={photo.id}>
            <Card
              sx={{
                boxShadow: 2,
                borderRadius: "8px",
                overflow: "hidden",
                "&:hover": { transform: "scale(1.03)", transition: "0.3s" },
              }}
              onClick={() => handleClickOpen(photo)} // 클릭 이벤트
            >
              <CardMedia
                component="img"
                height="180"
                image={photo.image}
                alt={photo.alt}
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal/Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogContent
          sx={{
            position: "relative",
            padding: 0,
            backgroundColor: "black",
          }}
        >

          {/* 닫기 버튼 */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: "8px",
              right: "8px",
              color: "white",
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* 큰 이미지 */}
          {currentPhoto && (
            <img
              src={currentPhoto.image}
              alt={currentPhoto.alt}
              style={{
                width: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
          )}

        </DialogContent>
      </Dialog>


      {/* Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            position: "absolute",
            top: "25vh", // 화면 위에서 25% 떨어진 위치
            height: "40vh", // 드로어 높이
            width: "300px", // 드로어 너비
            margin: "0 auto",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "16px", // 둥근 모서리
            backdropFilter: "blur(10px)", // 블러
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* 닫기 버튼 */}
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ display: "flex", justifyContent: "flex-end", margin: 1 }}
          >
            <CloseIcon />
          </IconButton>
          {/* 네비게이션 리스트 */}
          <List
            sx={{
              padding: 0, // 내부 여백 제거
              margin: 0, // 외부 여백 제거
            }}
          >
            {[
              { label: "홈", href: `/MeetingGroup/regular-Meeting/detail/1`},
              { label: "게시판", href: `/MeetingGroup/regular-Meeting/detail/1/bulletinboard` },
              { label: "사진첩", href: `/MeetingGroup/regular-Meeting/detail/1/photogallery` },
              { label: "채팅", href: `/MeetingGroup/regular-Meeting/detail/1/chat` },
            ].map((item) => (
              <Link key={item.label} href={item.href} passHref legacyBehavior  style={{ textDecoration: "none" }}>
              <a style={{ textDecoration: "none" }}> {/* Link 내 a 태그 명시 */}
                <ListItem
                  component="div" // 'div'로 렌더링되도록 설정
                  onClick={handleDrawerToggle}
                  sx={{
                    textAlign: "center",
                    "&:hover": { backgroundColor: "#dff0d8" },
                    cursor: "pointer", // 클릭 가능하게 스타일링
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    sx={{
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "#333", // 글꼴 색상
                    }}
                  />
                </ListItem>
              </a>
            </Link>

            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
