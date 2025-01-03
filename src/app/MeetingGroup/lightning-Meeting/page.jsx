"use client";

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
  IconButton,
  Fab,
  Link,
  Pagination,
} from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";

const rows = [
  { no: 1, title: "번개모임 제목 1", author: "작성자1", date: "2024-12-03", counts: 5 },
  { no: 2, title: "번개모임 제목 2", author: "작성자2", date: "2025-12-25", counts: 3 },
  { no: 3, title: "번개모임 겨울 캠프", author: "작성자3", date: "2024-12-01", counts: 12 },
  { no: 4, title: "겨울 번개", author: "작성자4", date: "2024-11-30", counts: 8 },
  { no: 5, title: " 번개", author: "작성자4", date: "2024-11-30", counts: 8 },
  { no: 9, title: "겨울 ", author: "작성자4", date: "2024-11-30", counts: 8 },
  { no: 8, title: " 번개", author: "작성자4", date: "2024-11-30", counts: 8 },
  { no: 57, title: " 번개", author: "작성자4", date: "2024-11-30", counts: 8 },
  { no: 123, title: "겨울 ", author: "작성자4", date: "2024-11-30", counts: 8 },
  { no: 153, title: "겨울 번개", author: "작성자4", date: "2024-11-30", counts: 8 },
  { no: 12, title: "겨울 번개", author: "작성자4", date: "2024-11-30", counts: 8 },
  { no: 56, title: "겨울 번개", author: "작성자4", date: "2024-11-30", counts: 8 },
  { no: 58, title: "겨울 번개", author: "작성자4", date: "2024-11-30", counts: 8 },
  { no: 99, title: "겨울 번개", author: "작성자4", date: "2024-11-30", counts: 8 },
  { no: 100, title: "겨울 번개", author: "작성자4", date: "2024-11-30", counts: 8 },
  { no: 110, title: "겨울 번개", author: "작성자4", date: "2024-11-30", counts: 8 },
  { no: 120, title: "겨울 번개", author: "작성자4", date: "2024-11-30", counts: 8 },
  { no: 130, title: "겨울 번개", author: "작성자4", date: "2024-11-30", counts: 8 },
  { no: 140, title: "겨울 번개", author: "작성자4", date: "2024-11-30", counts: 8 },
  { no: 150, title: "겨울 번개", author: "작성자4", date: "2024-11-30", counts: 8 },
  { no: 160, title: "겨울 번개", author: "작성자4", date: "2024-11-30", counts: 8 },
  { no: 170, title: "겨울 번개", author: "작성자4", date: "2024-11-30", counts: 8 },
  
  /* ... 추가적인 데이터 ... */
];

export default function LightningMeetingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRows, setFilteredRows] = useState(rows);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 한 페이지당 10개
  const router = useRouter();

  const handleSearch = () => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    const searchTermFilter = searchTerm
      ? (row) =>
          row.title.toLowerCase().includes(lowerSearchTerm) ||
          row.author.toLowerCase().includes(lowerSearchTerm)
      : () => true;

    const dateFilter = selectedDate
      ? (row) => row.date === selectedDate
      : () => true;

    const filtered = rows.filter((row) => searchTermFilter(row) && dateFilter(row));
    setFilteredRows(filtered);
    setCurrentPage(1); // 검색 후 첫 페이지로 이동
  };

  const handleTitleClick = (row) => {
    router.push(`/MeetingGroup/lightning-Meeting/detail/${row.no}`);
  };

  const totalItems = filteredRows.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box sx={{ textAlign: "center", padding: "20px", paddingTop: "80px", margin: '0 auto', width: '70%' }}>
      <Box sx={{ "& > :not(style)": { m: 1 } }}>
        <Typography
          variant="h4"
          component="div"
          sx={{ fontWeight: "bold", marginBottom: "20px" }}
        >
          <a
            href="/MeetingGroup/lightning-Meeting"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            번개모임 &nbsp;
          </a>
          <Fab
            size="small"
            color="secondary"
            aria-label="add"
            href="/MeetingGroup/lightning-Meeting-Make"
            style={{ backgroundColor: "#597445" }}
          >
            <AddIcon />
          </Fab>
        </Typography>
      </Box>
      <br />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          marginBottom: "20px",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="검색어를 입력하세요"
          sx={{ width: "300px" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <IconButton color="primary" size="large" onClick={handleSearch}>
          <SearchIcon sx={{ color: "green" }} />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", gap: 1, marginBottom: "20px", float: "right" }}>
        <TextField
          type="date"
          variant="outlined"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <IconButton color="primary" size="large" onClick={handleSearch}>
          <SearchIcon sx={{ color: "green" }} />
        </IconButton>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>제목</TableCell>
              <TableCell>글쓴이</TableCell>
              <TableCell>일정날짜</TableCell>
              <TableCell>조회수</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row) => (
                <TableRow key={row.no} onClick={() => handleTitleClick(row)}>
                  <TableCell>{row.no}</TableCell>
                  <TableCell>
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleTitleClick(row);
                      }}
                      color="primary"
                      sx={{ color: "inherit", textDecoration: "none" }}
                    >
                      {row.title}
                    </Link>
                  </TableCell>
                  <TableCell>{row.author}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.counts}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          // color="primary"
          siblingCount={2}
          boundaryCount={1}
          sx={{
            "& .MuiPaginationItem-root": {
              //backgroundColor: "rgba(0, 128, 0, 0.3)", // 녹색 배경 + 30% 투명도
              color: "black", // 글자색
              "&:hover": {
                backgroundColor: "rgba(0, 128, 0, 0.6)", // 녹색 배경 + 60% 투명도
              },
            },
            "& .Mui-selected": {
              backgroundColor:  "rgba(0, 128, 0)", // 선택된 페이지 녹색 배경
              color: "white", // 선택된 페이지 글자색
              fontWeight: "bold", // 선택된 페이지 글자 굵기
              "&:hover": {
                backgroundColor: "rgba(0, 128, 0, 1)", // 선택된 페이지 호버 시 
              },
            },
          }}
        />
      </Box>
    </Box>
  );
}
