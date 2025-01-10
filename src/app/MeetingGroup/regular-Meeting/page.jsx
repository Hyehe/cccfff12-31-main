'use client';

import {
  Box, Typography, TextField, IconButton, Chip, Grid, Paper, Avatar, Fab, Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AvatarGroup from '@mui/material/AvatarGroup';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import '../../globals.css';
import useAuthStore from 'store/authStore';
import { getCookie } from "cookies-next"; // 쿠키에서 값 가져오는 함수
import axios from 'axios';

// API 및 이미지 URL을 위한 BASE_URL 정의
const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL || "http://localhost:8080/api";
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "http://localhost:8080/uploads";
const BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL || "http://localhost:8080/api";
console.log("BASE_URL:", BASE_URL);

const regions = ['전체', '서울', '경기', '인천', '강원도', '부산', '광주', '수원', '용인', '고양', '창원', '대구', '대전', '울산', '충청도', '전라도', '그 외'];
const hashtags = ['#카라반', '#글램핑', '#야영', '#산', '#바다',
  '#캠프파이어', '#오토캠핑', '#자연', '#별 관찰', '#텐트',
  '#캠핑 장비', '#팀워크', '#소통', '#즐거운 추억', '#자연 보호',
  '#힐링', '#맛있는 음식', '#트레킹', '#낚시', '#자전거 타기',
  '#하이킹', '#스모어', '#캠핑 요리', '#자연 탐험', '#야외 게임',
  '#일출', '#일몰', '#야생동물 관찰', '#사진', '#물놀이',
  '#친목', '#산책', '#명상', '#휴식', '#오프그리드 생활',];

export default function RegularMeetingPage() {
  const token = useAuthStore((state) => state.token);
  const [userIdx, setUserIdx] = useState(null);
  const [userName, setUserName] = useState("");
  // const [userId, setUserId] = useState(null);

  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tagPage, setTagPage] = useState(0);
  const router = useRouter();

  const [searchHistory, setSearchHistory] = useState({});
  const [topSearches, setTopSearches] = useState([]);
  const [currentRank, setCurrentRank] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const [meetings, setMeetings] = useState([]);
  const [allHashtags, setAllHashtags] = useState([]);

  const [page, setPage] = useState(0); // 페이지 번호
  const [hasMore, setHasMore] = useState(true); // 추가 데이터 여부
  const [isTopVisible, setIsTopVisible] = useState(false); // Top 버튼 표시 여부

  useEffect(() => {
    setAllHashtags(hashtags);
  }, []);

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      getUserIdx(token); // 토큰이 있으면 사용자 user_idx 가져오기
    }
  }, []);

  const getUserIdx = async (token) => {
    try {
      const API_URL = `${BASE_URL}/users/profile`;
      console.log("유저 정보 요청 URL:", API_URL);
      console.log("사용 중인 토큰:", token);
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("유저 정보 응답 데이터:", response.data);
      if (response.data.success) {
        const { user_idx, username } = response.data.data;
        setUserName(username);
        setUserIdx(user_idx);
      } else {
        console.error("유저 정보 요청 실패:", response.data.message);
        router.push('/authentication/login'); // 프로필 페치 실패 시 리다이렉트
      }
    } catch (error) {
      console.error("유저 정보 가져오기 실패:", error.message || error);
      router.push('/authentication/login'); // 오류 발생 시 리다이렉트
    }
  };

  useEffect(() => {
    console.log("현재 쿠키 token =", getCookie("token"));
    console.log("현재 zustand token =", token);
    console.log("localStorage token =", localStorage.getItem("token"));

    if (!token) {
      // zustand에 user가 없으면 -> 로그인 페이지로
      router.push('/authentication/login');
    } else {
      // user가 있으면 -> user.id(혹은 user.user_idx 등 PK 필드)를 저장
      //setUserId(token.id);
    }
  }, [token]); //, router

  useEffect(() => {
    if (userIdx) {
      fetchMeetings();
    }
  }, [userIdx]);

  const fetchMeetings = async (newPage = 0) => {
    try {
      console.log(`Fetching meetings for page: ${newPage}`);
      const response = await axios.get(`${BASE_URL}/regular-meetings`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { user_idx: userIdx, page: newPage, size: 10 }, // 페이지와 크기 지정
      });

      if (response.data.meetings.length > 0) {
        console.log("Meetings data fetched:", response.data.meetings);
        if (newPage === 0) {
          setMeetings(response.data.meetings);
          setFilteredMeetings(response.data.meetings);
        } else {
          setMeetings((prev) => [...prev, ...response.data.meetings]);
          setFilteredMeetings((prev) => [...prev, ...response.data.meetings]);
        }
        setPage(newPage);
      } else {
        console.log("No more meetings to fetch.");
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching meetings:", error?.response?.data || error.message || error);
      alert("모임 데이터를 불러오는 데 문제가 발생했습니다.");
    }
  };

  const handleScroll = () => {
    const scrollTop = window.scrollY; // or document.documentElement.scrollTop
    const { scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop > 200) {
      setIsTopVisible(true);
    } else {
      setIsTopVisible(false);
    }

    if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore) {
      console.log("Loading next page:", page + 1);
      fetchMeetings(page + 1);
    }
  };

  useEffect(() => {
    console.log("Is Top Visible:", isTopVisible);
  }, [isTopVisible]);

  useEffect(() => {
    console.log("Adding scroll event listener");
    window.addEventListener('scroll', handleScroll);
    return () => {
      console.log("Removing scroll event listener");
      window.removeEventListener('scroll', handleScroll);
    };
  }, [page, hasMore]); // 페이지나 데이터가 변경될 때 이벤트를 다시 연결

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCardClick = (meeting_idx) => {
    console.log("Navigating to meeting detail:", meeting_idx);
    router.push(`/MeetingGroup/regular-Meeting/detail/${meeting_idx}`);
  };

  // 좋아요 상태 로드
  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem('likedMeetings')) || {};
    setFilteredMeetings((prevMeetings) =>
      prevMeetings.map((meeting) => ({
        ...meeting,
        liked: !!savedLikes[meeting.meeting_idx],
      }))
    );
  }, []);

  const toggleLike = async (meeting_idx) => {
    try {
      const token = getCookie("token");
      if (!token) {
        alert("인증 토큰이 없습니다. 다시 로그인해주세요.");
        router.push('/authentication/login');
        return;
      }
      const url = `${LOCAL_API_BASE_URL}/regular-meetings/detail/${meeting_idx}/favorite`;
      console.log("Toggle Like URL:", url);
      console.log("Token:", token);

      const response = await axios.post(url, null, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        params: { user_idx: userIdx },
      });

      console.log("Toggle Like Response Status:", response.status);

      if (response.status === 401) {
        alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
        router.push('/authentication/login');
        return;
      }

      if (response.status !== 200) {
        console.error("Failed to toggle favorite");
        console.log("Error data:", response.data);
        alert(`오류 발생: ${response.data.message || '알 수 없는 오류'}`);
        return;
      }

      const data = response.data; // { success: true, favorite: true/false }
      setFilteredMeetings((prev) =>
        prev.map((m) =>
          m.meeting_idx === meeting_idx ? { ...m, favorites_idx: data.favorite } : m
        )
      );

      const savedLikes = JSON.parse(localStorage.getItem('likedMeetings')) || {};
      if (data.favorite) {
        savedLikes[meeting_idx] = true;
      } else {
        delete savedLikes[meeting_idx];
      }
      localStorage.setItem('likedMeetings', JSON.stringify(savedLikes));
    } catch (err) {
      console.error("Error toggling favorite:", err);
      alert("좋아요 기능을 사용하는 중 오류가 발생했습니다.");
    }
  };

  // 태그 버튼 검색 필터
  const handleTagFilter = (tag) => {
    setFilteredMeetings(meetings.filter((meeting) =>
      Array.isArray(meeting.hashtags) && meeting.hashtags.some(h => h.name === tag)
    ));
  };

  // 지역 버튼
  const handleRegionFilter = (region) => {
    if (region === '전체') {
      setFilteredMeetings(meetings);
    } else {
      setFilteredMeetings(meetings.filter((meeting) => meeting.region === region));
    }
  };

  // 검색바의 검색 필터 
  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    const lowerSearchTerm = searchTerm.toLowerCase();

    setFilteredMeetings(
      meetings.filter(
        (meeting) =>
          meeting.region.toLowerCase().includes(lowerSearchTerm) ||
          meeting.name.toLowerCase().includes(lowerSearchTerm) ||
          meeting.created_at.includes(lowerSearchTerm) ||
          meeting.subregion.toLowerCase().includes(lowerSearchTerm) ||
          (Array.isArray(meeting.hashtags) &&
            meeting.hashtags.some((hashtag) =>
              (typeof hashtag === 'string' ? hashtag.toLowerCase() : hashtag.name.toLowerCase()).includes(lowerSearchTerm)
            ))
      )
    );

    // 검색 기록 저장
    const updatedSearchHistory = { ...searchHistory };
    updatedSearchHistory[searchTerm] = (updatedSearchHistory[searchTerm] || 0) + 1;
    setSearchHistory(updatedSearchHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedSearchHistory));
    updateTopSearches(updatedSearchHistory);
  };

  // 태그 페이징 
  const handleTagPagination = (direction) => {
    setTagPage((prevPage) => {
      // 태그 갯수를 기준으로 총 페이지 수 계산
      const totalPages = Math.ceil(hashtags.length / 7); // 7개씩 표시하므로 총 페이지 수는 태그 길이 / 7

      if (direction === 'next') {
        // 마지막 페이지에서 오른쪽 화살표 클릭 시 첫 페이지로 돌아가도록 설정
        return prevPage === totalPages - 1 ? 0 : prevPage + 1; // 현재 마지막 페이지면 첫 페이지로, 아니면 다음 페이지로
      } else {
        // 첫 페이지에서 왼쪽 화살표 클릭 시 마지막 페이지로 돌아가도록 설정
        return prevPage === 0 ? totalPages - 1 : prevPage - 1; // 현재 첫 페이지면 마지막 페이지로, 아니면 이전 페이지로
      }
    });
  };

  // visibleTags에서 slice 적용
  const visibleTags = Array.isArray(allHashtags)
    ? allHashtags.slice(tagPage * 7, (tagPage + 1) * 7)
    : [];

  // 실시간 검색 기능

  // 로컬스토리지에서 검색 기록 로드
  useEffect(() => {
    const savedSearchHistory = JSON.parse(localStorage.getItem('searchHistory')) || {};
    setSearchHistory(savedSearchHistory);
    updateTopSearches(savedSearchHistory);
  }, []);

  // 실시간 검색어 리스트에서 검색어 클릭 시 필터링
  const handleSearchFromList = (term) => {
    setSearchTerm(term);
    setFilteredMeetings(
      meetings.filter(
        (meeting) =>
          meeting.region.toLowerCase().includes(term.toLowerCase()) ||
          meeting.name.toLowerCase().includes(term.toLowerCase()) ||
          meeting.created_at.includes(term) ||
          meeting.subregion.toLowerCase().includes(term.toLowerCase()) ||
          (
            Array.isArray(meeting.hashtags) &&
            meeting.hashtags.some((ht) => ht.name?.toLowerCase().includes(term.toLowerCase()))
          )
      )
    );

    // 실검에서 누른 것도 기록 추가 및 저장
    const updatedSearchHistory = { ...searchHistory };
    updatedSearchHistory[term] = (updatedSearchHistory[term] || 0) + 1;
    setSearchHistory(updatedSearchHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedSearchHistory));
    updateTopSearches(updatedSearchHistory);
  };

  // 상위 검색어 업데이트 함수
  const updateTopSearches = (searchHistory) => {
    const sortedSearches = Object.entries(searchHistory)
      .sort(([, a], [, b]) => b - a) // 검색 횟수로 정렬
      .slice(0, 10); // 상위 10개만 표시
    setTopSearches(sortedSearches);
  };

  // 순환 기능 (1위씩 순환)
  useEffect(() => {
    if (!isExpanded) {
      const interval = setInterval(() => {
        setCurrentRank((prevRank) => (prevRank + 1) % topSearches.length);
      }, 2000); // 2초마다 순위 변경
      return () => clearInterval(interval);
    }
  }, [isExpanded, topSearches]);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <Box sx={{ padding: '20px', textAlign: 'center', paddingTop: '80px', margin: '0 auto', width: '70%' }}>
      {/* 페이지 제목 */}
      <Box sx={{ '& > :not(style)': { m: 1 } }}>
        <Typography variant="h4" component="div" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
          <a href='/MeetingGroup/regular-Meeting' style={{ textDecoration: 'none', color: 'inherit' }}>
            정규모임 &nbsp;
          </a>
          <Fab size="small" color="secondary" aria-label="add" href='/MeetingGroup/regular-Meeting-Make'
            style={{ backgroundColor: '#597445' }}>
            <AddIcon />
          </Fab>
        </Typography>
      </Box>
      <br />

      {/* 검색바 및 실시간 검색어 */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: { md: 'center', xs: 'center' },
          alignItems: 'center',
          gap: 2,
          marginBottom: '20px',
          position: 'relative',
        }}
      >
        {/* 검색창 */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            variant="outlined"
            placeholder="검색어를 입력하세요"
            sx={{ width: { xs: '100%', md: '300px' } }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch(); // Enter키 눌러도 검색 가능
              }
            }}
          />
          <IconButton size="large" onClick={handleSearch}>
            <SearchIcon sx={{ color: 'green' }} />
          </IconButton>
        </Box>

        {/* 실시간 검색어 */}
        <Box
          sx={{
            position: { md: 'absolute', lg: 'absolute' },
            right: 0,
            top: '0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', md: 'flex-end' },
            width: { xs: '100%', md: 'auto' },
          }}
        >
          <Typography
            variant="h8"
            sx={{
              fontWeight: 'bold', display: 'flex', alignItems: 'center'
              // ,justifyContent: { xs: 'center', md: 'flex-start' }, 
            }}
          >
            실시간 검색어
            <IconButton onClick={toggleExpand}>
              <ArrowDropDownIcon fontSize="large" />
            </IconButton>
          </Typography>

          {!isExpanded ? (
            // 순환 모드
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              {topSearches[currentRank] && (
                <>
                  <Box
                    key={currentRank} // 순환 검색어에 고유 key 설정
                    sx={{
                      animation: 'slideUp 0.5s ease-in-out', // 애니메이션 적용
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="h8" sx={{ marginRight: '10px', fontWeight: 'bold' }}>
                      {currentRank + 1}위
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: 'black', cursor: 'pointer', textDecoration: 'none', marginRight: '50px' }}
                      onClick={() => handleSearchFromList(topSearches[currentRank][0])}
                    >
                      {topSearches[currentRank][0]}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          ) : (
            // 전체 목록 보기
            <TableContainer
              component={Paper}
              sx={{
                width: '280px',
                // width: { xs: '100%', md: '300px' },
                maxHeight: '300px',
                overflowY: 'auto',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                marginTop: '10px',
                zIndex: '10'
              }}
            >
              <Table>
                <TableBody>
                  {topSearches.map(([term, count], index) => (
                    <TableRow key={index}>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                        {index + 1}위
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ color: 'black', cursor: 'pointer', textDecoration: 'none' }}
                        onClick={() => handleSearchFromList(term)}
                      >
                        {term}
                      </TableCell>
                      <TableCell align="center" sx={{ color: 'gray' }}>
                        {count}회
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
      <br /><br />

      {/* 키워드 태그 */}
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', marginBottom: '20px', flexWrap: 'nowrap' }}>
        <IconButton onClick={() => handleTagPagination('prev')} disabled={tagPage === 0} sx={{ alignSelf: 'center' }}>
          <ArrowBackIosIcon />
        </IconButton>
        {visibleTags.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            clickable
            onClick={() => handleTagFilter(tag)}
            sx={{
              fontSize: '14px',
              padding: '10px',
              backgroundColor: '#f2fce8',
              '&:hover': { backgroundColor: '#d7f0c2' },
              '&.MuiChip-clicked': { backgroundColor: '#a0d996', color: 'white' }, // 클릭 후 배경 및 글자색
              whiteSpace: 'nowrap', // 텍스트가 한 줄로만 표시되도록 설정
            }}
          />
        ))}

        <IconButton onClick={() => handleTagPagination('next')} disabled={(tagPage + 1) * 7 >= allHashtags.length} sx={{ alignSelf: 'center' }}>
          <ArrowForwardIosIcon sx={{ fontSize: '24px' }} />
        </IconButton>

      </Box>

      {/* 지역 필터 */}
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
        {regions.map((region, idx) => (
          <Chip
            key={idx}
            label={region}
            clickable
            onClick={() => handleRegionFilter(region)}
            sx={{
              fontSize: '14px',
              padding: '10px',
              backgroundColor: '#F0F0F0',
              '&:hover': { backgroundColor: '#D9D9D9' },
            }}
          />
        ))}
      </Box>
      <br />

      {/* 모임 카드 */}
      <Grid container spacing={3} justifyContent="center">
        {filteredMeetings.map((meeting) => {
          const totalMembersCount = Array.isArray(meeting.membersAvatar) ? meeting.membersAvatar.length + 1 : 1; // 리더 포함
          const remainingMembersCount = meeting.personnel - totalMembersCount;

          return (
            <Grid item key={meeting.meeting_idx}>
              <Paper
                elevation={3}
                onClick={() => handleCardClick(meeting.meeting_idx)}
                sx={{
                  cursor: 'pointer',
                  width: '360px',
                  height: '230px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: meeting.favorites_idx ? '#ffe5b4' : '#f5eedc',
                  color: meeting.favorites_idx ? '#704C2E' : '#595959',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  borderRadius: '12px',
                  transition: 'background-color 0.3s, transform 0.3s',
                  '&:hover': {
                    backgroundColor: meeting.favorites_idx ? '#ffd18c' : '#e4d7c5',
                    transform: 'scale(1.02)',
                  },
                }}
              >
                {/* 하트 아이콘 */}
                <Box
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(meeting.meeting_idx);
                  }}
                  sx={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    cursor: 'pointer',
                    zIndex: 10,
                    animation: meeting.favorites_idx ? 'likeAnimation 0.3s ease-in-out' : 'none',
                  }}
                >
                  <img
                    src={meeting.favorites_idx ? '/images/heart-fill-icon.svg' : '/images/heart-icon.svg'}
                    alt="좋아요"
                    style={{ width: '25px', height: '25px' }}
                  />
                </Box>

                {/* 모임 이미지 */}
                <Box
                  component="img"
                  src={`${IMAGE_BASE_URL}/${meeting.profile_image}`}
                  alt="모임 대표 이미지"
                  sx={{
                    width: '140px',
                    height: '140px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    marginRight: '16px',
                    flexShrink: 0,
                  }}
                  onError={(e) => { e.target.src = '/images/camping2.png'; }} // 기본 이미지 설정
                />
                {/* 모임 설명 */}
                <Box
                  sx={{
                    width: 'calc(100% - 146px)',
                    overflow: 'hidden',
                  }}
                >
                  <Typography variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {meeting.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {meeting.region} · {meeting.subregion}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {meeting.created_at}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ marginRight: '8px' }}>
                      정원: {totalMembersCount} / {meeting.personnel}
                    </Typography>
                    <AvatarGroup max={4}>
                      {/* 리더의 아바타 추가 */}
                      <Avatar src={`${IMAGE_BASE_URL}/${meeting.leader_avatar_url}`} alt={meeting.leader_username} />
                      {/* 일반 멤버 아바타 */}
                      {Array.isArray(meeting.membersAvatar) &&
                        meeting.membersAvatar
                          .sort(() => Math.random() - 0.5)
                          .slice(0, 3)
                          .map((mem) => (
                            <Avatar key={mem.user_idx || mem.avatar_url} src={`${IMAGE_BASE_URL}/${mem.avatar_url}`} />
                          ))}
                    </AvatarGroup>
                  </Box>
                  <Box sx={{ marginTop: '8px', display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {Array.isArray(meeting.hashtags) && meeting.hashtags.map((tagObj) => (
                      <Chip
                        key={tagObj.hashtag_idx || tagObj.name} // 고유한 키 사용
                        label={tagObj.name}
                        sx={{ backgroundColor: '#b3d468', fontSize: '12px' }}
                      />
                    ))}
                  </Box>
                </Box>
              </Paper>
            </Grid>
          )
        })}
      </Grid>

      <Box>
        {/* Top 버튼 */}
        {isTopVisible && (
          <Fab
            color="secondary"
            size="small"
            onClick={scrollToTop}
            sx={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 1000,
              backgroundColor: '#597445',
              color: '#fff',
              '&:hover': { backgroundColor: '#456333' },
              display: 'block', // 항상 표시되도록
            }}
          >
            ↑
          </Fab>
        )}
      </Box>

    </Box>
  );
}
