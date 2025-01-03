"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
  Pagination,
  Input,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function RequestPage() {
  const [isWriting, setIsWriting] = useState(false);
  const [isBusinessUser] = useState(true); // 사업자 여부 (true: 사업자, false: 일반 사용자)
  const [requests, setRequests] = useState([
    { id: 1, title: "서울 마포구 캠핑장 등록 부탁드립니다", writer: "관리자", date: "2020-03-10" },
    { id: 2, title: "경기도 수원 캠핑장 등록 부탁드립니다", writer: "들*", date: "2024-11-28" },
    { id: 3, title: "부산 서면 캠핑장 등록 부탁드립니다", writer: "짱*", date: "2024-11-27" },
  ]);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const handlePageChange = (event, value) => setPage(value);

  const paginatedRequests = requests.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Box sx={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      {/* 제목 및 밑줄 */}
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{ textAlign: "center", color: "#333" }}
      >
        캠핑장 등록 및 수정 요청
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* 사업자 전용 글쓰기 버튼 */}
      {!isWriting ? (
        <>
          {isBusinessUser && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={() => setIsWriting(true)}
                sx={{ bgcolor: "#597445", "&:hover": { bgcolor: "#486936" } }}
              >
                글쓰기
              </Button>
            </Box>
          )}

          {/* 테이블 */}
          <TableContainer
            component={Paper}
            sx={{ borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>번호</TableCell>
                  <TableCell>제목</TableCell>
                  <TableCell>작성자</TableCell>
                  <TableCell>등록일</TableCell>
                  <TableCell align="center">더보기</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRequests.map((request) => (
                  <TableRow key={request.id} hover>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>{request.title}</TableCell>
                    <TableCell>{request.writer}</TableCell>
                    <TableCell>{request.date}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => alert("디테일 페이지로 이동")}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* 페이지네이션 */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={Math.ceil(requests.length / rowsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            캠핑장 등록 및 수정 요청
          </Typography>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="제목"
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="작성자"
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="내용"
              margin="normal"
              multiline
              rows={4}
              variant="outlined"
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                이미지 업로드
              </Typography>
              <Input type="file" inputProps={{ accept: "image/*" }} />
            </Box>
            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                sx={{ bgcolor: "#597445", "&:hover": { bgcolor: "#486936" } }}
              >
                제출
              </Button>
              <Button
                startIcon={<CloseIcon />}
                variant="outlined"
                onClick={() => setIsWriting(false)}
              >
                취소
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
