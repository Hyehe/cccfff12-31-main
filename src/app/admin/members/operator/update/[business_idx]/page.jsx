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
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/navigation"; // 라우터 사용
import Link from "next/link";
import { fetchOperatorDetail } from "../../fetchOperatorDetail/page";

export default function CampingDetail({ params }) {
  const { business_idx } = use(params); // URL에서 전달된 id 값
  const [data, setData] = useState(null); // 캠핑장 데이터
  const [error, setError] = useState(null); // 에러 상태
  const router = useRouter();

  // 화면 크기 체크 (1000px 이하에서 텍스트 숨기기)
  const isSmallScreen = useMediaQuery("(max-width:1000px)");

  useEffect(() => {
    // 데이터를 가져오는 함수
    const fetchData = async () => {
      try {
        const business = await fetchOperatorDetail(business_idx);
        if (!business) {
          throw new Error("데이터를 찾을 수 없습니다.");
        }
        setData(business);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "데이터를 가져오는 데 실패했습니다.");
      }
    };
    if (business_idx) {
      fetchData();
    }
  }, [business_idx]); // id가 변경되면 데이터 다시 가져오기
  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  const [isCampingAvailable, setIsCampingAvailable] = useState(null);
  const checkCampingAvailability = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/camping/sites/check-contentId?contentId=${formData.contentId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const isDuplicate = await response.json(); // 백엔드에서 반환된 boolean 값을 확인
      setIsCampingAvailable(isDuplicate); // true: 존재, false: 존재하지 않음
    } catch (error) {
      console.error("Error checking ID availability:", error);
      alert("캠핑장 등록 확인 중 오류가 발생했습니다.");
      setIsCampingAvailable(null); // 오류 발생 시 상태 초기화
    }
  };

  const [formData, setFormData] = useState({
    business_name: "",
    business_number: "",
    started_date: "",
    contentId: "",
  });

  const handleSubmit = async () => {
    // contentId가 고정값으로 사용됨
    const business_idx = data.business_idx;
    if (!business_idx) {
      alert("business_idx 설정되지 않았습니다.");
      return;
    }
    const url = `http://localhost:8080/api/member/business/update/${business_idx}`;
    const formdata = new FormData();
    // 모든 데이터를 FormData로 변환 (빈 값은 추가하지 않음)
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== "" && value !== undefined && value !== null) {
        formdata.append(key, value);
      }
    });
    // FormData 확인용 출력
    console.log("전송할 FormData:");
    formdata.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    try {
      const response = await fetch(url, {
        method: "POST",
        body: formdata, // FormData 전송
      });
      if (response.ok) {
        alert("사용자 정보가 성공적으로 업데이트되었습니다.");
        router.push("/admin/members/view");
      } else {
        const error = await response.text();
        alert(`업데이트 실패: ${error}`);
      }
    } catch (err) {
      console.error("업데이트 중 오류 발생:", err);
      alert("업데이트 중 오류가 발생했습니다.");
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
            사업자 정보 수정
          </Typography>
          <Link
            href="/admin/members/view"
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
                        <TableCell>사업자 IDX</TableCell>
                        <TableCell>{data.business_idx}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>회원 IDX</TableCell>
                        <TableCell>{data.user_idx}</TableCell>
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell
                          className="custom-table-cell-title"
                          sx={{ width: "30%" }}
                        >
                          사업체명
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.business_name}
                            value={formData.business_name || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                business_name: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell
                          className="custom-table-cell-title"
                          sx={{ width: "30%" }}
                        >
                          사업자번호
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.business_number}
                            value={formData.business_number || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                business_number: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell
                          className="custom-table-cell-title"
                          sx={{ width: "30%" }}
                        >
                          사업체 등록일자
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.started_date}
                            value={formData.started_date || ""}
                            type="date"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                started_date: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell-title">
                          담당 캠핑장 IDX
                        </TableCell>
                        <TableCell>
                          <TextField
                            name="contentId"
                            value={formData.contentId}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                contentId: e.target.value,
                              })
                            }
                            onBlur={checkCampingAvailability}
                            fullWidth
                            className="input-field"
                            required
                            type="number"
                          />
                          {isCampingAvailable === true && (
                            <Typography
                              sx={{ color: "green", fontSize: "12px" }}
                            >
                              존재하는 캠핑장입니다.
                            </Typography>
                          )}
                          {isCampingAvailable === false && (
                            <Typography sx={{ color: "red", fontSize: "12px" }}>
                              해당 캠핑장은 존재하지 않습니다.
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box display="flex" justifyContent="flex-end" width={"100%"}>
                  <Link href="/admin/members/view" passHref>
                    <Button variant="outlined" sx={{ mr: 2 }}>
                      취소
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                  >
                    수정
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
