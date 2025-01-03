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
import Link from "next/link";
import { fetchUsageDetail } from "../../fetchReservationDetail/page";

export default function CampingDetail({ params }) {
  const { history_idx } = use(params); // URL에서 전달된 id 값
  const [data, setData] = useState(null); // 캠핑장 데이터
  const [error, setError] = useState(null); // 에러 상태

  // 화면 크기 체크 (1000px 이하에서 텍스트 숨기기)
  const isSmallScreen = useMediaQuery("(max-width:1000px)");

  useEffect(() => {
    // 데이터를 가져오는 함수
    const fetchData = async () => {
      try {
        const usage = await fetchUsageDetail(history_idx);
        if (!usage) {
          throw new Error("데이터를 찾을 수 없습니다.");
        }
        setData(usage);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "데이터를 가져오는 데 실패했습니다.");
      }
    };
    if (history_idx) {
      fetchData();
    }
  }, [history_idx]); // id가 변경되면 데이터 다시 가져오기
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
            예약/이용 상세 내역
          </Typography>
          <Link
            href="/admin/campgrounds/reservations"
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
                        <TableCell>{data.history_idx}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>예약자</TableCell>
                        <TableCell>{data.username}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>예약된 캠핑장</TableCell>
                        <TableCell>{data.facltNm}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>상태</TableCell>
                        <TableCell>{data.action_type}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>여행일자</TableCell>
                        <TableCell>{data.action_date}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>예약일자</TableCell>
                        <TableCell>{data.created_at}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>결제 금액</TableCell>
                        <TableCell>{data.payment_amount}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box display="flex" justifyContent="flex-end" width={"100%"}>
                  <Link href="/admin/campgrounds/reservations" passHref>
                    <Button variant="outlined" sx={{ mr: 2 }}>
                      취소
                    </Button>
                  </Link>
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
