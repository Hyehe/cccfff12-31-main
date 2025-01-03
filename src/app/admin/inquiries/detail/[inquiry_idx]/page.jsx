"use client";

import React, { useState, useEffect, use } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/navigation"; // 라우터 사용
import Link from "next/link";
import { fetchInquiryDetail } from "../../fetchInquiryDetail/page";

export default function CampingDetail({ params }) {
  const { inquiry_idx } = use(params); // URL에서 전달된 id 값
  const [data, setData] = useState(null); // 캠핑장 데이터
  const [error, setError] = useState(null); // 에러 상태
  const router = useRouter();

  const handleAnswerClick = (inquiry_idx) => {
    router.push(`/admin/inquiries/answer/write/${inquiry_idx}`); // 답변 페이지로 이동
  };

  const maskMiddleName = (name) => {
    if (!name || name.length === 0) return ""; // 빈 문자열 처리

    const length = name.length;

    if (length === 1) {
      return name; // 1글자면 그대로 반환
    } else if (length === 2) {
      return name[0] + "*"; // 2글자면 마지막 글자 마스킹
    } else {
      const firstChar = name[0]; // 첫 글자
      const lastChar = name[length - 1]; // 마지막 글자
      const maskedMiddle = "*".repeat(length - 2); // 가운데 글자수만큼 '*'
      return firstChar + maskedMiddle + lastChar;
    }
  };

  // 화면 크기 체크 (1000px 이하에서 텍스트 숨기기)
  const isSmallScreen = useMediaQuery("(max-width:1000px)");

  useEffect(() => {
    // 데이터를 가져오는 함수
    const fetchData = async () => {
      try {
        const inquiry = await fetchInquiryDetail(inquiry_idx);
        if (!inquiry) {
          throw new Error("데이터를 찾을 수 없습니다.");
        }
        setData(inquiry);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "데이터를 가져오는 데 실패했습니다.");
      }
    };
    if (inquiry_idx) {
      fetchData();
    }
  }, [inquiry_idx]); // id가 변경되면 데이터 다시 가져오기

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div>
      <Box
        sx={{
          padding: "80px 40px 40px 40px",
          backgroundColor: "grey",
          color: "black",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "5px",
            width: "600px",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              marginTop: "20px",
              marginBottom: "20px",
              fontWeight: "bold",
              fontSize: "28px",
              color: "#333",
            }}
          >
            문의 상세보기
          </Typography>
          <Link
            href="/admin/inquiries"
            passHref
            style={{ textDecoration: "none", color: "black" }}
          >
            <p>[목록으로 돌아가기]</p>
          </Link>
          <hr></hr>
          {data ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between", // 좌우로 정렬
                  gap: "10px", // 두 테이블 간 간격
                  flexWrap: "wrap", // 화면이 좁아질 경우 테이블이 아래로 내려감
                }}
              >
                {/* 밑에 테이블 */}
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>IDX</TableCell>
                        <TableCell>{data.inquiry_idx}</TableCell>
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell
                          className="custom-table-cell-title"
                          sx={{ width: "40%" }}
                        >
                          작성자
                        </TableCell>
                        {data.username ? (
                          <TableCell>{maskMiddleName(data.username)}</TableCell>
                        ) : (
                          <TableCell className="custom-table-cell">
                            정보없음
                          </TableCell>
                        )}
                      </TableRow>
                      <TableRow>
                        <TableCell>제목</TableCell>
                        <TableCell>{data.subject}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>내용</TableCell>
                        <TableCell>{data.content}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>작성일자</TableCell>
                        <TableCell>{data.created_at}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box display="flex" justifyContent="flex-end" width={"100%"}>
                  <Link href="/admin/inquiries" passHref>
                    <Button variant="outlined" sx={{ mr: 2 }}>
                      취소
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={() => handleAnswerClick(data.user_idx)}
                  >
                    답변
                  </Button>
                </Box>
              </Box>
            </>
          ) : (
            <p>데이터 없음</p>
          )}
        </Box>
      </Box>
    </div>
  );
}
