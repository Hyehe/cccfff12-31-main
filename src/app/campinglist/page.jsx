"use client";

import React, { useEffect, useState } from "react";
import "./styles2.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CallIcon from "@mui/icons-material/Call";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { Image as ImageIcon } from "@mui/icons-material";
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
import { fetchCampgrounds } from "../fetchCampData/page";
import { Avatar, Pagination, Stack } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import StoreIcon from "@mui/icons-material/Store";

function CampgroundSearchPage() {
  // 데이터 불러오기
  const [data, setData] = useState(null); // 캠핑장 데이터를 저장
  const [filteredData, setFilteredData] = useState([]); // 필터링된 데이터
  // 검색기능
  const [searchTerm, setSearchTerm] = useState(""); // 캠핑장 이름 검색
  const [region, setRegion] = useState(""); // 지역 필터
  const [city, setCity] = useState(""); // 시/군 필터
  const [isPetFriendly, setIsPetFriendly] = useState(false); // 반려동물 동반 가능 여부
  const [theme, setTheme] = useState(""); // 테마 필터
  const [type, setCampingType] = useState(""); // 캠핑장 종류 필터
  // detail로 가기 위함
  const router = useRouter();
  // 페이지
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const itemsPerPage = 10; // 페이지당 아이템 수

  // 필터링 로직
  const handleSearch = (e) => {
    e.preventDefault();

    const filteredResults = data.filter((campground) => {
      // 캠핑장 이름 검색
      const matchesSearchTerm = searchTerm
        ? campground.facltNm?.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      // 지역 필터링
      const matchesRegion = region ? campground.doNm?.includes(region) : true;

      // 시/군 필터링
      const matchesCity = city ? campground.sigunguNm?.includes(city) : true;

      // 반려동물 동반 가능 여부
      const matchesPetFriendly = isPetFriendly
        ? campground.animalCmgCl === "가능" ||
          campground.animalCmgCl === "가능(소형견)"
        : true;

      // 테마 필터링
      const matchesTheme = theme ? campground.lctCl?.includes(theme) : true;

      // 캠핑장 종류 필터링
      const matchesCampingType = type
        ? campground.induty?.includes(type)
        : true;

      // 모든 조건을 만족하는 캠핑장만 반환
      return (
        matchesSearchTerm &&
        matchesRegion &&
        matchesCity &&
        matchesPetFriendly &&
        matchesTheme &&
        matchesCampingType
      );
    });

    setFilteredData(filteredResults);
  };

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
    router.push(`/campingdetail/${contentId}`); // 디테일 페이지로 이동
  };

  // 전체 캠핑장 데이터를 지도에 표시하는 페이지로 이동하는 함수
  const handleMapClick = () => {
    router.push("/campinglistmap"); // "/test" 지역 페이지 페이지로 이동하여 모든 캠핑장 데이터를 지도에 표시
  };

  // 검색
  // 엔터 키로 검색 처리
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  // 검색 초기화 기능
  const handleReset = () => {
    setSearchTerm(""); // 검색어 초기화
    setRegion(""); // 지역 필터 초기화
    setIsPetFriendly(false); // 반려동물 동반 필터 초기화
    setTheme(""); // 테마 필터 초기화
    setCampingType("");
    setFilteredData(data); // 필터링된 데이터 초기화 (모든 데이터 표시)
    setCurrentPage(1);
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

  return (
    <>
      {/* Search Bar Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column", // 세로로 정렬
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "url(/images/cam1.webp)", // 배경 이미지
          backgroundSize: "cover", // 이미지 크기 조정
          backgroundPosition: "center", // 이미지 위치 중앙
          padding: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            margin: "40px",
            padding: "30px",
            position: "relative",
          }}
        >
          <RefreshIcon
            onClick={handleReset}
            style={{
              position: "absolute",
              top: "30px",
              right: "30px",
              color: "white",
              fontSize: "30px",
              cursor: "pointer",
            }}
          />

          <h2 style={{ color: "white", marginBottom: "20px" }}>캠핑장 검색</h2>

          <div
            style={{
              display: "flex",
              alignItems: "center", // 세로 정렬
              justifyContent: "center",
              marginBottom: "20px",
              width: "100%", // 전체 너비 사용
            }}
          >
            {/* 캠핑장 이름 입력창 */}
            <input
              type="text"
              placeholder="캠핑장 이름을 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{
                padding: "10px",
                fontSize: "16px",
                width: "300px", // 원하는 너비 설정
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />

            {/* 검색 버튼 */}
            <button
              onClick={handleSearch}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                cursor: "pointer",
                borderRadius: "5px",
                backgroundColor: "#597445",
                color: "white",
                border: "none",
                marginLeft: "10px", // 입력창과 버튼 사이의 간격
              }}
            >
              검색
            </button>
          </div>
          <div>
            {/* 캠핑장 종류 선택 */}
            <select
              onChange={(e) => setCampingType(e.target.value)}
              value={type}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "400px",
                marginBottom: "20px",
                color: "grey",
              }}
            >
              <option value="">캠핑장 종류 선택</option>
              <option value="일반야영장">일반야영장</option>
              <option value="글램핑">글램핑</option>
              <option value="카라반">카라반</option>
              <option value="자동차야영장">자동차야영장</option>
            </select>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center", // 세로 정렬
              justifyContent: "center",
              marginBottom: "20px",
              width: "100%", // 전체 너비 사용
            }}
          >
            {/* 지역 선택 필터 */}
            <select
              onChange={(e) => setRegion(e.target.value)}
              value={region}
              style={{
                padding: "10px",
                fontSize: "14px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                marginRight: "30px",
                width: "170px",
                color: "grey",
              }}
            >
              <option value="">전체 도</option>
              {regions.map((regionName) => (
                <option key={regionName} value={regionName}>
                  {regionName}
                </option>
              ))}
            </select>

            {/* 시/군 선택 필터 */}
            <label htmlFor="city">
              <input
                type="text"
                placeholder="시/군"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{
                  padding: "10px",
                  fontSize: "14px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  width: "180px",
                }}
              />
            </label>
          </div>

          <div>
            {/* 테마 필터 */}
            <select
              onChange={(e) => setTheme(e.target.value)}
              value={theme}
              style={{
                padding: "10px",
                fontSize: "14px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                marginRight: "50px",
                width: "170px",
                color: "grey",
              }}
            >
              <option value="">테마 선택</option>
              <option value="자연">자연</option>
              <option value="호수">호수</option>
              <option value="산">산</option>
              <option value="바다">바다</option>
              <option value="숲">숲</option>
            </select>

            <label style={{ color: "white", marginLeft: "20px" }}>
              <input
                type="checkbox"
                checked={isPetFriendly}
                onChange={(e) => setIsPetFriendly(e.target.checked)}
                style={{ marginRight: "5px" }}
              />
              반려동물 동반 가능
            </label>
          </div>
        </div>
      </div>
      {/* 필터링된 캠핑장 목록 출력 */}
      <div className="camping-list" style={{ backgroundColor: "#f9f9f5" }}>
        <div
          style={{
            backgroundColor: "white",
            marginTop: "30px",
            height: "50px",
            textAlign: "center",
            borderRadius: "8px",
            color: "black",
            border: "1px solid #ddd",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            position: "relative",
          }}
        >
          {/* 나중에 db 나오면 기능구현 */}
          <select
            style={{
              backgroundColor: "transparent",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid white",
              width: "120px",
              marginBottom: "20px",
              position: "absolute",
              left: "30px",
              top: "3px",
            }}
          >
            <option value="">등록일순</option>
            <option value="">리뷰순</option>
            <option value="">찜 많은 순</option>
          </select>
          <button
            style={{
              backgroundColor: "#efefef",
              padding: "10px",
              position: "absolute",
              right: "30px",
              top: "4px",
              borderRadius: "5px",
              border: "1px solid white",
              cursor: "pointer",
            }}
            onClick={handleMapClick}
          >
            지도로 보기
          </button>
        </div>
        {currentData && currentData.length > 0 ? (
          currentData.map((item, index) => (
            <div key={index} className="camping-item">
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
                  <Avatar
                    sx={{ width: 400, height: 200, backgroundColor: "#f8f8f8" }}
                  >
                    <ImageIcon sx={{ fontSize: "80px", color: "lightgrey" }} />
                  </Avatar>
                )}
                <div className="camping-item-text">
                  <span
                    style={{
                      color: "black",
                      fontSize: "12px",
                      backgroundColor: "pink",
                      padding: "3px",
                    }}
                  >
                    찜 (예시)개
                  </span>
                  {item.animalCmgCl === "가능" ? (
                    <span
                      style={{
                        color: "black",
                        fontSize: "12px",
                        backgroundColor: "lightblue",
                        marginLeft: "10px",
                        padding: "3px",
                      }}
                    >
                      반려동물 동반 가능
                    </span>
                  ) : item.animalCmgCl === "가능(소형견)" ? (
                    <span
                      style={{
                        color: "black",
                        fontSize: "12px",
                        backgroundColor: "lightblue",
                        marginLeft: "10px",
                        padding: "3px",
                      }}
                    >
                      반려동물 동반 가능 (소형견)
                    </span>
                  ) : null}
                  <span
                    style={{
                      color: "black",
                      fontSize: "12px",
                      backgroundColor: "#FFF5D7",
                      marginLeft: "10px",
                      padding: "3px",
                    }}
                  >
                    리뷰 (예시)개
                  </span>
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
                                <StorefrontIcon
                                  style={{ fontSize: "30px", color: "grey" }}
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
                                <StoreIcon
                                  style={{ fontSize: "30px", color: "grey" }}
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

                          default:
                            return null;
                        }
                      })}
                  </div>
                </div>
              </div>
            </div>
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
