"use client";
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Pagination,
  Avatar,
  collapseClasses,
} from "@mui/material";
import "./styles.css";
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";
import { Image as ImageIcon } from "@mui/icons-material";
import CampgroundIcon from "@mui/icons-material/NaturePeople";
import EventIcon from "@mui/icons-material/Event";
import MailIcon from "@mui/icons-material/Mail";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import Link from "next/link";
import { useMediaQuery } from "@mui/material"; // useMediaQuery import 추가
import CameraAltIcon from "@mui/icons-material/CameraAlt"; // 기본 카메라 아이콘
import HomeIcon from "@mui/icons-material/Home"; // 홈페이지 아이콘
import ExpandLessIcon from "@mui/icons-material/ExpandLess"; // < 아이콘
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // > 아이콘
import LogoutIcon from "@mui/icons-material/ExitToApp";
import { useRouter } from "next/navigation";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { fetchCampgrounds } from "@/app/fetchCampData/page";

const menuItems = [
  {
    label: "회원 관리",
    icon: <PeopleIcon />,
    path: "/members",
    subItems: [
      { label: "권한 관리", path: "/admin" },
      { label: "회원 정보 보기", path: "/admin/members/view" },
      { label: "회원 제재", path: "/admin/members/restrictions" },
    ],
  },
  {
    label: "캠핑장 관리",
    icon: <CampgroundIcon />,
    path: "/admin/campgrounds",
    subItems: [
      { label: "캠핑장 정보 보기", path: "/admin/campgrounds/view" },
      { label: "예약 내역", path: "/admin/campgrounds/reservations" },
    ],
  },
  {
    label: "모임 관리",
    icon: <EventIcon />,
    path: "/admin/events",
    subItems: [
      { label: "정규 모임", path: "/admin/events/regular/view" },
      { label: "번개 모임", path: "/admin/events/lightning/view" },
    ],
  },
  {
    label: "1:1 문의",
    icon: <MailIcon />,
    path: "/admin/inquiries",
    subItems: null,
  },
  {
    label: "공지사항",
    icon: <AnnouncementIcon />,
    path: "/admin/notices",
    subItems: null,
  },
];

