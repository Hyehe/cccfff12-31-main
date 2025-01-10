'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  Modal,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import axiosInstance from '../../../../utils/axiosInstance'; // axios 인스턴스 import
import useAuthStore from 'store/authStore';
import { getCookie } from "cookies-next";
// 상단에 아이콘 관련 임포트 추가
import { Icon } from '@iconify/react';
import crownIcon from '@iconify-icons/mdi/crown';

export default function MeetPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL || "http://localhost:8080/api";
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "http://localhost:8080/uploads";

  const router = useRouter();
  const params = useParams();
  const meetingId = params.id || "";
  const token = useAuthStore((state) => state.token);

  // 토글로 사용하는 사이드 메뉴(햄버거) 관련
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 모임 상세 정보
  const [meeting, setMeeting] = useState(null);

  // 멤버 목록
  const [members, setMembers] = useState([]);

  // 사용자 정보
  const [userIdx, setUserIdx] = useState(null);
  const [userName, setUserName] = useState("");

  // 전체 멤버 보기 모달
  const [modalOpen, setModalOpen] = useState(false);

  // 모임 수정 모달
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editSelectedFile, setEditSelectedFile] = useState(null);
  const [editPreviewImage, setEditPreviewImage] = useState(null);
  const [editDescription, setEditDescription] = useState("");
  const [editRegion, setEditRegion] = useState("");
  const [editSubregion, setEditSubregion] = useState("");
  const [editPersonnel, setEditPersonnel] = useState(0);

  // 리더만 수정/삭제하기 위한 메뉴
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  // 로딩 상태
  const [loading, setLoading] = useState(true);

  // 메뉴 열기/닫기
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // 전체 멤버 보기 모달 열기/닫기
  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  // 사이드 드로어 열기/닫기
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // -----------------------------
  // 1) 유저 정보 가져오기
  // -----------------------------
  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      getUserIdx(token);
    }
  }, []);

  const getUserIdx = async (token) => {
    try {
      const response = await axiosInstance.get(`/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const fetchedUserIdx = response.data.data.user_idx;
        const fetchedUserName = response.data.data.username;
        setUserName(fetchedUserName);
        setUserIdx(fetchedUserIdx);
        useAuthStore.getState().setToken(token);
      } else {
        console.error("유저 정보 요청 실패:", response.data.message);
        router.push('/authentication/login');
      }
    } catch (error) {
      console.error("유저 정보 가져오기 실패:", error.message || error);
      router.push('/authentication/login');
    }
  };

  // -----------------------------
  // 2) 모임 상세 + 멤버 정보 가져오기
  // -----------------------------
  const fetchMeetingDetails = async () => {
    try {
      // 백엔드에서 user_idx 파라미터가 필요할 수 있어 params로 전달
      const response = await axiosInstance.get(`/regular-meetings/detail/${meetingId}`, {
        params: { user_idx: userIdx },
      });
      if (response.data) {
        setMeeting(response.data);
      } else {
        console.error("모임 상세 정보 요청 실패:", response.data);
        alert("모임 상세 정보를 불러오는 데 실패했습니다.");
        router.push('/MeetingGroup/regular-Meeting');
      }
    } catch (error) {
      console.error("모임 상세 정보 가져오기 실패:", error);
      alert("모임 상세 정보를 불러오는 데 실패했습니다.");
      router.push('/MeetingGroup/regular-Meeting');
    }
  };

  const fetchMeetingMembers = async () => {
    try {
      const response = await axiosInstance.get(`/regular-meetings/detail/${meetingId}/members`);
      if (response.data) {
        setMembers(response.data);
      } else {
        console.error("모임 멤버 정보 요청 실패:", response.data);
        setMembers([]);
      }
    } catch (error) {
      console.error("모임 멤버 정보 가져오기 실패:", error);
      setMembers([]);
    }
  };

  // userIdx, token이 준비되면 모임 정보 요청
  useEffect(() => {
    if (!meetingId) {
      router.push('/MeetingGroup/regular-Meeting');
      return;
    }
    if (!userIdx || !token) {
      // userIdx와 token이 아직 설정되지 않았으면 대기
      return;
    }

    // 모임 상세 및 멤버 정보
    fetchMeetingDetails();
    fetchMeetingMembers();
  }, [meetingId, userIdx, token, router]);

  // 로딩 상태 해제
  useEffect(() => {
    if (meeting !== null) {
      setLoading(false);
    }
  }, [meeting, members]);

  // 3) 가입 / 탈퇴 / 수정 / 삭제 로직
  const handleJoinMeeting = () => {
    axiosInstance.post(`/regular-meetings/detail/${meetingId}/join`, null, {
      params: { user_idx: userIdx },
    })
      .then(() => {
        alert("가입되었습니다!");
        fetchMeetingDetails(); // 가입 후 다시 모임 정보 갱신
        fetchMeetingMembers(); // 멤버 목록도 갱신
      })
      .catch((err) => {
        if (err.response?.status === 409) {
          alert(err.response.data); // "이미 가입된 회원입니다."
        } else {
          console.error(err);
          alert("에러가 발생했습니다.");
        }
      });
  };

  const handleLeaveMeeting = () => {
    if (!confirm("정말 모임을 탈퇴하시겠습니까?")) return;

    axiosInstance.post(`/regular-meetings/detail/${meetingId}/leave`, null, {
      params: { user_idx: userIdx },
    })
      .then(() => {
        alert("모임을 성공적으로 탈퇴했습니다.");
        fetchMeetingDetails();
        fetchMeetingMembers();
      })
      .catch((err) => {
        console.error("모임 탈퇴 실패:", err);
        alert("모임 탈퇴 중 오류가 발생했습니다.");
      });
  };

  // 수정 모달 열기
  const openEditModal = () => {
    if (!meeting) return;
    setEditName(meeting.name || "");
    setEditDescription(meeting.description || "");
    setEditRegion(meeting.region || "");
    setEditSubregion(meeting.subregion || "");
    setEditPersonnel(meeting.personnel || 0);

    // 기존 이미지가 있으면 미리보기
    if (meeting.profile_image) {
      setEditPreviewImage(`${IMAGE_BASE_URL}/${meeting.profile_image}`);
    } else {
      setEditPreviewImage(null);
    }
    setEditSelectedFile(null);

    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  // 실제 수정 요청
  const handleUpdateMeeting = async () => {
    if (!confirm("정말 수정하시겠습니까?")) return;

    try {
      const formData = new FormData();
      formData.append("name", editName);
      formData.append("description", editDescription);
      formData.append("region", editRegion);
      formData.append("subregion", editSubregion);
      formData.append("personnel", editPersonnel);
      formData.append("user_idx", userIdx);
      formData.append("leader_idx", userIdx);
      formData.append("profile_image", meeting.profile_image); // 기존 이미지 이름 유지

      if (editSelectedFile) {
        formData.append("file", editSelectedFile);
      }

      await axiosInstance.put(
        `/regular-meetings/detail/${meeting.meeting_idx}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("모임 수정 완료");
      setEditModalOpen(false);
      fetchMeetingDetails(); // 수정 후 다시 모임 정보 불러오기
    } catch (error) {
      console.error("모임 수정 실패:", error);
      alert("수정 도중 오류가 발생했습니다.");
    }
  };

  // 모임 삭제
  const handleDeleteMeeting = async () => {
    if (!confirm("정말 모임을 삭제하시겠습니까?")) {
      return;
    }
    try {
      await axiosInstance.delete(`/regular-meetings/detail/${meetingId}`, {
        params: { leader_idx: userIdx },
      });
      alert("모임이 삭제되었습니다.");
      router.push("/MeetingGroup/regular-Meeting");
    } catch (error) {
      console.error("모임 삭제 실패:", error);
      alert("삭제 도중 오류가 발생했습니다.");
    }
  };

  // 4) 기타 함수들
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setEditSelectedFile(file);
      setEditPreviewImage(URL.createObjectURL(file)); // 미리보기
    }
  };

  // 5) 렌더링
  if (loading) {
    return <Typography>Loading...</Typography>;
  }
  if (!meeting) {
    return <Typography>Loading...</Typography>;
  }

  // 모임장 프로필을 위한 임시 객체
  const host = {
    username: meeting.leader_username,
    name: meeting.name,
    avatar_url: meeting.leader_avatar_url,
    profile_image: meeting.profile_image,
    description: meeting.description,
  };

  // 멤버 표시(최대 5명까지)
  const displayedMembers = Array.isArray(members) ? members.slice(0, 4) : [];
  const totalMembersCount = Array.isArray(members) ? members.length + 1 : 1; // 리더 포함
  const remainingMembersCount = Array.isArray(members)
    ? members.length - displayedMembers.length
    : 0;

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", padding: "20px 0" }}>
      <Box sx={{ maxWidth: "800px", margin: "0 auto", padding: "0 20px" }}>
        {/* 1) 우측 하단 햄버거 버튼 */}
        <IconButton
          onClick={() => {
            // 모임장 or 가입 멤버만 드로어 열기 가능
            if (meeting.member || Number(userIdx) === Number(meeting.leader_idx)) {
              handleDrawerToggle();
            } else {
              alert("가입이 필요합니다.");
            }
          }}
          sx={{
            position: "fixed",
            bottom: "26px",
            right: "26px",
            backgroundColor: "#28a745",
            color: "white",
            zIndex: 10,
            "&:hover": { backgroundColor: "#218838" },
          }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          PaperProps={{
            sx: {
              position: "absolute",
              top: "25vh",
              height: "40vh",
              width: "300px",
              margin: "0 auto",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "16px",
              backdropFilter: "blur(10px)",
            },
          }}
        >
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* 드로어 닫기 버튼 */}
            <IconButton
              onClick={handleDrawerToggle}
              sx={{ display: "flex", justifyContent: "flex-end", margin: 1 }}
            >
              <CloseIcon />
            </IconButton>
            {/* 네비게이션 리스트 */}
            <List sx={{ padding: 0, margin: 0 }}>
              {[
                { label: "홈", href: `/MeetingGroup/regular-Meeting/detail/${meetingId}` },
                { label: "게시판", href: `/MeetingGroup/regular-Meeting/detail/${meetingId}/bulletinboard` },
                { label: "사진첩", href: `/MeetingGroup/regular-Meeting/detail/${meetingId}/photogallery` },
                { label: "채팅", href: `/MeetingGroup/regular-Meeting/detail/${meetingId}/chat` },
              ].map((item) => (
                <Link key={item.label} href={item.href} passHref legacyBehavior>
                  <a style={{ textDecoration: "none" }}>
                    <ListItem
                      component="div"
                      onClick={handleDrawerToggle}
                      sx={{
                        textAlign: "center",
                        "&:hover": { backgroundColor: "#dff0d8" },
                        cursor: "pointer",
                      }}
                    >
                      <ListItemText
                        primary={item.label}
                        sx={{
                          textAlign: "center",
                          fontWeight: "bold",
                          color: "#333",
                        }}
                      />
                    </ListItem>
                  </a>
                </Link>
              ))}
            </List>
          </Box>
        </Drawer>

        {/*  2) 상단 메인 배너 */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "250px",
            backgroundImage: meeting.profile_image
              ? `url(${IMAGE_BASE_URL}/${meeting.profile_image})`
              : `url(/images/cam1.webp)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "8px",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              bottom: "-40px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: 2,
              padding: "10px 15px",
              width: "40%",
              textAlign: "center",
            }}
          >
            <Avatar
              src={`${IMAGE_BASE_URL}/${host.avatar_url}`}
              alt={host.username}
              sx={{
                width: 50,
                height: 50,
                margin: "0 auto",
                border: "2px solid white",
                marginBottom: "8px",
              }}
            />
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ fontSize: "15px", color: "black" }}
            >
              {host.name}
            </Typography>
          </Box>
        </Box>

        {/*  3) 모임 소개*/}
        <Box sx={{ mt: "70px", mb: 3, position: 'relative' }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "black", mb: 2 }}
          >
            모임소개
          </Typography>

          {/* 리더 정보 */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              src={`${IMAGE_BASE_URL}/${meeting.leader_avatar_url}`}
              alt={meeting.leader_username}
              sx={{ width: 50, height: 50 }}
            />
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ color: "black" }}
              >
                {meeting.leader_username}
              </Typography>
              <Typography variant="body2" sx={{ color: "black" }}>
                * 장소: {meeting.region} · {meeting.subregion} <br />
                * 정원: {totalMembersCount} / {meeting.personnel} <br />
                * 내용: {meeting.description || "안녕하세요. 환영합니다."}
              </Typography>
            </Box>
          </Box>

          {/* 리더 메뉴(수정/삭제) */}
          {userIdx && meeting && Number(userIdx) === Number(meeting.leader_idx) && (
            <Box sx={{ position: 'absolute', top: '160px' }}>
              <IconButton
                onClick={handleMenuClick}
                sx={{
                  position: "fixed",
                  bottom: "80px",
                  right: "25px",
                  color: "#000",
                  zIndex: 10,
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    boxShadow: 2,
                  },
                }}
              >
                <MenuItem onClick={() => { handleMenuClose(); openEditModal(); }}>
                  수정하기
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); handleDeleteMeeting(); }}>
                  삭제하기
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>

        {/*  4) 멤버 정보 */}
        <Box
          sx={{
            backgroundColor: "#eaffea",
            borderRadius: "8px",
            padding: "15px",
            textAlign: "center",
            boxShadow: 2,
            mb: 4,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "black", mb: 2 }}
          >
            함께할 멤버들
          </Typography>
          <Grid container justifyContent="center" spacing={1}>
            {Array.isArray(displayedMembers) && displayedMembers.length > 0 ? (
              displayedMembers.map((member) => (
                <Grid item key={member.user_idx}>
                  <Avatar
                    src={`${IMAGE_BASE_URL}/${member.avatar_url}`}
                    alt={member.username}
                    sx={{
                      width: 40,
                      height: 40,
                      border: "1px solid #fff",
                      boxShadow: 1,
                    }}
                  />
                </Grid>
              ))
            ) : (
              // 멤버가 한 명도 없으면 아래처럼, 혹은 문구 빼도 무방
              <Typography variant="body2" fontWeight="bold" sx={{ mt: 2, color: "black" }}>
                아직 멤버가 없습니다.
              </Typography>
            )}

            {remainingMembersCount > 0 && (
              <Grid item>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    color: "#888",
                    fontWeight: "bold",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={openModal} // 클릭 시 전체 멤버 모달 열기
                >
                  +{remainingMembersCount}
                </Avatar>
              </Grid>
            )}
          </Grid>

          <Box sx={{ mt: 2 }}>
            {Number(userIdx) === Number(meeting.leader_idx) ? (
              <Typography variant="body2" fontWeight="bold" sx={{ color: "black" }}>
                "{userName}" 모임장님, 환영합니다.
              </Typography>
            ) : meeting.member ? (
              // 가입된 멤버인 경우
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ color: "black" }}
                >
                  {userName}님, 환영합니다!
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleLeaveMeeting}
                  sx={{
                    position: 'absolute',
                    right: 0,
                    fontSize: "10px",
                    width: "80px",
                    height: "20px",
                    borderColor: "green",
                    color: "green",
                    "&:hover": { backgroundColor: "lightgreen", borderColor: "green" },
                  }}
                >
                  탈퇴하기
                </Button>
              </Box>
            ) : (
              // 미가입자
              <>
                {totalMembersCount >= meeting.personnel ? (
                  <Typography variant="body2" fontWeight="bold" sx={{ color: "green" }}>
                    "{host.name}" 모임이 정원에 도달했습니다.<br />
                    다른 모임을 찾아보세요!
                  </Typography>
                ) : (
                  <>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: "black" }}>
                      "{host.name}" 모임에 가입해 다양한 추억들을 쌓아보세요!
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        mt: 1.5,
                        backgroundColor: "#28a745",
                        color: "white",
                        "&:hover": { backgroundColor: "#218838" },
                      }}
                      onClick={handleJoinMeeting}
                      disabled={totalMembersCount >= meeting.personnel}
                    >
                      가입하기
                    </Button>
                  </>
                )}
              </>
            )}
          </Box>

          {/* 전체 멤버 모달 */}
          <Modal
            open={modalOpen}
            onClose={closeModal}
            aria-labelledby="member-modal-title"
            aria-describedby="member-modal-description"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
                borderRadius: '8px',
                maxHeight: '80vh',
                overflowY: 'auto',
              }}
            >
              <Typography id="member-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                모든 멤버
              </Typography>
              <Grid container spacing={2}>
      {/* 리더 표시 */}
      <Grid item xs={4} sm={3} sx={{ textAlign: 'center' }}>
        <Avatar
          src={`${IMAGE_BASE_URL}/${meeting.leader_avatar_url}`}
          alt={meeting.leader_username}
          sx={{ width: 60, height: 60, margin: '0 auto' }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, marginLeft: 0.5 }}>
          <Icon icon={crownIcon} color="#FFD700" width="16" height="16" />
          <Typography variant="body2" sx={{ marginRight: 0.5 }}>
            {meeting.leader_username}
          </Typography>
        </Box>
      </Grid>

      {/* 일반 멤버 표시 */}
      {Array.isArray(members) && members.length > 0 ? (
        members.map((member) => (
          <Grid item xs={4} sm={3} key={member.user_idx} sx={{ textAlign: 'center' }}>
            <Avatar
              src={`${IMAGE_BASE_URL}/${member.avatar_url}`}
              alt={member.username}
              sx={{ width: 60, height: 60, margin: '0 auto' }}
            />
            <Typography variant="body2" sx={{ mt: 1 }}>
              {member.username}
            </Typography>
          </Grid>
        ))
      ) : (
        <Typography>멤버가 없습니다.</Typography>
      )}
    </Grid>
    <Box sx={{ textAlign: 'right', mt: 2 }}>
      <Button
        variant="contained"
        onClick={closeModal}
        sx={{
          backgroundColor: "#28a745",
          "&:hover": { backgroundColor: "#218838" }
        }}
      >
        닫기
      </Button>
    </Box>
  </Box>
</Modal>
    </Box>

        {/* 5) 게시판 / 사진첩 2개 박스 가로 배치*/ }
  <Box sx={{ mb: 4 }}>
    <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
      {/* ------- (1) 게시판 박스 ------- */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: 2,
          padding: 2,
          textAlign: "center",
          cursor: "pointer",
          "&:hover": { backgroundColor: "#f8f8f8" },
        }}
        onClick={() => {
          if (meeting.member || Number(userIdx) === Number(meeting.leader_idx)) {
            router.push(`/MeetingGroup/regular-Meeting/detail/${meetingId}/bulletinboard`);
          } else {
            alert("가입이 필요합니다.");
          }
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "black", mb: 1 }}
        >
          게시판
        </Typography>
        <Button
          variant="outlined"
          endIcon={<ArrowForwardIosIcon fontSize="small" />}
          sx={{
            fontWeight: "bold",
            color: "#28a745",
            borderColor: "#28a745",
            "&:hover": {
              backgroundColor: "#28a745",
              color: "#ffffff",
            },
          }}
          onClick={(e) => {
            e.stopPropagation(); // 부모 Box의 onClick이 먼저 실행되지 않도록
            if (meeting.member || Number(userIdx) === Number(meeting.leader_idx)) {
              router.push(`/MeetingGroup/regular-Meeting/detail/${meetingId}/bulletinboard`);
            } else {
              alert("가입이 필요합니다.");
            }
          }}
        >
          더보기
        </Button>
      </Box>

      {/* ------- (2) 사진첩 박스 ------- */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: 2,
          padding: 2,
          textAlign: "center",
          cursor: "pointer",
          "&:hover": { backgroundColor: "#f8f8f8" },
        }}
        onClick={() => {
          if (meeting.member || Number(userIdx) === Number(meeting.leader_idx)) {
            router.push(`/MeetingGroup/regular-Meeting/detail/${meetingId}/photogallery`);
          } else {
            alert("가입한 멤버만 접근 가능합니다.");
          }
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "black", mb: 1 }}
        >
          사진첩
        </Typography>
        <Button
          variant="outlined"
          endIcon={<ArrowForwardIosIcon fontSize="small" />}
          sx={{
            fontWeight: "bold",
            color: "#28a745",
            borderColor: "#28a745",
            "&:hover": {
              backgroundColor: "#28a745",
              color: "#ffffff",
            },
          }}
          onClick={(e) => {
            e.stopPropagation(); // 부모 Box의 onClick이 먼저 실행되지 않도록
            if (meeting.member || Number(userIdx) === Number(meeting.leader_idx)) {
              router.push(`/MeetingGroup/regular-Meeting/detail/${meetingId}/photogallery`);
            } else {
              alert("가입한 멤버만 접근 가능합니다.");
            }
          }}
        >
          더보기
        </Button>
      </Box>
    </Box>
  </Box>
      </Box >

    {/* 6) 모임 수정 모달*/ }
    <Dialog open = { editModalOpen } onClose = { closeEditModal } fullWidth maxWidth = "sm" >
        <DialogTitle>모임 수정하기</DialogTitle>
        <DialogContent>
          <TextField
            label="모임 제목"
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />

          {/* 이미지 미리보기 */}
          {editPreviewImage && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                기존/새 프로필 미리보기
              </Typography>
              <Avatar
                src={editPreviewImage}
                alt="Selected Profile"
                sx={{ width: 100, height: 100, margin: '0 auto' }}
              />
            </Box>
          )}

          {/* 파일 선택 버튼 */}
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" component="label" color="success">
              새 프로필 사진 선택
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
          </Box>

          <TextField
            label="모임 설명"
            fullWidth
            multiline
            rows={5}
            variant="outlined"
            sx={{ mt: 2 }}
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
          <TextField
            label="지역"
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            value={editRegion}
            onChange={(e) => setEditRegion(e.target.value)}
          />
          <TextField
            label="세부 지역"
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            value={editSubregion}
            onChange={(e) => setEditSubregion(e.target.value)}
          />
          <TextField
            label="정원"
            type="number"
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            value={editPersonnel}
            onChange={(e) => setEditPersonnel(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditModal} sx={{ color: "#333" }}>
            취소
          </Button>
          <Button variant="contained" onClick={handleUpdateMeeting} sx={{ backgroundColor: "#28a745" }}>
            수정하기
          </Button>
        </DialogActions>
      </Dialog >
    </Box >
  );
}