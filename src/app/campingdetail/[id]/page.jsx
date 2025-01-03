"use client";

import React, { useState, useEffect, use } from "react";
import { Button, Link, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useRouter } from "next/navigation"; // 라우터 사용

import "./styles.css";
// import { useRouter } from "next/navigation";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddToHomeScreenIcon from "@mui/icons-material/AddToHomeScreen";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
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
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { fetchCampgroundById } from "../../fetchCampgroundById/page";


import dynamic from 'next/dynamic';
const SimpleMDE = dynamic(() => import('react-simplemde-editor'),{
    ssr: false});
import "easymde/dist/easymde.min.css";
import { PiStarFill } from 'react-icons/pi'
import axios from "axios";

import KakaoMap from "@/app/kakaoMap/page";
import Weather from "@/app/weather/page";


export default function CampingDetail({ params }) {
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const { id } = use(params); // URL에서 전달된 id 값
  const [data, setData] = useState(null); // 캠핑장 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const router = useRouter();
  const [isWriteVisible, setIsWriteVisible] = useState(false); // 글쓰기 화면의 표시 여부
  const [formData, setFormData] = useState({
      title : '',
      user_idx : '',
      rating : '',
      content : '',
      file : null
  });
  const [rating, setRating] = useState(1)
  // 추천 여부 및 저장 상태 관리
  const [isSaved, setIsSaved] = useState(false);

// 예약하기 버튼 클릭 처리
const reserveClick = (id) => {
  // 예약 페이지로 이동하거나 예약 API 호출
  console.log("예약하기 버튼 클릭");
  alert("예약 페이지로 이동합니다."); 
  // 예: 예약 페이지로 이동
  
  router.push(`/reservation?id=${id}&name=${encodeURIComponent(data?.facltNm)}&price=${data?.price}`);
};

 // 캠핑장 위치 정보로 지역명 생성
 const region = `${data?.doNm} ${data?.sigunguNm}`;


  // 찜하기 버튼 클릭 처리
  const saveClick = () => {
    setIsSaved((prevState) => !prevState); // 상태 반전
    if (!isSaved) {
      console.log("찜하기 추가");
    } else {
      console.log("찜하기 취소");
    }
  };

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

  
  
  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState("intro");

  //  새로 넣은거
  const handleButtonClick = () => {
    setActiveTab("location");
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  

  // 추천 상태 토글
  const toggleRecommendation = () => {
    setIsSaved((prevState) => !prevState);
  };

  // 주요 시설 정보 매핑
  const getFacilityInfo = () => {
    const facilities = [];
    if (data.induty?.includes("일반야영장")) {
      facilities.push({ name: "일반 야영장", value: data.gnrlSiteCo });
    }
    if (data.induty?.includes("자동차야영장")) {
      facilities.push({ name: "자동차 야영장", value: data.autoSiteCo });
    }
    if (data.induty?.includes("글램핑")) {
      facilities.push({ name: "글램핑", value: data.glampSiteCo });
    }
    if (data.induty?.includes("카라반")) {
      facilities.push({ name: "카라반", value: data.caravSiteCo });
    }
    if (data.induty?.includes("개인 카라반")) {
      facilities.push({ name: "개인 카라반", value: data.indvdlCaravSiteCo });
    }
    return facilities;
  };
  const facilityInfo = getFacilityInfo();

  // 별점 선택 
  ;
  const MAX_RATING = 5;
  const handleRatingClick = (newRating) => {
    setRating(newRating); // 현재 별점을 업데이트
    console.log(`새로운 별점: ${newRating}`);
  };

  // 글쓰기 버튼 클릭 시 화면 토글
  const toggleWriteScreen = () => {
    setIsWriteVisible(!isWriteVisible);
  };
  
  const handleChange = (e) => {
      const {name, value} = e.target;
      setFormData((prev) => ({
          ...prev, [name]:value
      }));
  }
  // 파일 전송 
  const handleFileChange = (e) => {
      setFormData((prev) => ({
          ...prev, file: e.target.files[0]
      }));
  }
  // 리뷰 글쓰기 전송
  const handleSubmit = async() => {
      const API_URL = `${LOCAL_API_BASE_URL}/review/write`;
      const formdata = new FormData();
      formdata.append("title", formData.title)
      formdata.append("user_idx", formData.user_idx)
      formdata.append("rating", rating)
      formdata.append("contentId", id)
      formdata.append("content", formData.content)
      if(formData.file){
        formdata.append("file", formData.file)
      }

      try{
          const response = await axios.post(API_URL, formdata, {
              headers:{
                  //  `Bearer ${token}`,
                  "Content-Type" : "multipart/form-data"
              }
          });
          if (response.formdata.success) {
              alert(response.formdata.message);
              setActiveTab("reviews")
          }else{
              alert(response.data.message);
          }
      } catch (error){
          alert("오류발생")
          console.log(error);
      }
  }   
  // 리뷰 목록
  // useEffect(() => {
  //   // 데이터를 가져오는 함수
  //   const fetchList = async () => {
  //     try {
  //         setLoading(true); // 로딩 상태 시작
  //         const response = await fetch("http://localhost:8080/api/review/list"); // axios를 사용한 API 호출
  //         if (!response.ok) {
  //           throw new Error("Failed to fetch campground");
  //         }
  //         const List = response.json();
  //         setList(data);
  //         // setList([]); // 없을때 연습
  //     } catch (err) {
  //         console.error("Error fetching data:", err);
  //         setError(err.message);
  //     } finally {
  //         setLoading(false); // 로딩 상태 종료
  //     }
  // };

  //   fetchList(); // 데이터 가져오기
  // }, [id]); // id가 변경되면 데이터 다시 가져오기

   // const isFormValid = 
  //       formData.gb_name.trim() !== "" &&
  //       formData.gb_subject.trim() !== "" &&
  //       formData.gb_content.trim() !== "" &&
  //       formData.gb_pw.trim() !== "" &&
  //       formData.gb_email.trim() !== "";
  return (
    <div>
  
      {data ? (
        <>
          <div
            id="camping-inner"
            style={{
              width: "100%",
              backgroundColor: "#f9f9f5",
              color: "black",
            }}
          >
           <div
              style={{
                display: "flex",
                justifyContent: "center", // 수평 가운데 정렬
                alignItems: "center", // 수직 가운데 정렬
                backgroundImage: "url(/images/cam1.webp)", // 배경 이미지
                backgroundSize: "cover", // 이미지 크기 조정
                backgroundPosition: "center",
                height: "250px", // 부모 컨테이너 높이
                flexDirection: "column", // 자식 요소를 세로로 정렬
              }}
            >
              <div
                style={{
                  display: "flex", // 내부 콘텐츠를 정렬할 수 있게 설정
                  flexDirection: "column", // 내부 요소를 세로로 정렬
                  justifyContent: "center", // 내부 요소 수직 가운데 정렬
                  alignItems: "center", // 내부 요소 수평 가운데 정렬
                  backgroundColor: "rgba(255, 255, 255, 0.2)", // 반투명 배경색
                  height: "150px", // 내부 컨테이너 높이
                  width: "800px", // 내부 컨테이너 너비
                  marginTop: "70px", // 위쪽 여백
                }}
              >
                <p
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textShadow: "0 2px 8px rgba(0, 0, 0, 0.5)", // 텍스트 그림자
                    fontSize: "2rem", // 제목 크기
                    textAlign: "center", // 텍스트 가운데 정렬
                    margin: 0, // 기본 여백 제거
                  }}
                >
                  {data.facltNm}
                </p>
                <p
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textShadow: "0 2px 8px rgba(0, 0, 0, 0.5)", // 텍스트 그림자
                    fontSize: "20px", // 설명 크기
                    textAlign: "center", // 텍스트 가운데 정렬
                    margin: 0, // 기본 여백 제거
                  }}
                >
                  {data.lineIntro}
                </p>
              </div>
            </div>
            <div className="camping_layout">
              <div className="camping_info_box">
                <div className="img_b">
                  <img src={data.firstImageUrl} alt="" />
                </div>
                <div
                  className="content_tb"
                  style={{ backgroundColor: "white", padding: "5px" }}
                >
                  <table className="table">
                    <colgroup>
                      <col style={{ width: "30%" }} />
                      <col style={{ width: "70%" }} />
                    </colgroup>
                    <tbody>
                      <tr>
                        <th scope="col">주소</th>
                        <td>{data.addr1}</td>
                      </tr>
                      <tr>
                        <th scope="col">문의처</th>
                        <td>{data.tel}</td>
                      </tr>
                      <tr>
                        <th scope="col">캠핑장 유형</th>
                        <td>{data.induty}</td>
                      </tr>
                      <tr>
                        <th scope="col">가격</th>
                        <td>{data.price}원</td>
                      </tr>
                      <tr>
                        <th scope="col">캠핑장 시설정보</th>
                        <td>{data.sbrsCl}</td>
                      </tr>
                      <tr>
                        <th scope="col">홈페이지</th>
                        <td>
                          <a
                            href={data.homepage}
                            target="_BLANK"
                            title="새창열림"
                          >
                            홈페이지 바로가기
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <th scope="col">주변이용가능시설</th>
                        <td>{data.posblFcltyCl}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="btn">
                    <Button
                      type="button"
                      className="reserve"
                      onClick={() => reserveClick(data.contentId)}
                    >
                      <AddToHomeScreenIcon />
                      예약하기
                    </Button>
                    <Button type="button" className="save" onClick={saveClick}>
                      {isSaved ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      찜하기
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="camping-info">
            <div className="tabs">
              <Button
                className={`tab-button ${
                  activeTab === "intro" ? "active" : ""
                }`}
                onClick={() => setActiveTab("intro")}
                sx={{ color: "black" }}
              >
                캠핑장 소개
              </Button>
              <Button
                className={`tab-button ${
                  activeTab === "usage" ? "active" : ""
                }`}
                onClick={() => setActiveTab("usage")}
                sx={{ color: "black" }}
              >
                이용안내
              </Button>
              <Button
        className={`tab-button ${activeTab === "location" ? "active" : ""}`}
        onClick={handleButtonClick}
        sx={{ color: "black" }}
      >
        날씨/위치정보
      </Button>

      {activeTab === "location" && (
  <>
    {console.log(data.mapY, data.mapX)} {/* 위도와 경도 값 확인 */}
   
  </>
)}
    
              <Button
                className={`tab-button ${
                  activeTab === "reviews" ? "active" : ""
                }`}
                onClick={() => setActiveTab("reviews")}
                sx={{ color: "black" }}
              >
                캠핑&여행후기
              </Button>
            </div>
          </div>

          <div className="tab-content">
            {activeTab === "intro" && (
              <div id="intro">
                <div>
                  <p>{data.intro}</p>
                </div>
                {/* 시설 아이콘 */}
                <div>
                  <h2 className="camping-info-list">
                    <ChevronRightIcon className="rightIcon" /> 캠핑장 시설 정보
                  </h2>
                  <div
                    className="camping-item-facilities"
                    style={{
                      display: "flex",
                      gap: "50px",
                      paddingTop: "20px",
                      paddingLeft: "20px",
                      border: "1px solid #fff",
                      backgroundColor: "#f1f1f1",
                    }}
                  >
                    {data.sbrsCl &&
                      data.sbrsCl.split(",").map((facility, idx) => {
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
                <div>
                  <h2 className="camping-info-list">
                    <ChevronRightIcon className="rightIcon" /> 기타 주요 시설
                  </h2>
                  <div className="etc-table">
                    <table className="table">
                      <colgroup>
                        <col style={{ width: "30%" }} />
                        <col style={{ width: "70%" }} />
                      </colgroup>
                      <tbody>
                        <tr>
                          <th scope="col">주요시설</th>
                          <td>
                            {facilityInfo.map((facility, index) => (
                              <span key={index}>
                                {facility.name}({facility.value}면)
                                {index < facilityInfo.length - 1 && " ● "}
                              </span>
                            ))}
                          </td>
                        </tr>      
                        <tr>
                          <th scope="col">기타 부대시설</th>
                          <td>{data.sbrsEtc != "" ? data.sbrsEtc : '정보 없음'}</td>
                        </tr>
                        {data.induty &&
                      data.induty.split(",").map((facility, idx) => {
                        switch (facility.trim()) {
                          case "카라반":
                            return (
                              <tr key={idx}>
                               <th scope="col">카라반 내부시설</th>
                               <td>{data.caravInnerFclty}</td>
                              </tr>
                            );
                          case "글램핑":
                            return (
                              <tr key={idx}>
                               <th scope="col">{data.induty} 내부시설</th>
                               <td>{data.glampInnerFclty}</td>
                              </tr>
                            )
                          default:
                            return null;
                        }
                      })}
                        <tr>
                          <th scope="col">입지 구분</th>
                          <td>{data.lctCl}</td>
                        </tr>
                        <tr>
                          <th scope="col">반려동물 출입</th>
                          <td>{data.animalCmgCl}</td>
                        </tr>
                        <tr>
                          <th scope="col">화로대</th>
                          <td>{data.brazierCl}</td>
                        </tr>
                        <tr>
                          <th scope="col">안전시설현황</th>
                          <td>
                            <a
                              href={data.homepage}
                              target="_BLANK"
                              title="새창열림"
                            >
                              홈페이지 바로가기
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div></div>
              </div>
            )}

            {activeTab === "usage" && (
              <div id="usage">
                <h2>이용안내</h2>
                <ul>
                  <li>예약은 온라인으로만 가능합니다.</li>
                  <li>체크인은 오후 3시, 체크아웃은 오전 11시입니다.</li>
                  <li>애완동물은 동반이 불가합니다.</li>
                </ul>
              </div>
            )}

            {activeTab === "location" && (
              <div id="location">
                 <h1>지도</h1>
                 <KakaoMap
                latitude={data.mapY} // DB에서 불러온 위도
                 longitude={data.mapX} // DB에서 불러온 경도
                />
                <p>{data.addr1}</p>
                <p>{data.direction}</p>
                <h1>날씨</h1>
                <Weather region={region} />
              </div>
            )}

            {activeTab === "reviews" && (
              <div id="reviews">
                <h2>캠핑이용후기</h2>
                {/* <TableContainer component={Paper} className="table-container">
                <Table className="custom-table">
                    <TableHead>
                        <TableRow>
                            <TableCell className="table-header">이름</TableCell>
                            <TableCell className="table-header">제목</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.length === 0 ?
                            <TableRow>
                                <TableCell colSpan={2} style={{ textAlign: "center" }}>
                                    <h3>등록된 정보가 존재하지 않습니다.</h3>
                                </TableCell>
                            </TableRow>
                            : list.map((item) => (
                                <TableRow key={item.review_idx}>
                                    <TableCell className="table-cell">{item.user_id}</TableCell>
                                    <TableCell className="table-cell">
                                        <Link href={`/reviewDetails/${item.review_idx}`}>{item.review_title}</Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer> */}
            <Button 
                  onClick={toggleWriteScreen}
                  variant="contained" 
                  color="primary"
                  className="write-button"
                >
                글쓰기
              </Button>
              {isWriteVisible && (
                <div className="review-write">
                  <h2 className="review-title">
                    <div><ChevronRightIcon className="rightIcon" /> 캠핑/여행후기</div>
                    {/* 별점 표시 */}
                    <div className="stars">
                      {[...Array(MAX_RATING)].map((_, i) => (
                        <PiStarFill
                          key={i}
                          className={i < rating ? "yellow-star" : "svg"}
                          onClick={() => 
                            handleRatingClick(i+1)
                          }
                        />
                      ))}
                      {rating}/{MAX_RATING}
                    </div>
                  </h2>
                  <TextField
                    label="제목"
                    name="title"
                    value={formData.title}
                    onChange={handleChange} // 값 처리 예시
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="이름"
                    name="user_idx"
                    onChange={handleChange} // 값 처리 예시
                    fullWidth
                    margin="normal"
                  />
                  <input type='file' onChange={handleFileChange} style={{marginBottom : "10px"}}/>
                  <SimpleMDE 
                    value={formData.content}
                    onChange={(value)=>setFormData((prev)=>({...prev, content:value}))}
                  />
                  <Button variant="contained" color="primary" style={{ marginTop: "20px" }} onClick={handleSubmit}>
                    저장
                  </Button>
                </div>
              )}
              </div>
            )}
          </div>
        </>
      ) : (
        <p>로딩 중...</p>
      )}
      
    </div>
  );
}