export default function Page() {
  const [activeSubMenu, setActiveSubMenu] = React.useState(null);
  const [activeProfile, setActiveProfile] = React.useState(true);
  // 데이터
  const [data, setData] = useState(null); // 캠핑장 데이터를 저장
  const [filteredData, setFilteredData] = useState([]); // 필터링된 데이터
  // 페이지
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const itemsPerPage = 5; // 페이지당 아이템 수
  // 검색기능
  const [searchTerm, setSearchTerm] = useState(""); // 캠핑장 이름 검색
  const [region, setRegion] = useState(""); // 지역 필터
  const [city, setCity] = useState(""); // 시/군 필터
  const [isPetFriendly, setIsPetFriendly] = useState(false); // 반려동물 동반 가능 여부
  const [theme, setTheme] = useState(""); // 테마 필터
  const [type, setCampingType] = useState(""); // 캠핑장 종류 필터
  // detail로 가기 위함
  const router = useRouter();
  // 상세 페이지로 이동
  const handleDetailClick = (contentId) => {
    router.push(`/admin/campgrounds/adminCampingdetail/${contentId}`); // 디테일 페이지로 이동
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

  // 페이징
  // 페이지 변경 시 호출되는 함수
  const handlePageChange = (event, value) => {
    setCurrentPage(value); // 페이지 상태 업데이트
  };

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

  // 현재 페이지에 해당하는 데이터 계산
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
  // 전체 페이지 수 계산
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // 관리자 이름(아이디)
  const [adminName] = React.useState("홍길동");

  // 화면 크기 체크 (1000px 이하에서 텍스트 숨기기)
  const isSmallScreen = useMediaQuery("(max-width:1000px)");

  // 로그아웃
  const handleLogout = () => {
    console.log("로그아웃");
  };

  // 메뉴 토글
  const handleSubMenuToggle = (index) => {
    setActiveSubMenu(activeSubMenu === index ? null : index);
  };

  // 프로필 토글
  const handleProfileToggle = () => {
    setActiveProfile(!activeProfile);
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        {/* Sidebar - 메뉴 목록 */}
        <Box
          sx={{
            width: isSmallScreen ? "60px" : "200px",
            bgcolor: "#E7F0DC",
            paddingTop: "20px",
            paddingBottom: "20px",
            transition: "width 0.3s",
          }}
        >
          {/* 관리자 프로필 */}
          <List>
            {/* 토글 버튼 */}
            <ListItem button onClick={handleProfileToggle}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                {activeProfile ? (
                  <ExpandLessIcon sx={{ color: "#808D7C" }} />
                ) : (
                  <ExpandMoreIcon sx={{ color: "#808D7C" }} />
                )}
              </Box>
            </ListItem>

            {/* 프로필 내용 토글 */}
            <Collapse in={activeProfile} timeout="auto" unmountOnExit>
              <List sx={{ pl: 4, backgroundColor: "#f1f8e9" }}>
                {/* 카메라 아이콘 및 관리자 이름 (화면 크기가 클 때만 표시) */}
                {!isSmallScreen && (
                  <ListItem>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        sx={{
                          width: "100px",
                          height: "100px",
                          borderRadius: "50%",
                          bgcolor: "#808D7C",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <CameraAltIcon sx={{ color: "white" }} />
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "black", mt: 1 }}
                      >
                        관리자 {adminName}님
                      </Typography>
                    </Box>
                  </ListItem>
                )}
                {/* 아이콘 두 개 가로 배치 (화면 크기가 클 때만 표시) */}
                {!isSmallScreen && (
                  <ListItem
                    sx={{ display: "flex", justifyContent: "space-evenly" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        cursor: "pointer",
                      }}
                      component={Link}
                      href="/"
                    >
                      <HomeIcon sx={{ color: "#808D7C" }} />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        cursor: "pointer",
                        marginRight: "30px",
                      }}
                      onClick={handleLogout}
                    >
                      <LogoutIcon sx={{ color: "#808D7C" }} />
                    </Box>
                  </ListItem>
                )}
              </List>
            </Collapse>
          </List>

          <List>
            {menuItems.map((item, index) => (
              <div key={index}>
                <ListItem
                  button
                  onClick={() =>
                    item.subItems ? handleSubMenuToggle(index) : null
                  }
                  component={item.subItems ? "div" : Link}
                  href={item.subItems ? "#" : item.path}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  {/* 화면이 작을 때 텍스트 숨기기 */}
                  {!isSmallScreen && (
                    <ListItemText
                      primary={item.label}
                      sx={{ color: "black" }}
                    />
                  )}
                </ListItem>

                {/* 하위 메뉴 (토글) */}
                {item.subItems && (
                  <Collapse
                    in={activeSubMenu === index}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List sx={{ pl: 4, backgroundColor: "#f1f8e9" }}>
                      {item.subItems.map((subItem, subIndex) => (
                        <ListItem
                          button
                          component={Link}
                          href={subItem.path}
                          key={subIndex}
                        >
                          <ListItemText
                            primary={subItem.label}
                            sx={{ color: "black" }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                )}
              </div>
            ))}
          </List>
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "#f9f9f5",
            p: 3,
          }}
        >
          <Box
            sx={{
              backgroundColor: "white",
              display: "flex",
              alignItems: "center", // 텍스트와 아이콘 수직 정렬
              padding: "8px", // 적절한 여백 추가
            }}
          >
            <Typography variant="body1" sx={{ color: "#808D7C" }}>
              관리자페이지
            </Typography>
            <ChevronRightIcon sx={{ mx: 1, color: "#808D7C" }} />{" "}
            {/* 아이콘 삽입 */}
            <Typography variant="body1" sx={{ color: "#808D7C" }}>
              캠핑장 관리
            </Typography>
            <ChevronRightIcon sx={{ mx: 1, color: "#808D7C" }} />{" "}
            <Typography variant="body1" sx={{ color: "#808D7C" }}>
              캠핑장 정보 보기
            </Typography>
          </Box>
          {/* 첫 번째 박스 */}
          <Box
            sx={{
              borderRadius: 2,
              paddingTop: "5px",
              backgroundColor: "#f1f8e9",
              marginTop: "10px",
              textAlign: "center",
            }}
          >
            <h5 style={{ color: "black" }}>캠핑장 필터</h5>

            {/* 캠핑장 종류 선택 */}
            <select
              onChange={(e) => setCampingType(e.target.value)}
              value={type}
              style={{
                padding: "10px",
                fontSize: "12px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "200px",
                marginBottom: "10px",
                color: "grey",
                marginRight: "20px",
              }}
            >
              <option value="">캠핑장 종류 선택</option>
              <option value="일반야영장">일반야영장</option>
              <option value="글램핑">글램핑</option>
              <option value="카라반">카라반</option>
              <option value="자동차야영장">자동차야영장</option>
            </select>
            <select
              onChange={(e) => setRegion(e.target.value)}
              value={region}
              style={{
                padding: "10px",
                fontSize: "12px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                marginRight: "20px",
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
            <label htmlFor="city">
              <input
                type="text"
                placeholder="시/군"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{
                  padding: "10px",
                  fontSize: "12px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  width: "180px",
                }}
              />
            </label>
            <label
              style={{ color: "black", marginLeft: "20px", fontSize: "12px" }}
            >
              <input
                type="checkbox"
                checked={isPetFriendly}
                onChange={(e) => setIsPetFriendly(e.target.checked)}
                style={{ marginRight: "5px" }}
              />
              반려동물 동반 가능
            </label>
            <button
              onClick={handleSearch}
              style={{
                padding: "5px 10px",
                fontSize: "12px",
                cursor: "pointer",
                borderRadius: "5px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                marginLeft: "30px", // 입력창과 버튼 사이의 간격
              }}
            >
              검색
            </button>
            <button
              onClick={handleReset}
              style={{
                padding: "5px 10px",
                fontSize: "12px",
                cursor: "pointer",
                borderRadius: "5px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                marginLeft: "10px",
              }}
            >
              초기화
            </button>
            {/* 검색 바 */}
            <Box
              sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
            >
              <TextField
                variant="outlined"
                size="small"
                placeholder="검색어를 입력하세요"
                value={searchTerm} // value 속성 추가
                onChange={(e) => setSearchTerm(e.target.value)} // onChange 이벤트 추가
                onKeyPress={handleKeyPress} // onKeyPress 이벤트 추가
                sx={{
                  width: isSmallScreen ? "300px" : "600px",
                  bgcolor: "white",
                  borderRadius: 2,
                  transition: "all 0.3s ease-in-out",
                  marginBottom: "20px",
                  marginTop: "10px",
                  "&:hover": {
                    borderColor: "#8ca18c",
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>

          {/* 두 번째 박스 */}
          <Box
            sx={{
              backgroundColor: "#f9f9f9",
              borderRadius: 2,
              boxShadow: 1,
              p: 2,
              mb: 3,
              marginTop: "10px",
              paddingLeft: "30px",
              paddingRight: "30px",
              display: "flex", // Flexbox 사용
              alignItems: "center", // 세로 방향 가운데 정렬
              flexDirection: "column", // 세로 방향 정렬
            }}
          >
            <h3 style={{ color: "black", justifyContent: "center" }}>
              캠핑장 관리
            </h3>
            <TableContainer
              component={Paper}
              sx={{ boxShadow: 0, borderRadius: 2 }}
            >
              {currentData && currentData.length > 0 ? (
                <Table className="camping-table">
                  <TableHead>
                    <TableRow>
                      <TableCell>이미지</TableCell>
                      <TableCell>상호명</TableCell>
                      <TableCell>주소</TableCell>
                      <TableCell>우편번호</TableCell>
                      <TableCell>전화번호</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentData.map((item, index) => (
                      <TableRow
                        key={index}
                        onClick={() => handleDetailClick(item.contentId)}
                      >
                        <TableCell>
                          {item.firstImageUrl ? (
                            <img src={item.firstImageUrl} alt={item.facltNm} />
                          ) : (
                            <div className="avatar">
                              <ImageIcon className="avatar-icon" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{item.facltNm}</TableCell>
                        <TableCell>{item.addr1}</TableCell>
                        <TableCell>{item.zipcode}</TableCell>
                        <TableCell>{item.tel}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>데이터 없음</p>
              )}
            </TableContainer>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 2,
                width: "100%",
              }}
            >
              <Link href="/admin/campgrounds/write" passHref>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: "#333333",
                    color: "white",
                    marginBottom: "20px",
                  }}
                >
                  캠핑장 정보 등록하기
                </Button>
              </Link>
            </Box>
            <div
              className="pagination"
              style={{ display: "flex", justifyContent: "center" }}
            >
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
          </Box>
        </Box>
      </Box>
    </>
  );
}
