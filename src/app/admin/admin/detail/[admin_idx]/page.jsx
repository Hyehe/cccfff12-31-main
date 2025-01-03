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
import { fetchAdminDetail } from "../../fetchAdminDetail/page";
import axios from "axios";

export default function CampingDetail({ params }) {
  const { admin_idx } = use(params); // URL에서 전달된 id 값
  const [data, setData] = useState(null); // 캠핑장 데이터
  const [error, setError] = useState(null); // 에러 상태
  const router = useRouter();

  // 화면 크기 체크 (1000px 이하에서 텍스트 숨기기)
  const isSmallScreen = useMediaQuery("(max-width:1000px)");

  useEffect(() => {
    // 데이터를 가져오는 함수
    const fetchData = async () => {
      try {
        const admins = await fetchAdminDetail(admin_idx);
        if (!admins) {
          throw new Error("데이터를 찾을 수 없습니다.");
        }
        setData(admins);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "데이터를 가져오는 데 실패했습니다.");
      }
    };

    if (admin_idx) {
      fetchData();
    }
  }, [admin_idx]); // id가 변경되면 데이터 다시 가져오기

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm("정말로 이 항목을 삭제하시겠습니까?");
    if (!confirmDelete) {
      return; // 사용자가 취소 버튼을 누른 경우
    }
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/admin/admins/delete/${admin_idx}`
      );
      if (response.status === 200) {
        alert("삭제가 성공적으로 완료되었습니다.");
        router.push("/admin");
      } else {
        alert(`삭제에 실패했습니다: ${response.data}`);
      }
    } catch (error) {
      console.error("삭제 요청 중 오류 발생:", error);
      alert(`오류 발생: ${error.response?.data || error.message}`);
    }
  };
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
            관리자 상세 정보
          </Typography>
          <Link
            href="/admin"
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
                        <TableCell>관리자 IDX</TableCell>
                        <TableCell>{data.admin_idx}</TableCell>
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell
                          className="custom-table-cell-title"
                          sx={{ width: "40%" }}
                        >
                          회원 IDX
                        </TableCell>
                        <TableCell>{data.user_idx}</TableCell>
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell
                          className="custom-table-cell-title"
                          sx={{ width: "30%" }}
                        >
                          이름
                        </TableCell>
                        {data.username ? (
                          <TableCell>{data.username}</TableCell>
                        ) : (
                          <TableCell className="custom-table-cell">
                            정보없음
                          </TableCell>
                        )}
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell
                          className="custom-table-cell-title"
                          sx={{ width: "30%" }}
                        >
                          이메일
                        </TableCell>
                        {data.email ? (
                          <TableCell className="custom-table-cell">
                            {data.email}
                          </TableCell>
                        ) : (
                          <TableCell className="custom-table-cell">
                            정보없음
                          </TableCell>
                        )}
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell
                          className="custom-table-cell-title"
                          sx={{ width: "30%" }}
                        >
                          전화번호
                        </TableCell>
                        {data.phone ? (
                          <TableCell>{data.phone}</TableCell>
                        ) : (
                          <TableCell className="custom-table-cell">
                            정보없음
                          </TableCell>
                        )}
                      </TableRow>

                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell-title">
                          관리자 유형
                        </TableCell>
                        {data.admin_type === "super" ? (
                          <TableCell>슈퍼관리자</TableCell>
                        ) : (
                          <TableCell className="custom-table-cell">
                            일반관리자
                          </TableCell>
                        )}
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell-title">
                          등록일자
                        </TableCell>
                        {data.assigned_at ? (
                          <TableCell>{data.assigned_at}</TableCell>
                        ) : (
                          <TableCell className="custom-table-cell">
                            정보없음
                          </TableCell>
                        )}
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell-title">
                          재제여부
                        </TableCell>
                        {data.warn ? (
                          <TableCell>
                            O<p>담당자 : {data.warn}</p>
                            <p>재제 시작일자 : {data.warn_start_at}</p>
                          </TableCell>
                        ) : (
                          <TableCell className="custom-table-cell">X</TableCell>
                        )}
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box display="flex" justifyContent="flex-end" width={"100%"}>
                  <Link href="/admin" passHref>
                    <Button variant="outlined" sx={{ mr: 2 }}>
                      취소
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: "lightblue",
                      color: "white",
                      "&:hover": { backgroundColor: "blue" },
                    }}
                    onClick={handleDelete}
                  >
                    삭제
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
