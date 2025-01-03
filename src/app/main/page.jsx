"use client"; // Mark the component as a client-side component

import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/virtual"; // 필요한 스타일 추가
import AirportShuttleOutlinedIcon from "@mui/icons-material/AirportShuttleOutlined";
import DeckOutlinedIcon from "@mui/icons-material/DeckOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import FestivalOutlinedIcon from "@mui/icons-material/FestivalOutlined";
import {
  EffectFade,
  Navigation,
  Pagination,
  Autoplay,
  Virtual,
} from "swiper/modules";
import "./styles.css";
import { useRouter } from "next/navigation";
import Map from "../map/page";

export default function Main() {
  const [data, setData] = useState([]); // 캠핑장 데이터
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState(""); // 지역 선택 상태
  const [selectedCategory, setSelectedCategory] = useState(""); // 카테고리 선택 상태
  const [filteredData, setFilteredData] = useState([]); // 필터링된 데이터 상태
  const [swiperRef, setSwiperRef] = useState(null);
  const [showNavigation, setShowNavigation] = useState(false); // 네비게이션 버튼 상태
  const appendNumber = useRef(500);
  const prependNumber = useRef(1);
  const router = useRouter();
  const [swiperData, setSwiperData] = useState([]); // Swiper에서 사용할 데이터
  const [activeCategory, setActiveCategory] = useState(null); // 현재 활성화된 카테고리

  // 상세 페이지로 이동
  const handleDetailClick = (contentId) => {
    router.push(`/campingdetail/${contentId}`); // 디테일 페이지로 이동
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
    "강원",
    "충북",
    "충남",
    "전라북도",
    "전라남도",
    "경상북도",
    "경상남도",
    "제주도",
  ];

  const categories = [
    {
      name: "카라반",
      icon: <AirportShuttleOutlinedIcon style={{ fontSize: "100px" }} />,
    },
    {
      name: "일반야영장",
      icon: <DeckOutlinedIcon style={{ fontSize: "100px" }} />,
    },
    {
      name: "자동차야영장",
      icon: <LocalShippingOutlinedIcon style={{ fontSize: "100px" }} />,
    },
    {
      name: "글램핑",
      icon: <FestivalOutlinedIcon style={{ fontSize: "100px" }} />,
    },
  ];

  const fetchCampData = async (region = "") => {
    try {
      const response = await fetch("http://localhost:8080/api/camping/sites");

      if (!response.ok) {
        throw new Error("네트워크 응답이 정상적이지 않습니다.");
      }

      const data = await response.json();
      setData(data); // 서버에서 받은 데이터를 상태에 저장
      setFilteredData(data); // 필터링된 데이터도 초기화

      // 선택된 ID에 해당하는 데이터만 Swiper에 저장
      const selectedIds = [37, 85, 109, 160, 161, 219, 232, 440]; // 원하는 ID 배열
      const selectedData = data.filter((item) =>
        selectedIds.includes(item.contentId)
      );
      setSwiperData(selectedData); // Swiper에 사용할 데이터 상태 저장
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    }
  };

  // useEffect에서 fetchCampData 호출
  useEffect(() => {
    fetchCampData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = data.filter((item) => {
      const matchesRegion = selectedRegion
        ? item.addr1.includes(selectedRegion)
        : true;
      const matchesQuery = searchQuery
        ? item.facltNm.includes(searchQuery)
        : true;
      return matchesRegion && matchesQuery;
    });
    setFilteredData(filtered);
  };

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName); // 활성화된 카테고리 설정

    const filtered = data.filter((item) => item.induty === categoryName); // 카테고리에 따라 필터링
    setFilteredData(filtered); // 필터링된 데이터를 상태에 업데이트
  };

  const prepend = () => {
    setSlides([
      `Slide ${prependNumber.current - 2}`,
      `Slide ${prependNumber.current - 1}`,
      ...slides,
    ]);
    prependNumber.current = prependNumber.current - 2;
    swiperRef.slideTo(swiperRef.activeIndex + 2, 0);
  };

  const append = () => {
    setSlides([...slides, "Slide " + ++appendNumber.current]);
  };

  const slideTo = (index) => {
    swiperRef.slideTo(index - 1, 0);
  };

  return (
    <div className="outer-container">
      {" "}
      {/* 전체 뒷 배경 */}
      <div className="slider-container">
        <Swiper
          spaceBetween={30}
          effect={"fade"}
          navigation={true}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          modules={[EffectFade, Navigation, Pagination, Autoplay]}
          className="swiper1"
        >
          <SwiperSlide>
            <div className="slide-content">
              <img src="./images/cam1.webp" alt="Slide 1" />
              <div className="slide-text">
                Camplace: Where Gatherings Come to Life !
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slide-content">
              <img src="./images/campingg2.jpg" alt="Slide 2" />
              <div className="slide-text">
                Camplace: Your Destination for Outdoor Memories !
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slide-content">
              <img src="./images/campingg3.jpg" alt="Slide 3" />
              <div className="slide-text">
                Experience Togetherness at Camplace !
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search ..."
          className="search-input"
        />
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="region-select"
        >
          <option value="">region</option>
          {regions.map((region, i) => (
            <option key={i} value={region}>
              {region}
            </option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="">category</option>
          {categories.map((category, index) => (
            <option key={index} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        <button type="submit" className="search-button">
          search
        </button>
      </form>
      <div className="new-swiper-container">
        {/* 소개 텍스트 */}
        <div className="text-container">
          <div className="month-text">캠플레이스에 오신 것을 환영합니다!</div>
          <div className="additional-text">
            캠플레이스는 2,000여 개의 캠핑장 정보를 한눈에 확인할 수 있는 최고의
            캠핑 플랫폼입니다. 자연 속에서의 특별한 추억을 캠플레이스와 함께
            만들어보세요!
          </div>
          <div className="additional-text">
            친구, 가족, 동료와 함께 모임을 계획하고, 원하는 캠핑장을 쉽고 빠르게
            예약하세요.
          </div>
        </div>
        <div className="category-container">
          {categories.map((category, index) => (
            <React.Fragment key={index}>
              <button
                className={`category-button ${
                  activeCategory === category.name ? "active" : ""
                }`}
                onClick={() => handleCategoryClick(category.name)} // 클릭 시 필터링 함수 호출
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
              {index < categories.length - 1 && (
                <div className="category-divider"></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* 스와이퍼 */}
        <h1
          style={{
            textAlign: "center",
            fontWeight: "normal",
            marginTop: "40px",
          }}
        >
          어디로 떠날지 고민되시나요? 2000개 이상의 캠핑장에서 선택하세요!
        </h1>
        <div className="swiper-container">
          <Swiper
            modules={[Virtual, Navigation, Pagination]}
            onSwiper={setSwiperRef}
            slidesPerView={3}
            centeredSlides={true}
            spaceBetween={30}
            pagination={{
              type: "fraction",
            }}
            navigation={showNavigation}
            virtual
            className="swiper2"
          >
            {filteredData &&
              filteredData.map((item, index) => (
                <SwiperSlide key={item.facltNm} virtualIndex={index}>
                  <div className="camping-slide" style={{ cursor: "pointer" }}>
                    <img
                      onClick={() => handleDetailClick(item.contentId)}
                      src={item.firstImageUrl}
                      alt={item.facltNm}
                      className="camping-image"
                    />
                    <h3>{item.facltNm}</h3>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </div>
      {/* map */}
      <Map />
      {/* 추천캠핑장 */}
      <div
        style={{
          display: "flex", // 텍스트와 Swiper를 가로 배치
          alignItems: "center", // 세로 가운데 정렬
          justifyContent: "center", // 가로 가운데 정렬
          gap: "20px", // 텍스트와 Swiper 간격
          padding: "50px 20px", // 상하좌우 여백
          backgroundColor: "#f9fafc", // 밝은 배경색
          flexWrap: "wrap", // 화면이 작아질 경우 자동 줄바꿈
        }}
      >
        {/* 텍스트 섹션 */}
        <div
          style={{
            flex: "1", // 유동적으로 크기 조정
            minWidth: "300px", // 최소 너비 설정
            maxWidth: "600px", // 최대 너비 설정
            padding: "20px",
          }}
        >
          <h1 style={{ fontSize: "30px", marginBottom: "16px", color: "#333" }}>
            12월 이런 캠핑 어때?
          </h1>
          <p style={{ fontSize: "20px", lineHeight: "1.6", color: "#555" }}>
            차가운 공기 속에서도 따뜻한 캠핑의 매력을 느낄 수 있는 12월! 하얀
            눈으로 덮인 캠핑장과 장작 타는 소리가 어우러지는 이 특별한 계절에는,
            평소와는 조금 다른 이색적인 겨울 캠핑을 즐겨보세요. 맑고 투명한 겨울
            하늘 아래에서 반짝이는 별빛과 함께하는 하룻밤은 그 어떤 계절보다도
            깊은 힐링을 선물해 줄 거예요.
          </p>
        </div>

        {/* Swiper 섹션 */}
        <div
          style={{
            flex: "2", // Swiper가 텍스트보다 더 넓게 차지
            minWidth: "300px", // 최소 너비 설정
            maxWidth: "1000px", // 최대 너비 설정
            padding: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Swiper 섹션 그림자 효과
            backgroundColor: "#fff", // Swiper 배경색
          }}
        >
          <Swiper
            modules={[Virtual, Navigation, Pagination]}
            onSwiper={setSwiperRef}
            slidesPerView={3}
            centeredSlides={true}
            spaceBetween={20} // 슬라이드 간격 조정
            pagination={{
              type: "fraction",
            }}
            navigation={true}
            virtual={true}
            style={{ height: "400px", width: "100%" }} // Swiper가 가득 차도록 설정
          >
            {swiperData &&
              swiperData.map((item, index) => (
                <SwiperSlide key={item.facltNm} virtualIndex={index}>
                  <div
                    style={{
                      padding: "10px",
                      backgroundColor: "white",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // 슬라이드 그림자 효과
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column", // 이미지와 텍스트 세로 정렬
                      justifyContent: "space-between",
                      height: "100%", // 카드 높이 설정
                    }}
                  >
                    <img
                      onClick={() => handleDetailClick(item.contentId)}
                      src={item.firstImageUrl}
                      alt={item.facltNm}
                      style={{
                        width: "100%",
                        height: "300px", // 이미지 높이 조정
                        objectFit: "cover", // 이미지 비율 유지
                      }}
                    />
                    <h3
                      style={{ fontSize: "18px", color: "#333", margin: "0" }}
                    >
                      {item.facltNm}
                    </h3>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
