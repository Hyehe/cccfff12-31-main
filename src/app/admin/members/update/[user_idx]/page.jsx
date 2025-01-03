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
import { fetchMemberDetail } from "../../fetchMemberDetail/page";

export default function CampingDetail({ params }) {
  const { user_idx } = use(params); // URL에서 전달된 id 값
  const [data, setData] = useState(null); // 캠핑장 데이터
  const [error, setError] = useState(null); // 에러 상태
  const router = useRouter();

  // 화면 크기 체크 (1000px 이하에서 텍스트 숨기기)
  const isSmallScreen = useMediaQuery("(max-width:1000px)");

  useEffect(() => {
    // 데이터를 가져오는 함수
    const fetchData = async () => {
      try {
        const members = await fetchMemberDetail(user_idx);
        if (!members) {
          throw new Error("데이터를 찾을 수 없습니다.");
        }
        setData(members);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "데이터를 가져오는 데 실패했습니다.");
      }
    };
    if (user_idx) {
      fetchData();
    }
  }, [user_idx]); // id가 변경되면 데이터 다시 가져오기
  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleSubmit = async () => {
    // contentId가 고정값으로 사용됨
    const user_idx = data.user_idx;
    if (!user_idx) {
      alert("user_idx 설정되지 않았습니다.");
      return;
    }
    const url = `http://localhost:8080/api/member/members/update/${user_idx}`;
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
            회원 정보 수정
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
                        <TableCell>IDX</TableCell>
                        <TableCell>{data.user_idx}</TableCell>
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell
                          className="custom-table-cell-title"
                          sx={{ width: "40%" }}
                        >
                          ID
                        </TableCell>
                        {data.id ? (
                          <TableCell>{data.id}</TableCell>
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
                          이름
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.username}
                            value={formData.username || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                username: e.target.value,
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
                          이메일
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.email}
                            value={formData.email || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
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
                          전화번호
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.phone}
                            value={formData.phone || ""}
                            type="number"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell-title">
                          sns로그인 - 카카오
                        </TableCell>
                        {data.sns_email_kakao ? (
                          <TableCell>{data.sns_email_kakao}</TableCell>
                        ) : (
                          <TableCell className="custom-table-cell">
                            정보없음
                          </TableCell>
                        )}
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell-title">
                          sns로그인 - 구글
                        </TableCell>
                        {data.sns_email_google ? (
                          <TableCell>{data.sns_email_google}</TableCell>
                        ) : (
                          <TableCell className="custom-table-cell">
                            정보없음
                          </TableCell>
                        )}
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell-title">
                          sns로그인 - 네이버
                        </TableCell>
                        {data.sns_email_naver ? (
                          <TableCell>{data.sns_email_naver}</TableCell>
                        ) : (
                          <TableCell className="custom-table-cell">
                            정보없음
                          </TableCell>
                        )}
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell-title">
                          주소
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.address}
                            value={formData.address || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                address: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell-title">
                          가입일자
                        </TableCell>
                        {data.join_date ? (
                          <TableCell>{data.join_date}</TableCell>
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
