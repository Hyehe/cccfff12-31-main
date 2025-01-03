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
import { fetchCampgroundById } from "@/app/fetchCampgroundByid/page";

export default function CampingDetail({ params }) {
  const { id } = use(params); // URL에서 전달된 id 값
  const [data, setData] = useState(null); // 캠핑장 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const router = useRouter();
  const [formData, setFormData] = useState({
    facltNm: "",
    lineIntro: "",
    intro: "",
    allar: "",
    bizrno: "",
    featureNm: "",
    lctCl: "",
    induty: "",
    doNm: "",
    sigunguNm: "",
    zipcode: "",
    addr1: "",
    direction: "",
    tel: "",
    homepage: "",
    sitedStnc: "",
    siteMg1Width: "",
    siteMg1Virticl: "",
    siteMg2Width: "",
    siteMg2Virticl: "",
    siteMg3Width: "",
    siteMg3Virticl: "",
    sbrsCl: "",
    animalCmgCl: "",
    posblFcltyCl: "",
    siteBottomCl1: "",
    siteBottomCl2: "",
    siteBottomCl3: "",
    siteBottomCl4: "",
    siteBottomCl5: "",
    firstImageUrl: null,
    brazierCl: "",
    price: "",
    gnrlSiteCo: "",
    caravSiteCo: "",
    autoSiteCo: "",
    glampSiteCo: "",
    sbrsEtc: "",
    glampInnerFclty: "",
    caravInnerFclty: "",
    mapX: "",
    mapY: "",
  });

  const handleSubmit = async () => {
    // contentId가 고정값으로 사용됨
    const contentId = data.contentId;

    if (!contentId) {
      alert("contentId가 설정되지 않았습니다.");
      return;
    }

    const url = `http://localhost:8080/api/camping/sites/update/${contentId}`;
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
        alert("캠핑장 정보가 성공적으로 업데이트되었습니다.");
        router.push("/admin/campgrounds/view");
      } else {
        const error = await response.text();
        alert(`업데이트 실패: ${error}`);
      }
    } catch (err) {
      console.error("업데이트 중 오류 발생:", err);
      alert("업데이트 중 오류가 발생했습니다.");
    }
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
            width: "1000px",
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
            캠핑장 정보 수정
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
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.facltNm}
                            value={formData.facltNm || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                facltNm: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>가격</TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.price}
                            value={formData.price || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                price: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>사업자번호</TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.bizrno}
                            value={formData.bizrno || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                bizrno: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>전체면적</TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.allar}
                            value={formData.allar || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                allar: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>전화번호</TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.tel}
                            value={formData.tel || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                tel: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>한줄소개</TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.lineIntro}
                            value={formData.lineIntro || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lineIntro: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>등록일</TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.createdtime}
                            value={formData.createdtime || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                createdtime: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>애완동물출입</TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.animalCmgCl}
                            value={formData.animalCmgCl || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                animalCmgCl: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>사이트간 거리</TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.sitedStnc}
                            value={formData.sitedStnc || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                sitedStnc: e.target.value,
                              })
                            }
                          />
                        </TableCell>
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
                          sx={{ width: "20%" }}
                        >
                          업종
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.induty}
                            value={formData.induty || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                induty: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custon-table-cell-title">
                          입지구분
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.lctCl}
                            value={formData.lctCl || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lctCl: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell-title">
                          도
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.doNm}
                            value={formData.doNm || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                doNm: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell-title">
                          시군구
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.sigunguNm}
                            value={formData.sigunguNm || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                sigunguNm: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell-title">
                          우편번호
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.zipcode}
                            value={formData.zipcode || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                zipcode: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell-title">
                          주소
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.addr1}
                            value={formData.addr1 || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                addr1: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell-title">
                          경도
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.mapX}
                            value={formData.mapX || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                mapX: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell-title">
                          위도
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.mapY}
                            value={formData.mapY || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                mapY: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell-title">
                          상세 주소
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.direction}
                            value={formData.direction || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                direction: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>화로대</TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.brazierCl}
                            value={formData.brazierCl || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                brazierCl: e.target.value,
                              })
                            }
                          />
                        </TableCell>
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
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.homepage}
                            value={formData.homepage || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                homepage: e.target.value,
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
                          대표 이미지 url
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.firstImageUrl}
                            value={formData.firstImageUrl || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                firstImageUrl: e.target.value,
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
                          특징
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            multiline
                            rows={4}
                            placeholder={data.featureNm}
                            value={formData.featureNm || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                featureNm: e.target.value,
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
                          캠핑장 소개
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            multiline
                            rows={6}
                            placeholder={data.intro}
                            value={formData.intro || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                intro: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell-title">
                          부대시설
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.sbrsCl}
                            value={formData.sbrsCl || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                sbrsCl: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell-title">
                          부대시설 기타
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.sbrsEtc}
                            value={formData.sbrsEtc || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                sbrsEtc: e.target.value,
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
                          주변 이용가능 시설
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.posblFcltyCl}
                            value={formData.posblFcltyCl || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                posblFcltyCl: e.target.value,
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
                          글램핑 내부시설
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.glampInnerFclty}
                            value={formData.glampInnerFclty || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                glampInnerFclty: e.target.value,
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
                          카라반 내부시설
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.caravInnerFclty}
                            value={formData.caravInnerFclty || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                caravInnerFclty: e.target.value,
                              })
                            }
                          />
                        </TableCell>
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
                              <Typography>
                                <TextField
                                  fullWidth
                                  placeholder={data.siteBottomCl1}
                                  value={formData.siteBottomCl1 || ""}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      siteBottomCl1: e.target.value,
                                    })
                                  }
                                />
                              </Typography>
                            </Box>
                            {/* 파쇄석 */}
                            <Box sx={{ textAlign: "center", flex: 1 }}>
                              <Typography variant="caption">파쇄석</Typography>
                              <Typography>
                                <TextField
                                  fullWidth
                                  placeholder={data.siteBottomCl2}
                                  value={formData.siteBottomCl2 || ""}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      siteBottomCl2: e.target.value,
                                    })
                                  }
                                />
                              </Typography>
                            </Box>
                            {/* 테크 */}
                            <Box sx={{ textAlign: "center", flex: 1 }}>
                              <Typography variant="caption">테크</Typography>
                              <Typography>
                                <TextField
                                  fullWidth
                                  placeholder={data.siteBottomCl3}
                                  value={formData.siteBottomCl3 || ""}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      siteBottomCl3: e.target.value,
                                    })
                                  }
                                />
                              </Typography>
                            </Box>
                            {/* 자갈 */}
                            <Box sx={{ textAlign: "center", flex: 1 }}>
                              <Typography variant="caption">자갈</Typography>
                              <Typography>
                                <TextField
                                  fullWidth
                                  placeholder={data.siteBottomCl4}
                                  value={formData.siteBottomCl4 || ""}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      siteBottomCl4: e.target.value,
                                    })
                                  }
                                />
                              </Typography>
                            </Box>
                            {/* 맨흙 */}
                            <Box sx={{ textAlign: "center", flex: 1 }}>
                              <Typography variant="caption">맨흙</Typography>
                              <Typography>
                                <TextField
                                  fullWidth
                                  placeholder={data.siteBottomCl5}
                                  value={formData.siteBottomCl5 || ""}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      siteBottomCl5: e.target.value,
                                    })
                                  }
                                />
                              </Typography>
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
                              <Typography>
                                <TextField
                                  fullWidth
                                  placeholder={data.gnrlSiteCo}
                                  value={formData.gnrlSiteCo || ""}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      gnrlSiteCo: e.target.value,
                                    })
                                  }
                                />
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: "center", flex: 1 }}>
                              <Typography variant="caption">
                                자동차야영장
                              </Typography>
                              <Typography>
                                <TextField
                                  fullWidth
                                  placeholder={data.autoSiteCo}
                                  value={formData.autoSiteCo || ""}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      autoSiteCo: e.target.value,
                                    })
                                  }
                                />
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: "center", flex: 1 }}>
                              <Typography variant="caption">글램핑</Typography>
                              <Typography>
                                <TextField
                                  fullWidth
                                  placeholder={data.glampSiteCo}
                                  value={formData.glampSiteCo || ""}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      glampSiteCo: e.target.value,
                                    })
                                  }
                                />
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: "center", flex: 1 }}>
                              <Typography variant="caption">카라반</Typography>
                              <Typography>
                                <TextField
                                  fullWidth
                                  placeholder={data.caravSiteCo}
                                  value={formData.caravSiteCo || ""}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      caravSiteCo: e.target.value,
                                    })
                                  }
                                />
                              </Typography>
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
                                <Typography>
                                  <TextField
                                    fullWidth
                                    placeholder={data.siteMg1Width}
                                    value={formData.siteMg1Width || ""}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        siteMg1Width: e.target.value,
                                      })
                                    }
                                  />
                                </Typography>
                                <Typography variant="body1">x</Typography>
                                <Typography>
                                  <TextField
                                    fullWidth
                                    placeholder={data.siteMg1Virticl}
                                    value={formData.siteMg1Virticl || ""}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        siteMg1Virticl: e.target.value,
                                      })
                                    }
                                  />
                                </Typography>
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
                                <Typography>
                                  <TextField
                                    fullWidth
                                    placeholder={data.siteMg2Width}
                                    value={formData.siteMg2Width || ""}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        siteMg2Width: e.target.value,
                                      })
                                    }
                                  />
                                </Typography>
                                <Typography variant="body1">x</Typography>
                                <Typography>
                                  <TextField
                                    fullWidth
                                    placeholder={data.siteMg2Virticl}
                                    value={formData.siteMg2Virticl || ""}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        siteMg2Virticl: e.target.value,
                                      })
                                    }
                                  />
                                </Typography>
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
                                <Typography>
                                  <TextField
                                    fullWidth
                                    placeholder={data.siteMg3Width}
                                    value={formData.siteMg3Width || ""}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        siteMg3Width: e.target.value,
                                      })
                                    }
                                  />
                                </Typography>
                                <Typography variant="body1">x</Typography>
                                <Typography>
                                  <TextField
                                    fullWidth
                                    placeholder={data.siteMg3Virticl}
                                    value={formData.siteMg3Virticl || ""}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        siteMg3Virticl: e.target.value,
                                      })
                                    }
                                  />
                                </Typography>
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
