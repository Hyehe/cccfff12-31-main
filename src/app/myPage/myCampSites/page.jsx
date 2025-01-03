// import React from 'react';

// function page(props) {
//   return (
//     <div>
      
//     </div>
//   );
// }

// export default page;
"use client";

import React, { useEffect, useState } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CallIcon from "@mui/icons-material/Call";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { Close, Image as ImageIcon } from "@mui/icons-material";
import {
  SportsSoccer,
  Wifi,
  LocalFireDepartment,
  Pool,
  ChildCare,
  ShoppingCart,
  Store,
} from "@mui/icons-material";
import HikingIcon from "@mui/icons-material/Hiking";
import { useRouter } from "next/navigation";
import RefreshIcon from "@mui/icons-material/Refresh";
import { fetchCampgrounds } from "./CampGround";
import { Avatar, Box, Button, IconButton, Pagination, Paper, Stack, SvgIcon, TextField, Typography } from "@mui/material";
import './styles.css'

function CampgroundSearchPage() {
  // 데이터 불러오기
  const [data, setData] = useState(null); // 캠핑장 데이터를 저장
  const [filteredData, setFilteredData] = useState([]); // 필터링된 데이터

  // detail로 가기 위함
  const router = useRouter();
  // 페이지
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const itemsPerPage = 10; // 페이지당 아이템 수

  // 컴포넌트가 마운트될 때 API 호출
  useEffect(() => {
    const getData = async () => {
      const campgrounds = await fetchCampgrounds(); // fetchCampgrounds 함수 사용
      setData(campgrounds); // 데이터를 상태에 저장
      setFilteredData(campgrounds); // 초기에는 모든 데이터 표시
    };
    getData();
  }, []);

  // 상세 페이지로 이동
  const handleDetailClick = (contentId) => {
    router.push(`/admin/campgrounds/campingdetail/${contentId}`); // 디테일 페이지로 이동
  };

  // 페이징
  // 페이지 변경 시 호출되는 함수
  const handlePageChange = (event, value) => {
    setCurrentPage(value); // 페이지 상태 업데이트
  };

  // 현재 페이지에 해당하는 데이터 계산
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
  // 전체 페이지 수 계산
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  // 페이지네이션 범위 (10개씩 표시)
  const getPageNumbers = () => {
    let start = Math.max(currentPage - 4, 1); // 현재 페이지에서 왼쪽으로 최대 4개 페이지 표시
    let end = Math.min(start + 9, totalPages); // 현재 페이지에서 오른쪽으로 최대 9개 페이지 표시

    if (end - start < 9) {
      start = Math.max(end - 9, 1); // 페이지 범위가 9개 미만일 경우 조정
    }

    let pageNumbers = [];
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };
  const regions = [
    "서울",
    "부산",
    "대구",
    "인천",
    "광주",
    "대전",
    "울산",
    "세종",
    "경기도",
    "강원도",
    "충청북도",
    "충청남도",
    "전라북도",
    "전라남도",
    "경상북도",
    "경상남도",
    "제주도",
  ];

  return (
    <>
    <Typography sx={{
      fontSize : "30px",
      ml:"15px",
      textAlign: "center",
    }}>
      내가 찜한 캠핑장
    </Typography>
      {/* Search Bar Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column", // 세로로 정렬
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "url(/images/campingimg.webp)", // 배경 이미지
          backgroundSize: "cover", // 이미지 크기 조정
          backgroundPosition: "center", // 이미지 위치 중앙
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        {currentData && currentData.length > 0 ? (
          currentData.map((item, index) => (
            <Paper key={index} className="camping-item" style={{width:"100%", height:"100%" , marginTop:"10px"}}>
              <div className="camping-item-content">
                {/* 이미지가 없을 경우 Avatar와 기본 아이콘을 표시 */}
                {item.firstImageUrl ? (
                  <img
                    src={item.firstImageUrl}
                    alt={item.facltNm}
                    className="camping-item-img"
                    onError={(e) => {
                      // 이미지 로드 실패 시 기본 이미지로 대체
                      e.target.onerror = null;
                      e.target.src = ""; // 또는 기본 이미지 URL로 설정
                    }}
                  />
                ) : (
                  // 이미지가 없을 경우 Avatar와 기본 아이콘 표시
                  <Avatar sx={{ width: 400, height: 200 }}>
                    <ImageIcon />
                  </Avatar>
                )}
                <div className="camping-item-text">
                  <Box 
                    sx={{
                      display: 'flex'
                    }}
                  >
                    <Typography
                      style={{
                        color: "black",
                        fontSize: "12px",
                        backgroundColor: "pink",
                        padding: "3px",
                        borderRadius: "5px"
                      }}
                    >
                      찜 (예시)개
                    </Typography>

                    <Typography
                      style={{
                        color: "black",
                        fontSize: "12px",
                        backgroundColor: "#FFF5D7",
                        marginLeft: "10px",
                        padding: "3px",
                      }}
                    >
                      리뷰 (예시)개
                    </Typography>
                  </Box>
                  <h1
                    className="camping-item-title"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDetailClick(item.contentId)}
                  >
                    {item.facltNm}
                  </h1>
                  <p style={{ color: "black", fontSize: "20px" }}>
                    {item.lineIntro}
                  </p>


                  <p className="camping-item-address">
                    <LocationOnIcon
                      style={{ marginRight: "5px", fontSize: "15px" }}
                    />
                    {item.addr1}

                    <CallIcon
                      style={{
                        marginRight: "5px",
                        marginLeft: "30px",
                        fontSize: "15px",
                      }}
                    />
                    {item.tel}
                  </p>


                  {/* 시설 아이콘 */}
                  <div
                    className="camping-item-facilities"
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "20px",
                      marginLeft: "20px",
                    }}
                  >
                    {item.sbrsCl &&
                      item.sbrsCl.split(",").map((facility, idx) => {
                        switch (facility.trim()) {
                          case "운동시설":
                            return (
                              <div
                                key={idx}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <FitnessCenterIcon
                                  style={{ fontSize: "30px", color: "#3f51b5" }}
                                />
                                <p
                                  style={{
                                    marginTop: "5px",
                                    textAlign: "center",
                                    color: "black",
                                  }}
                                >
                                  운동시설
                                </p>
                              </div>
                            );
                          case "전기":
                            return (
                              <div
                                key={idx}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <ElectricBoltIcon
                                  style={{
                                    fontSize: "30px",
                                    color: "#FADA7A",
                                  }}
                                />
                                <p
                                  style={{
                                    marginTop: "5px",
                                    textAlign: "center",
                                    color: "black",
                                  }}
                                >
                                  전기
                                </p>
                              </div>
                            );
                          case "무선인터넷":
                            return (
                              <div
                                key={idx}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <Wifi
                                  style={{ fontSize: "30px", color: "#00bcd4" }}
                                />
                                <p
                                  style={{
                                    marginTop: "5px",
                                    textAlign: "center",
                                    color: "black",
                                  }}
                                >
                                  무선인터넷
                                </p>
                              </div>
                            );
                          case "장작판매":
                            return (
                              <div
                                key={idx}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <ShoppingCart
                                  style={{ fontSize: "30px", color: "#8bc34a" }}
                                />
                                <p
                                  style={{
                                    marginTop: "5px",
                                    textAlign: "center",
                                    color: "black",
                                  }}
                                >
                                  장작판매
                                </p>
                              </div>
                            );
                          case "온수":
                            return (
                              <div
                                key={idx}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <LocalFireDepartment
                                  style={{ fontSize: "30px", color: "#ff5722" }}
                                />
                                <p
                                  style={{
                                    marginTop: "5px",
                                    textAlign: "center",
                                    color: "black",
                                  }}
                                >
                                  온수
                                </p>
                              </div>
                            );
                          case "트렘폴린":
                            return (
                              <div
                                key={idx}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <ChildCare
                                  style={{ fontSize: "30px", color: "#EE66A6" }}
                                />
                                <p
                                  style={{
                                    marginTop: "5px",
                                    textAlign: "center",
                                    color: "black",
                                  }}
                                >
                                  트렘폴린
                                </p>
                              </div>
                            );
                          case "물놀이장":
                            return (
                              <div
                                key={idx}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <Pool
                                  style={{ fontSize: "30px", color: "#009688" }}
                                />
                                <p
                                  style={{
                                    marginTop: "5px",
                                    textAlign: "center",
                                    color: "black",
                                  }}
                                >
                                  물놀이장
                                </p>
                              </div>
                            );
                          case "놀이터":
                            return (
                              <div
                                key={idx}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <ChildCare
                                  style={{ fontSize: "30px", color: "#673ab7" }}
                                />
                                <p
                                  style={{
                                    marginTop: "5px",
                                    textAlign: "center",
                                    color: "black",
                                  }}
                                >
                                  놀이터
                                </p>
                              </div>
                            );
                          case "산책로":
                            return (
                              <div
                                key={idx}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <HikingIcon
                                  style={{ fontSize: "30px", color: "#4caf50" }}
                                />
                                <p
                                  style={{
                                    marginTop: "5px",
                                    textAlign: "center",
                                    color: "black",
                                  }}
                                >
                                  산책로
                                </p>
                              </div>
                            );
                          case "운동장":
                            return (
                              <div
                                key={idx}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <SportsSoccer
                                  style={{ fontSize: "30px", color: "#ff5722" }}
                                />
                                <p
                                  style={{
                                    marginTop: "5px",
                                    textAlign: "center",
                                    color: "black",
                                  }}
                                >
                                  운동장
                                </p>
                              </div>
                            );
                          case "마트":
                            return (
                              <div
                                key={idx}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <Store
                                  style={{ fontSize: "30px", color: "#9e9e9e" }}
                                />
                                <p
                                  style={{
                                    marginTop: "5px",
                                    textAlign: "center",
                                    color: "black",
                                  }}
                                >
                                  마트
                                </p>
                              </div>
                            );
                          case "편의점":
                            return (
                              <div
                                key={idx}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <Store
                                  style={{ fontSize: "30px", color: "#607d8b" }}
                                />
                                <p
                                  style={{
                                    marginTop: "5px",
                                    textAlign: "center",
                                    color: "black",
                                  }}
                                >
                                  편의점
                                </p>
                              </div>
                            );
                          default:
                            return null;
                        }
                      })}
                  </div>
                </div>
                <Button>
                    <SvgIcon>
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </SvgIcon>
                </Button>
              </div>
            </Paper>
          ))
        ) : (
          <p style={{ color: "black" }}>조건에 맞는 캠핑장이 없습니다.</p>
        )}
        <div className="pagination">
          <Stack spacing={2}>
            <Pagination
              count={totalPages} // 전체 페이지 수
              page={currentPage} // 현재 페이지
              onChange={handlePageChange} // 페이지 변경 처리
              color="primary"
              showFirstButton
              showLastButton
              boundaryCount={2}
              siblingCount={4}
              hideNextButton={currentPage === totalPages}
              hidePrevButton={currentPage === 1} // 첫 페이지에서 '이전' 버튼 숨기기
            />
          </Stack>
        </div>
      </div>
    </>
  );
}

export default CampgroundSearchPage;