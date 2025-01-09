'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ChatRoom from '../../../../../components/ChatRoom'; 
import useAuthStore from 'store/authStore';
import axiosInstance from '../../../../../utils/axiosInstance'; // axios + 토큰
import { getCookie } from "cookies-next"; // 쿠키에서 값 가져오는 함수
import axios from 'axios';

export default function ChatPage() {
  const token = useAuthStore((state) => state.token); // Zustand에서 token 가져오기
  const router = useRouter();
  const { id } = useParams(); // => meetingId
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL
  const [userName, setUserName] = useState("");
  const [userIdx, setUserIdx] = useState(null);
  const [chatRoom, setChatRoom] = useState(null);
  const [roomInfo, setRoomInfo] = useState(null);
  
  // 로그인된 사용자 idx
  // const userIdx = useAuthStore((state) => state.userIdx) || 1;

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      getUserIdx(token); // 토큰이 있으면 사용자 user_idx 가져오기
    }
  }, []);

  const getUserIdx = async (token) => {
    try {
      const API_URL = `${LOCAL_API_BASE_URL}/users/profile`;
      console.log("유저 정보 요청 URL:", API_URL);

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`, // JWT 토큰 사용
        },
      });

      console.log("유저 정보 응답 데이터:", response.data);

      if (response.data.success) {
        const userIdx = response.data.data.user_idx; // user_idx 추출
        const userName = response.data.data.username;
        setUserName(userName);
        setUserIdx(userIdx); // response에서 받아온 userIdx를 설정
        console.log("user_idx:", userIdx, "userName:", userName);
      }
    } catch (error) {
      console.error("유저 정보 가져오기 실패:", error.message || error);
    }
  };

  useEffect(() => {
    console.log(`id: ${id}, userIdx: ${userIdx}`);
    if (!id || !userIdx) return;

    const fetchOrCreateRoom = async () => {
      try {
        // 1) 모임 채팅방 있는지 조회
        const res = await axiosInstance.get(`/chat/room/${id}`); 
        setRoom(res.data);
        setLoading(false);
      } catch (error) {
        // 2) 없으면 404 -> create
        if (error.response && error.response.status === 404) {
          try {
            const createRes = await axiosInstance.post(`/chat/room`, {
              meeting_idx: parseInt(id),
            });
            setRoom(createRes.data);
          } catch (createErr) {
            console.error('채팅방 생성 실패:', createErr);
            setLoading(false);
          }
        } else {
          console.error('채팅방 조회 실패:', error);
          setLoading(false);
        }
        
      }
    };

    fetchOrCreateRoom();
  }, [id, userIdx]);

  useEffect(() => {
    if (!room?.room_idx) return;

    // room?.room_idx => 실제 채팅방 PK
    axiosInstance.get(`/chat/room-info/${room.room_idx}`)
      .then((res) => {
        setRoomInfo(res.data); // roomInfo 설정
      })
      .catch((err) => console.error("채팅방 정보 불러오기 실패:", err));
  }, [room?.room_idx]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!room) {
    return <div>채팅방 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div style={{ width: '100%', height: '80vh' }}>
      <ChatRoom
        roomId={room.room_idx}
        userIdx={userIdx}
        roomInfo={roomInfo}
        userName="TODO_유저이름"
        onClose={() => router.back()}
      />
    </div>
  );
}
