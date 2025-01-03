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
import { fetchMemberDetail } from "../../fetchMemberDetail/page";

export default function CampingDetail({ params }) {
  const { user_idx } = use(params); // URL에서 전달된 id 값
  const [data, setData] = useState(null); // 캠핑장 데이터
  const [error, setError] = useState(null); // 에러 상태
  const router = useRouter();

  const handleDetailClick = (user_idx) => {
    router.push(`/admin/members/update/${user_idx}`); // 디테일 페이지로 이동
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
  const maskEmail = (email) => {
    if (!email || !email.includes("@")) return ""; // 잘못된 이메일 처리
    const [localPart, domain] = email.split("@"); // 이메일을 '@' 기준으로 나눔
    if (localPart.length <= 2) {
      return "**@" + domain; // 앞부분이 2글자 이하라면 전부 마스킹
    }
    const maskedLocalPart = localPart.slice(0, -2) + "**"; // 마지막 2글자를 '**'로 교체
    return maskedLocalPart + "@" + domain;
  };

  const maskPhoneNumber = (phone) => {
    if (!phone || phone.length < 2) return ""; // 빈 값 또는 너무 짧은 값 처리
    const visiblePart = phone.slice(0, -2); // 뒤의 두 자리를 제외한 부분
    return visiblePart + "**"; // 마지막 두 자리 마스킹
  };

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
            회원 상세 정보
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
                        {data.username ? (
                          <TableCell>{maskMiddleName(data.username)}</TableCell>
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
                            {maskEmail(data.email)}
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
                          <TableCell>{maskPhoneNumber(data.phone)}</TableCell>
                        ) : (
                          <TableCell className="custom-table-cell">
                            정보없음
                          </TableCell>
                        )}
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
                        {data.address ? (
                          <TableCell>{data.address}</TableCell>
                        ) : (
                          <TableCell className="custom-table-cell">
                            정보없음
                          </TableCell>
                        )}
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
                    onClick={() => handleDetailClick(data.user_idx)}
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
