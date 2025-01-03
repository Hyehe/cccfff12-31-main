"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";

const Map = () => {
  const [campData, setCampData] = useState([]); // 전체 캠핑장 데이터
  const [filteredCamps, setFilteredCamps] = useState([]); // 필터링된 캠핑장 데이터
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const itemsPerPage = 6; // 한 페이지에 6개 (3개씩 2열)
  const [map, setMap] = useState(null); // 지도 상태
  const [currentMarker, setCurrentMarker] = useState(null); // 현재 표시된 마커 상태
  const router = useRouter();

  // 검색기능
  const [searchTerm, setSearchTerm] = useState(""); // 캠핑장 이름 검색
  const [region, setRegion] = useState(""); // 지역 필터
  const [city, setCity] = useState(""); // 시/군 필터
  const [isPetFriendly, setIsPetFriendly] = useState(false); // 반려동물 동반 가능 여부
  const [theme, setTheme] = useState(""); // 테마 필터
  const [type, setCampingType] = useState(""); // 캠핑장 종류 필터

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
        ? campground.animalCmgCl === "가능"
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

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=82653f2edcf163a11fb5d8dc0dab9587&autoload=false`;
    script.async = true;

    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          const mapContainer = document.getElementById("map");
          const mapOptions = {
            center: new window.kakao.maps.LatLng(37.3241008, 126.978), // 서울의 좌표

            level: 6, // 줌 레벨
          };

          const mapInstance = new window.kakao.maps.Map(
            mapContainer,
            mapOptions
          );
          setMap(mapInstance); // 지도 객체 상태에 저장

          // 캠핑장 데이터 가져오기
          fetchCampData();
        });
      } else {
        console.error("카카오맵 API 로드 실패");
      }
    };

    script.onerror = () => {
      console.error("카카오맵 스크립트 로드 중 오류 발생");
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // 캠핑장 데이터를 가져오는 함수
  const fetchCampData = async (region = "") => {
    try {
      const response = await fetch("http://localhost:8080/api/camping/sites");

      if (!response.ok) {
        throw new Error("네트워크 응답이 정상적이지 않습니다.");
      }

      const data = await response.json();

      // 지역에 맞는 캠핑장 데이터 필터링
      const filteredData = region
        ? data.filter((camp) => camp.addr1.includes(region))
        : data;

      setCampData(data);
      setFilteredCamps(filteredData);
      setCurrentPage(1);
    } catch (error) {
      console.error(
        "캠핑장 데이터를 가져오는 중 오류 발생:",
        error.message || error
      );
    }
  };

  // 현재 페이지에 해당하는 캠핑장 데이터 반환
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCamps.slice(startIndex, startIndex + itemsPerPage);
  };

  // 상세 페이지로 이동
  const handleDetailClick = (contentId) => {
    router.push(`/campingdetail/${contentId}`); // 디테일 페이지로 이동
  };

  const handlelistClick = () => {
    router.push("/campinglist"); // "/test" 지역 페이지 페이지로 이동하여 모든 캠핑장 데이터를 지도에 표시
  };

  // 캠핑장 클릭 시 마커를 지도에 추가하는 함수
  const handleCampClick = (camp) => {
    // 기존에 지도에 표시된 마커가 있다면 제거
    if (currentMarker) {
      currentMarker.setMap(null);
    }

    // 새로운 마커 생성
    const position = new window.kakao.maps.LatLng(camp.mapY, camp.mapX); // 캠핑장의 좌표
    const marker = new window.kakao.maps.Marker({
      position,
      map: map,
    });

    // 마커 클릭 이벤트 (예시로 상세 페이지로 이동)
    window.kakao.maps.event.addListener(marker, "click", () => {
      fetchCampData(camp.addr1); // 마커 클릭 시 해당 지역 캠핑장 데이터 가져오기
      handleDetailClick(camp.contentId); // 디테일 페이지로 이동
    });
    map.setCenter(position);
    map.setLevel(3); // 원하는 확대/축소 레벨로 설정 (

    // 새로운 마커를 currentMarker 상태에 저장
    setCurrentMarker(marker);
  };

  // 페이지네이션을 위한 페이지 수 계산
  const totalPages = Math.ceil(filteredCamps.length / itemsPerPage);

  // 페이지 번호 생성
  const generatePageNumbers = () => {
    const pageNumbers = [];
    if (totalPages > 5) {
      let start = Math.max(currentPage - 2, 1);
      let end = Math.min(currentPage + 2, totalPages);
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      if (end < totalPages) {
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
      if (start > 1) {
        pageNumbers.unshift(1);
        if (start > 2) {
          pageNumbers.unshift("...");
        }
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    }
    return pageNumbers;
  };

  return (
    <div style={{ backgroundColor: "#f9f9f5" }}>
      {/* 첫 번째 섹션: 배경 이미지와 중앙 정렬 */}
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
      <div style={{ backgroundColor: "#f9f9f5" }}>
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
            marginRight: "150px",
            marginLeft: "150px",
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
            onClick={handlelistClick}
          >
            목록으로 보기
          </button>
        </div>
      </div>

      {/* 두 번째 섹션: 지도와 캠핑장 목록 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center", // 가운데 정렬
          alignItems: "center",
          width: "100%", // 전체 화면 사용
          minHeight: "600px", // 섹션의 최소 높이
          boxSizing: "border-box", // 여백과 패딩 포함
          paddingLeft: "150px",
          paddingRight: "150px",
          backgroundColor: "#f9f9f5",
        }}
      >
        {/* 지도 영역 */}
        <div
          id="map"
          style={{
            flex: "2", // 지도 크기 비율
            height: "500px", // 고정 높이
            border: "1px solid #ddd", // 지도 영역 경계선
            borderRadius: "5px", // 모서리 둥글게
            marginRight: "20px", // 목록과 간격 추가
          }}
        ></div>

        {/* 캠핑장 목록 */}
        <div
          style={{
            flex: "1", // 목록 크기 비율
            maxWidth: "400px", // 목록의 최대 너비
            overflowY: "auto", // 스크롤 가능하도록 설정
            height: "500px", // 지도의 높이에 맞춤
            border: "1px solid #ddd", // 경계선 추가
            borderRadius: "5px", // 모서리 둥글게
            padding: "10px", // 내부 여백
            backgroundColor: "#fff", // 흰색 배경
          }}
        >
          {/* 캠핑장 수 */}
          <div style={{ textAlign: "left", marginBottom: "10px" }}>
            <h3>캠핑장 수: {filteredCamps.length}</h3>
          </div>

          {/* 캠핑장 목록 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              textAlign: "left",
            }}
          >
            {getCurrentPageData().length > 0 ? (
              getCurrentPageData().map((camp) => (
                <div
                  key={camp.contentId}
                  style={{
                    paddingBottom: "10px", // 경계선 위쪽 여백
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start", // 목록 내 왼쪽 정렬
                    borderBottom: "1px solid #ddd", // 경계선 추가
                    margin: "5px",
                  }}
                >
                  <strong
                    onClick={() => handleCampClick(camp)}
                    style={{
                      fontSize: "17px", // 제목 크기
                      color: "#5A9F33", // 강조 색상
                      cursor: "pointer",
                    }}
                  >
                    {camp.facltNm}
                  </strong>
                  <div
                    onClick={() => handleCampClick(camp)}
                    style={{
                      fontSize: "15px",
                      color: "#555",
                      cursor: "pointer",
                    }}
                  >
                    {camp.addr1}
                  </div>
                  <div style={{ fontSize: "14px", color: "#888" }}>
                    {camp.tel}
                  </div>
                </div>
              ))
            ) : (
              <div>캠핑장 정보를 불러오는 중입니다...</div>
            )}
          </div>
        </div>
      </div>

      {/* 페이지 네이션 */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "100px",
          backgroundColor: "#f9f9f5",
        }}
      >
        {generatePageNumbers().map((pageNum, index) => (
          <button
            key={index}
            onClick={() => pageNum !== "..." && setCurrentPage(pageNum)}
            style={{
              margin: "5px",
              padding: "5px 10px",
              backgroundColor: pageNum === currentPage ? "#5A9F33" : "#efefef",
              color: pageNum === currentPage ? "white" : "black",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {pageNum}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Map;
