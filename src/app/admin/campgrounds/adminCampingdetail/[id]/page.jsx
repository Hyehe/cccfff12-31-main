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
import { fetchCampgroundById } from "@/app/fetchCampgroundByid/page";

export default function CampingDetail({ params }) {
  const { id } = use(params); // URL에서 전달된 id 값
  const [data, setData] = useState(null); // 캠핑장 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const router = useRouter();

  // 수정 페이지로 이동
  const handleDetailClick = (contentId) => {
    router.push(`/admin/campgrounds/adminCampingupdate/${contentId}`); // 수정 페이지로 이동
  };

  // 화면 크기 체크 (1000px 이하에서 텍스트 숨기기)
  const isSmallScreen = useMediaQuery("(max-width:1000px)");

  useEffect(() => {
    // 데이터를 가져오는 함수
    const fetchData = async () => {
      try {
        const campground = await fetchCampgroundById(id); // fetchCampgroundById 호출
        if (!campground) {
          throw new Error("캠핑장 데이터를 찾을 수 없습니다.");
        }
        setData(campground); // 데이터 설정
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("데이터를 가져오는 데 실패했습니다.");
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    };

    fetchData(); // 데이터 가져오기
  }, [id]); // id가 변경되면 데이터 다시 가져오기

  if (loading) {
    return <div>로딩 중...</div>;
  }

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
            width: "800px",
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
            캠핑장 상세 정보
          </Typography>
          <Link href="/admin/campgrounds/view" passHref>
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
                {/* 좌측 테이블 */}
                <TableContainer sx={{ flex: 1, minWidth: "300px" }}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>캠핑장 ID</TableCell>
                        <TableCell>{data.contentId}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>캠핑장 이름</TableCell>
                        <TableCell>{data.facltNm}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>가격</TableCell>
                        <TableCell>{data.price}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>사업자번호</TableCell>
                        {data.bizrno ? (
                          <TableCell>{data.bizrno}</TableCell>
                        ) : (
                          <TableCell>정보없음</TableCell>
                        )}
                      </TableRow>
                      <TableRow>
                        <TableCell>전체면적</TableCell>
                        {data.allar ? (
                          <TableCell>{data.allar}</TableCell>
                        ) : (
                          <TableCell>정보없음</TableCell>
                        )}
                      </TableRow>
                      <TableRow>
                        <TableCell>전화번호</TableCell>
                        {data.tel ? (
                          <TableCell>{data.tel}</TableCell>
                        ) : (
                          <TableCell>정보없음</TableCell>
                        )}
                      </TableRow>

                      <TableRow>
                        <TableCell>한줄소개</TableCell>
                        {data.lineIntro ? (
                          <TableCell>{data.lineIntro}</TableCell>
                        ) : (
                          <TableCell>정보없음</TableCell>
                        )}
                      </TableRow>
                      <TableRow>
                        <TableCell>등록일</TableCell>
                        {data.createdtime ? (
                          <TableCell>{data.createdtime}</TableCell>
                        ) : (
                          <TableCell>정보없음</TableCell>
                        )}
                      </TableRow>
                      <TableRow>
                        <TableCell>애완동물출입</TableCell>
                        {data.animalCmgCl ? (
                          <TableCell>{data.animalCmgCl}</TableCell>
                        ) : (
                          <TableCell>정보없음</TableCell>
                        )}
                      </TableRow>
                      <TableRow>
                        <TableCell>사이트간 거리</TableCell>
                        {data.sitedStnc ? (
                          <TableCell>{data.sitedStnc}</TableCell>
                        ) : (
                          <TableCell>정보없음</TableCell>
                        )}
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                {/* 우측 테이블 */}
                <TableContainer sx={{ flex: 1, minWidth: "300px" }}>
                  <Table>
                    <TableBody>
                      <TableRow className="custom-table-row">
                        <TableCell
                          className="custom-table-cell-title"
                          sx={{ width: "30%" }}
                        >
                          업종
                        </TableCell>
                        {data.induty ? (
                          <TableCell className="custom-table-cell">
                            {data.induty}
                          </TableCell>
                        ) : (
                          <TableCell className="custom-table-cell">
                            정보없음
                          </TableCell>
                        )}
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custon-table-cell-title">
                          입지
                        </TableCell>
                        {data.lctCl ? (
                          <TableCell className="custom-table-cell">
                            {data.lctCl}
                          </TableCell>
                        ) : (
                          <TableCell className="custom-table-cell">
                            정보없음
                          </TableCell>
                        )}
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell-title">
                          도
                        </TableCell>
                        {data.doNm ? (
                          <TableCell className="custom-table-cell">
                            {data.doNm}
                          </TableCell>
                        ) : (
                          <TableCell className="custom-table-cell">
                            정보없음
                          </TableCell>
                        )}
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell-title">
                          시군구
                        </TableCell>
                        {data.sigunguNm ? (
                          <TableCell className="custom-table-cell">
                            {data.sigunguNm}
                          </TableCell>
                        ) : (
                          <TableCell className="custom-table-cell">
                            정보없음
                          </TableCell>
                        )}
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell-title">
                          우편번호
                        </TableCell>
                        {data.zipcode ? (
                          <TableCell className="custom-table-cell">
                            {data.zipcode}
                          </TableCell>
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
                        {data.addr1 ? (
                          <TableCell className="custom-table-cell">
                            {data.addr1}
                          </TableCell>
                        ) : (
                          <TableCell className="custom-table-cell">
                            정보없음
                          </TableCell>
                        )}
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell-title">
                          경도
                        </TableCell>
                        {data.mapX ? (
                          <TableCell className="custom-table-cell">
                            {data.mapX}
                          </TableCell>
                        ) : (
                          <TableCell className="custom-table-cell">
                            정보없음
                          </TableCell>
                        )}
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell-title">
                          위도
                        </TableCell>
                        {data.mapY ? (
                          <TableCell className="custom-table-cell">
                            {data.mapY}
                          </TableCell>
                        ) : (
                          <TableCell className="custom-table-cell">
                            정보없음
                          </TableCell>
                        )}
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell-title">
                          상세
                        </TableCell>
                        {data.direction ? (
                          <TableCell className="custom-table-cell">
                            {data.direction}
                          </TableCell>
                        ) : (
                          <TableCell className="custom-table-cell">
                            정보없음
                          </TableCell>
                        )}
                      </TableRow>
                      <TableRow>
                        <TableCell>화로대</TableCell>
                        {data.brazierCl ? (
                          <TableCell>{data.brazierCl}</TableCell>
                        ) : (
                          <TableCell>정보없음</TableCell>
                        )}
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                {/* 밑에 테이블 */}
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>홈페이지 주소</TableCell>
                        {data.homepage ? (
                          <TableCell>{data.homepage}</TableCell>
                        ) : (
                          <TableCell>정보없음</TableCell>
                        )}
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell
                          className="custom-table-cell-title"
                          sx={{ width: "30%" }}
                        >
                          대표 이미지 url
                        </TableCell>
                        {data.firstImageUrl ? (
                          <TableCell>{data.firstImageUrl}</TableCell>
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
                          특징
                        </TableCell>
                        {data.featureNm ? (
                          <TableCell className="custom-table-cell">
                            {data.featureNm}
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
                          캠핑장 소개
                        </TableCell>
                        {data.intro ? (
                          <TableCell>{data.intro}</TableCell>
                        ) : (
                          <TableCell className="custom-table-cell">
                            정보없음
                          </TableCell>
                        )}
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell-title">
                          부대시설
                        </TableCell>
                        {data.sbrsCl ? (
                          <TableCell>{data.sbrsCl}</TableCell>
                        ) : (
                          <TableCell className="custom-table-cell">
                            정보없음
                          </TableCell>
                        )}
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell-title">
                          부대시설 기타
                        </TableCell>
                        {data.sbrsEtc ? (
                          <TableCell className="custom-table-cell">
                            {data.sbrsEtc}
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
                          주변 이용가능 시설
                        </TableCell>
                        {data.posblFcltyCl ? (
                          <TableCell>{data.posblFcltyCl}</TableCell>
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
                          글램핑 내부시설
                        </TableCell>
                        {data.glampInnerFclty ? (
                          <TableCell>{data.glampInnerFclty}</TableCell>
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
                          카라반 내부시설
                        </TableCell>
                        {data.caravInnerFclty ? (
                          <TableCell>{data.caravInnerFclty}</TableCell>
                        ) : (
                          <TableCell className="custom-table-cell">
                            정보없음
                          </TableCell>
                        )}
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell">
                          사이트 개수
                        </TableCell>
                        <TableCell className="custom-table-cell-content">
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: 2,
                            }}
                          >
                            {/* 잔디 */}
                            <Box sx={{ textAlign: "center", flex: 1 }}>
                              <Typography variant="caption">잔디</Typography>
                              <Typography>{data.siteBottomCl1}</Typography>
                            </Box>
                            {/* 파쇄석 */}
                            <Box sx={{ textAlign: "center", flex: 1 }}>
                              <Typography variant="caption">파쇄석</Typography>
                              <Typography>{data.siteBottomCl2}</Typography>
                            </Box>
                            {/* 테크 */}
                            <Box sx={{ textAlign: "center", flex: 1 }}>
                              <Typography variant="caption">테크</Typography>
                              <Typography>{data.siteBottomCl3}</Typography>
                            </Box>
                            {/* 자갈 */}
                            <Box sx={{ textAlign: "center", flex: 1 }}>
                              <Typography variant="caption">자갈</Typography>
                              <Typography>{data.siteBottomCl4}</Typography>
                            </Box>
                            {/* 맨흙 */}
                            <Box sx={{ textAlign: "center", flex: 1 }}>
                              <Typography variant="caption">맨흙</Typography>
                              <Typography>{data.siteBottomCl5}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell">
                          주요시설
                        </TableCell>
                        <TableCell className="custom-table-cell-content">
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: 2,
                            }}
                          >
                            <Box sx={{ textAlign: "center", flex: 1 }}>
                              <Typography variant="caption">
                                일반야영장
                              </Typography>
                              <Typography>{data.gnrlSiteCo}</Typography>
                            </Box>
                            <Box sx={{ textAlign: "center", flex: 1 }}>
                              <Typography variant="caption">
                                자동차야영장
                              </Typography>
                              <Typography>{data.autoSiteCo}</Typography>
                            </Box>
                            <Box sx={{ textAlign: "center", flex: 1 }}>
                              <Typography variant="caption">글램핑</Typography>
                              <Typography>{data.glampSiteCo}</Typography>
                            </Box>
                            <Box sx={{ textAlign: "center", flex: 1 }}>
                              <Typography variant="caption">카라반</Typography>
                              <Typography>{data.caravSiteCo}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                      </TableRow>
                      {/* 사이트 크기 */}
                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell">
                          사이트 크기
                        </TableCell>
                        <TableCell className="custom-table-cell-content">
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: 2,
                            }}
                          >
                            {/* 크기 1 */}
                            <Box sx={{ textAlign: "center", flex: 1 }}>
                              <Typography variant="caption">크기 1</Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  justifyContent: "center",
                                  mt: 1,
                                }}
                              >
                                <Typography>{data.siteMg1Width}</Typography>
                                <Typography variant="body1">x</Typography>
                                <Typography>{data.siteMg1Virticl}</Typography>
                              </Box>
                            </Box>
                            {/* 크기 2 */}
                            <Box sx={{ textAlign: "center", flex: 1 }}>
                              <Typography variant="caption">크기 2</Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  justifyContent: "center",
                                  mt: 1,
                                }}
                              >
                                <Typography>{data.siteMg2Width}</Typography>
                                <Typography variant="body1">x</Typography>
                                <Typography>{data.siteMg2Virticl}</Typography>
                              </Box>
                            </Box>
                            {/* 크기 3 */}
                            <Box sx={{ textAlign: "center", flex: 1 }}>
                              <Typography variant="caption">크기 3</Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  justifyContent: "center",
                                  mt: 1,
                                }}
                              >
                                <Typography>{data.siteMg3Width}</Typography>
                                <Typography variant="body1">x</Typography>
                                <Typography>{data.siteMg3Virticl}</Typography>
                              </Box>
                            </Box>
                          </Box>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box display="flex" justifyContent="flex-end" width={"100%"}>
                  <Link href="/admin/campgrounds/view" passHref>
                    <Button variant="outlined" sx={{ mr: 2 }}>
                      취소
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={() => handleDetailClick(data.contentId)}
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
