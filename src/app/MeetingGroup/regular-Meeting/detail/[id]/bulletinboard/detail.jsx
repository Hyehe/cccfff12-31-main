"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Card,
  Button,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send"; // 작성 버튼 아이콘
import ReplyIcon from "@mui/icons-material/Reply"; // 답글 아이콘
import DeleteIcon from "@mui/icons-material/Delete"; // 삭제 아이콘

export default function Detail({
  post,
  onAddComment,
  onAddReply,
  onDeleteComment,
  onDeleteReply,
}) {
  const [newComment, setNewComment] = useState(""); // 댓글 입력 상태
  const [newReply, setNewReply] = useState(""); // 대댓글 입력 상태
  const [replyToCommentId, setReplyToCommentId] = useState(null); // 대댓글 대상 댓글 ID

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment(""); // 입력 초기화
    }
  };

  const handleAddReply = (commentId) => {
    if (newReply.trim()) {
      onAddReply(commentId, newReply.trim());
      setNewReply(""); // 입력 초기화
      setReplyToCommentId(null); // 대댓글 창 닫기
    }
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <Card
        sx={{
          padding: "16px",
          borderRadius: "8px",
          boxShadow: 2,
          marginBottom: "20px",
        }}
      >
        {/* 게시글 내용 */}
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {post.content}
        </Typography>
      </Card>

      {/* 댓글 섹션 */}
      <Box>
        <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: "10px" }}>
          댓글 ({post.comments.length})
        </Typography>
        {post.comments.map((comment) => (
          <Box key={comment.id} sx={{ marginBottom: "20px" }}>
            {/* 댓글 */}
            <Box sx={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
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
                onClick={() => onDeleteComment(comment.id)}
              >
                <DeleteIcon />
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
                <IconButton onClick={() => onDeleteReply(comment.id, reply.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}

            {/* 대댓글 작성 */}
            {replyToCommentId === comment.id && (
              <Box sx={{ marginTop: "10px", marginLeft: "50px", display: "flex" }}>
                <TextField
                  fullWidth
                  label="대댓글 작성"
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // 기본 동작 차단
                      handleAddReply(comment.id); // 대댓글 추가
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
                e.preventDefault(); // 기본 동작 차단
                handleAddComment(); // 댓글 추가
              }
            }}
          />
          <IconButton color="primary" onClick={handleAddComment}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
