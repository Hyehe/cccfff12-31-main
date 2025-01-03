"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Card,
  IconButton,
  TextField,
  Button,
  Modal,
  FormControl,
  Select,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../../../../globals.css"

import Link from "next/link";

export default function BulletinBoard() {
  // 게시물 데이터 관리 (게시물 목록, 검색어, 카테고리 선택 등)
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "캠핑 즐기기 팁",
      content: "캠핑에서 유용한 팁들을 공유합니다. 즐거운 캠핑 되세요!",
      category: "자유", // 카테고리 설정 (자유, 공지, 인사)
      author: "캠퍼",
      date: "2024-12-11",
      likes: 6,
      liked: false, // 좋아요 여부
      comments: [{ id: 1, author: "유저1", content: "좋은 정보 감사합니다!" }], // 댓글
      images: ["/images/car2.jpg", "/images/car1.jpg"], // 게시물 이미지
      authorAvatar: "/images/avatar1.jpg",
      expanded: false, // 게시물 확장/축소 상태
    },
  ]);

  const [drawerOpen, setDrawerOpen] = useState(false); // 햄버거 메뉴 상태
  const [searchKeyword, setSearchKeyword] = useState(""); // 검색 키워드
  const [selectedCategory, setSelectedCategory] = useState("전체"); // 선택된 카테고리
  const [filteredPosts, setFilteredPosts] = useState(posts); // 필터링된 게시물 목록
  const [selectedPost, setSelectedPost] = useState(null); // 선택된 게시물
  const [postModalOpen, setPostModalOpen] = useState(false); // 게시물 작성 모달 상태
  const [selectedImages, setSelectedImages] = useState([]); // 업로드된 이미지
  const [newPostTitle, setNewPostTitle] = useState(""); // 새 게시물 제목
  const [newPostContent, setNewPostContent] = useState(""); // 새 게시물 내용
  const [newPostCategory, setNewPostCategory] = useState("자유"); // 새 게시물 카테고리
  const [newComment, setNewComment] = useState(""); // 새 댓글 내용

  // 게시물 검색 및 필터링
  useEffect(() => {
    const filtered = posts.filter(
      (post) =>
        (selectedCategory === "전체" || post.category === selectedCategory) &&
        (post.title.includes(searchKeyword) || post.content.includes(searchKeyword))
    );
    setFilteredPosts(filtered);
  }, [searchKeyword, selectedCategory, posts]);

  // 좋아요 기능
  const handleLikeToggle = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? { ...post, liked: !post.liked, likes: post.likes + (post.liked ? -1 : 1) }
          : post
      )
    );
  };

  // 게시물 확장/축소
  const handleExpandToggle = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, expanded: !post.expanded } : post
      )
    );
  };

  // 댓글 추가
  const handleAddComment = () => {
    if (newComment.trim()) {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === selectedPost.id
            ? {
              ...post,
              comments: [
                ...post.comments,
                { id: Date.now(), author: "익명", content: newComment },
              ],
            }
            : post
        )
      );
      setNewComment("");
    }
  };

  // 이미지 업로드
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const images = files.map((file) => URL.createObjectURL(file));
    setSelectedImages([...selectedImages, ...images]);
  };

  // 게시물 추가
  const handleNewPost = () => {
    if (newPostTitle.trim() && selectedImages.length) {
      const newPost = {
        id: posts.length + 1,
        title: newPostTitle,
        content: newPostContent,
        category: newPostCategory,
        author: "새로운 유저",
        date: new Date().toISOString().split("T")[0],
        likes: 0,
        liked: false,
        comments: [],
        images: selectedImages,
        authorAvatar: "/images/avatar1.jpg",
        expanded: false,
      };
      setPosts([newPost, ...posts]);
      setPostModalOpen(false);
      setSelectedImages([]);
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostCategory("자유");
    }
  };

  // 햄버거 메뉴 열기/닫기
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      {/* 햄버거 메뉴 버튼 */}
      <IconButton
        onClick={handleDrawerToggle}
        sx={{
          position: "fixed",
          bottom: "80px",
          right: "16px",
          backgroundColor: "#28a745",
          color: "white",
          zIndex: 10,
          "&:hover": { backgroundColor: "#218838" },
          bottom: "76px",
          right: "26px",
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* 게시물 작성 버튼 */}
      <IconButton
        onClick={() => setPostModalOpen(true)}
        sx={{
          position: "fixed",
          bottom: "20px",
          right: "16px",
          backgroundColor: "#4caf50",
          color: "white",
          zIndex: 10,
          "&:hover": { backgroundColor: "#388e3c" },
          bottom: "26px",
          right: "26px",
        }}
      >
        <AddCircleIcon />
      </IconButton>

      {/* 햄버거 메뉴 Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            position: "absolute",
            top: "25vh",
            height: "40vh",
            width: "300px",
            margin: "0 auto",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "16px",
            backdropFilter: "blur(10px)",
          },
        }}
      >
        {/* Drawer 내부 내용 */}
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Drawer 닫기 버튼 */}
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ display: "flex", justifyContent: "flex-end", margin: 1 }}
          >
            <CloseIcon />
          </IconButton>
          <List
            sx={{
              padding: 0,
              margin: 0,
            }}
          >
            {/* Drawer 메뉴 링크 */}
            {[
              { label: "홈", href: `/MeetingGroup/regular-Meeting/detail/${posts.id}` },
              { label: "게시판", href: `/MeetingGroup/regular-Meeting/detail/${posts.id}/bulletinboard` },
              { label: "사진첩", href: `/MeetingGroup/regular-Meeting/detail/${posts.id}/photogallery` },
              { label: "채팅", href: `/MeetingGroup/regular-Meeting/detail/${posts.id}/chat` },
            ].map((item) => (
              <Link key={item.label} href={item.href} passHref legacyBehavior>
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

      {/* 게시판 필터 및 검색 */}
      <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        {/* 카테고리 선택 */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            displayEmpty
          >
            <MenuItem value="전체">전체</MenuItem>
            <MenuItem value="자유">자유</MenuItem>
            <MenuItem value="공지">공지</MenuItem>
            <MenuItem value="인사">인사</MenuItem>
          </Select>
        </FormControl>
        {/* 검색 창 */}
        <TextField
          size="small"
          placeholder="검색"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </Box>

      {/* 게시물 목록 */}
      {filteredPosts.map((post) => (
        <Card key={post.id} sx={{ marginBottom: "20px", borderRadius: "8px", position: "relative" }}>
          {/* 게시물 카테고리 표시 */}
          <Box
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
              backgroundColor:
                post.category === "공지" ? "#ff9800" : post.category === "자유" ? "#4caf50" : "#2196f3",
              color: "white",
              padding: "5px 10px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: "bold",
              boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            {post.category}
          </Box>
          {/* 게시물 작성자 정보 */}
          <Box sx={{ display: "flex", alignItems: "center", padding: "10px" }}>
            <Avatar src={post.authorAvatar} alt={post.author} sx={{ marginRight: "10px" }} />
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                {post.author}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {post.date}
              </Typography>
            </Box>
          </Box>
          {/* 이미지 슬라이더 */}
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            style={{ width: "100%", height: "400px" }}
          >
            {post.images.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt={`Slide ${index}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <Box sx={{ padding: "10px" }}>
            {/* 좋아요 및 댓글 아이콘 */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <IconButton onClick={() => handleLikeToggle(post.id)}>
                {post.liked ? <FavoriteIcon sx={{ color: "red" }} /> : <FavoriteBorderIcon />}
              </IconButton>
              <IconButton onClick={() => setSelectedPost(post)}>
                <ChatBubbleOutlineIcon />
              </IconButton>
            </Box>
            {/* 좋아요 및 댓글 수 */}
            <Typography variant="body2" sx={{ marginTop: "5px" }}>
              좋아요 {post.likes}개 · 댓글 {post.comments.length}개
            </Typography>
            {/* 게시물 제목 */}
            <Typography
              variant="body2"
              sx={{
                marginTop: "10px",
                fontWeight: "bold",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={post.title}
            >
              {post.title}
            </Typography>
            {/* 게시물 내용 더보기/숨기기 */}
            <Collapse in={post.expanded} timeout="auto" unmountOnExit>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ marginTop: "5px" }}
              >
                {post.content}
              </Typography>
            </Collapse>
            <Button
              size="small"
              onClick={() => handleExpandToggle(post.id)}
              sx={{ textTransform: "none", marginTop: "5px" }}
            >
              {post.expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />} 더보기
            </Button>
          </Box>
        </Card>
      ))}

      {selectedPost && (
        <Modal open={Boolean(selectedPost)} onClose={() => setSelectedPost(null)}>
          <Box
            sx={{
              display: "flex",
              backgroundColor: "white",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              height: "80%",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: 24,
            }}
          >
            {/* 왼쪽: 선택된 게시물의 이미지 슬라이더 */}
            <Box sx={{ flex: 2, position: "relative", overflow: "hidden", height: "100%" }}>
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                style={{ width: "100%", height: "100%" }}
              >
                {selectedPost.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image}
                      alt={`Slide ${index}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
            {/* 오른쪽: 댓글 표시 및 작성 */}
            <Box
              sx={{
                flex: 1,
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white",
                overflowY: "auto",
              }}
            >
              <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                {selectedPost.title}
              </Typography>
              <Box sx={{ flex: 1, overflowY: "auto", marginBottom: "10px" }}>
                {selectedPost.comments.map((comment) => (
                  <Typography key={comment.id} sx={{ marginBottom: "10px" }}>
                    <strong>{comment.author}</strong>: {comment.content}
                  </Typography>
                ))}
              </Box>
              <TextField
                fullWidth
                placeholder="댓글 작성"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{ marginBottom: "10px" }}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleAddComment}
                sx={{ backgroundColor: "#1976d2", color: "white" }}
              >
                댓글 추가
              </Button>
            </Box>
          </Box>
        </Modal>
      )}

      {/* 게시물 작성 모달 */}
      <Modal open={postModalOpen} onClose={() => setPostModalOpen(false)}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "80%",
            height: "80%",
            backgroundColor: "white",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: 24,
          }}
        >
          {/* 왼쪽: 이미지 미리보기 */}
          <Box
            sx={{
              flex: 2,
              position: "relative",
              overflow: "hidden",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: selectedImages.length === 0 ? "2px dashed #ccc" : "none",
              backgroundColor: selectedImages.length === 0 ? "#f9f9f9" : "transparent",
            }}
          >
            {/* 이미지가 없는 경우 안내 메시지 */}
            {selectedImages.length === 0 ? (
              <Typography
                sx={{
                  textAlign: "center",
                  color: "#aaa",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                + 사진을 추가해주세요
              </Typography>
            ) : (
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                {selectedImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image}
                      alt={`Selected ${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
            {/* 사진 추가 버튼 */}
            <Button
              variant="outlined"
              startIcon={<AddPhotoAlternateIcon />}
              sx={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10,
                backgroundColor: "white",
                border: "1px solid #1976d2",
                color: "#1976d2",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
              onClick={() => document.getElementById("fileInput").click()}
            >
              사진 추가
            </Button>
          </Box>

          {/* 오른쪽: 게시물 작성 폼 */}
          <Box
            sx={{
              flex: 1,
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "white",
              overflowY: "auto",
            }}
          >
            <TextField
              fullWidth
              placeholder="제목 입력"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="내용 입력"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              sx={{ marginBottom: "20px" }}
            />
            <FormControl fullWidth>
              <Select
                value={newPostCategory}
                onChange={(e) => setNewPostCategory(e.target.value)}
                displayEmpty
                sx={{ marginBottom: "20px" }}
              >
                <MenuItem value="자유">자유</MenuItem>
                <MenuItem value="공지">공지</MenuItem>
                <MenuItem value="인사">인사</MenuItem>
              </Select>
            </FormControl>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleNewPost}
              sx={{ marginTop: "auto" }}
            >
              게시물 생성
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* 파일 입력 필드 */}
      <input
        type="file"
        accept="image/*"
        id="fileInput"
        style={{ display: "none" }}
        onChange={handleFileChange}
        multiple
      />
    </Box>
  );
}