"use client";

import React, { useState } from "react";
import { Box, Typography, Avatar, IconButton, TextField, Card, Button, Paper, List, ListItem, ListItemText } from "@mui/material";
import SendIcon from "@mui/icons-material/Send"; // 작성 버튼 아이콘
import ReplyIcon from "@mui/icons-material/Reply"; // 답글 아이콘
import DeleteIcon from "@mui/icons-material/Delete"; // 삭제 아이콘
import { useRouter, useParams } from 'next/navigation';

export default function BulletinDetailPage() {
  // 초기 게시글 데이터
  const mockData = {
    1: { title: '번개모임 제목 1', location: '서울 은평구', date: '2024-12-03', description: '첫 번째 모임 설명', capacity: '10/20', comments: [] },
    2: { title: '번개모임 제목 2', location: '서울 강남구', date: '2025-12-25', description: '두 번째 모임 설명', capacity: '5/15', comments: [] },
    3: { title: '번개모임 겨울 캠프', location: '경기 남양주', date: '2024-12-01', description: '세 번째 모임 설명', capacity: '20/30', comments: [] },
    4: { title: '겨울 번개', location: '인천 미추홀구', date: '2024-11-30', description: '번째 모임번임번째 모임번째 모임번째 모임네 번째 모임 설명', capacity: '10/25', comments: [] },
  };

  const { id } = useParams(); // URL 파라미터에서 id 가져오기
  console.log("Current ID:", id);
  // const post = mockData[id] || {}; // Mock 데이터로 가져옴
  if (!id || !mockData[id]) {
    return <Typography>해당 게시글을 찾을 수 없습니다.</Typography>
  }
  const [post, setPost] = useState(mockData[id] || {});
  const [newComment, setNewComment] = useState(""); // 댓글 입력 상태
  const [newReply, setNewReply] = useState(""); // 대댓글 입력 상태
  const [replyToCommentId, setReplyToCommentId] = useState(null); // 대댓글 대상 댓글 ID
  const router = useRouter();

  // 댓글 삭제
  const handleDeleteComment = (commentId) => {
    if (!post.comments) return;
    setPost((prev) => ({
      ...prev,
      comments: prev.comments.filter((comment) => comment.id !== commentId),
    }));
  };
  
  // 대댓글 삭제
  const handleDeleteReply = (commentId, replyId) => {
    if (!post.comments) return;
    setPost((prev) => ({
      ...prev,
      comments: prev.comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: comment.replies.filter((reply) => reply.id !== replyId),
            }
          : comment
      ),
    }));
  };
  
  // 댓글 추가 함수
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const newCommentObj = {
      id: Date.now(),
      author: "익명",
      content: newComment.trim(),
      createdAt: "방금 전",
      replies: [],
    };
    setPost((prev) => ({
      ...prev,
      comments: [...prev.comments, newCommentObj],
    }));
    setNewComment(""); // 입력 초기화
  };

  // 대댓글 추가 함수
  const handleAddReply = (commentId) => {
    if (!newReply.trim()) return;
    setPost((prev) => ({
      ...prev,
      comments: prev.comments.map((comment) =>
        comment.id === commentId
          ? {
            ...comment,
            replies: [
              ...comment.replies,
              {
                id: Date.now(),
                author: "익명",
                content: newReply.trim(),
                createdAt: "방금 전",
              },
            ],
          }
          : comment
      ),
    }));
    setNewReply(""); // 입력 초기화
    setReplyToCommentId(null); // 대댓글 창 닫기
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: "1000px", margin: "0 auto", width: '800px', marginTop:'70px' }}>
      {/* 게시글 내용 */}
      <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
            {post?.title || '게시글을 찾을 수 없습니다.'}
          </Typography>
          <br />
        <Typography variant="body1" sx={{ marginBottom: '10px' }}>
          <strong>캠핑 장소 : </strong> {post?.location}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '10px' }}>
          <strong>일정 날짜 : </strong> {post?.date}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '10px' }}>
          <strong>정원 : </strong> {post?.capacity}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '10px' }}>
          <strong>내용 : </strong> {post?.description}
        </Typography>
      </Paper>


      {/* 댓글 섹션 */}
      <Box>
      <Typography variant="h6">
  댓글 ({post?.comments?.length || 0})
</Typography>

        {post.comments.map((comment) => (
          <Box key={comment.id} sx={{ marginBottom: "20px" }}>
            {/* 댓글 */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <Avatar sx={{ marginRight: "10px" }}>👤</Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  {comment.author}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {comment.createdAt}
                </Typography>
                <Typography variant="body1" sx={{ marginTop: "8px" }}>
                  {comment.content}
                </Typography>
              </Box>
              <IconButton
                sx={{ marginLeft: "auto" }}
                onClick={() => handleDeleteComment(comment.id)}
              >
                <DeleteIcon sx={{ marginRight: '10px' }} />
              </IconButton>
            </Box>

            {/* 대댓글 */}
            {comment.replies.map((reply) => (
              <Box
                key={reply.id}
                sx={{
                  marginLeft: "50px",
                  padding: "10px",
                  borderRadius: "8px",
                  backgroundColor: "#f8f9fa",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {reply.author}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {reply.createdAt}
                  </Typography>
                  <Typography variant="body1" sx={{ marginTop: "5px" }}>
                    {reply.content}
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => handleDeleteReply(comment.id, reply.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}

            {/* 대댓글 작성 */}
            {replyToCommentId === comment.id && (
              <Box
                sx={{ marginTop: "10px", marginLeft: "50px", display: "flex" }}
              >
                <TextField
                  fullWidth
                  label="대댓글 작성"
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddReply(comment.id);
                    }
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={() => handleAddReply(comment.id)}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            )}
            <Button
              startIcon={<ReplyIcon />}
              size="small"
              onClick={() => setReplyToCommentId(comment.id)}
              sx={{ marginLeft: "50px" }}
            >
              답글
            </Button>
          </Box>
        ))}

        {/* 새 댓글 작성 */}
        <Box sx={{ marginTop: "20px", display: "flex" }}>
          <TextField
            fullWidth
            label="댓글 작성"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddComment();
              }
            }}
          />
          <IconButton color="primary" onClick={handleAddComment}>
            <SendIcon />
          </IconButton>
        </Box>
        <Button variant="outlined" sx={{ marginTop: '20px' }} onClick={() => router.push('/MeetingGroup/lightning-Meeting')}>
        뒤로 가기
      </Button>
      </Box>
    </Box>
  );
}
