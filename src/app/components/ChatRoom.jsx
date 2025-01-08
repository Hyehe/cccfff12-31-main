// src/components/ChatRoom.jsx

'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Avatar, Paper, Button, Modal } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import CallIcon from '@mui/icons-material/Call';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import axios from 'axios';
import ChatInput from './ChatInput';
import PropTypes from 'prop-types';
import useAuthStore from 'store/authStore';
import axiosInstance from '../utils/axiosInstance';

const ChatRoom = ({ roomId, userIdx, userName, onClose }) => {
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "http://localhost:8080/uploads";
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);

  const token = useAuthStore((state) => state.token);

  // 첫 로딩 시 db에서 채팅 내역 불러오기
  useEffect(() => {
    if (!roomId || !token) return;

    const fetchMessages = async () => {
      try {
        const response = await axiosInstance.get(`/chat/messages/${roomId}`);
// response.data가 정말 배열인지 확인
if (Array.isArray(response.data)) {
  setMessages(response.data);
} else {
  console.error('서버에서 메시지 배열이 오지 않았습니다:', response.data);
  setMessages([]);
}

      } catch (error) {
        console.error('채팅 내역 불러오기 실패:', error);
      }
    };

    fetchMessages();
  }, [roomId, token]);

  // WebSocket 연결
  useEffect(() => {
    if (!roomId || !userIdx || !token) return;

    const socket = new SockJS('http://localhost:8080/api/ws/chat');
    const client = Stomp.over(socket);

    client.connect({ Authorization: `Bearer ${token}` }, () => {
      console.log('Connected to WebSocket');
      setConnected(true);

      // 특정 채팅방 구독, 새 메시지 실시간 수신
      client.subscribe(`/topic/chat/${roomId}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        // 새 메시지를 messages state에 추가
        setMessages((prev) => [...prev, receivedMessage]);
      });
    }, (error) => {
      console.error('STOMP 연결 오류:', error);
    });

    setStompClient(client);

    // 컴포넌트 언마운트 시 WebSocket 연결 해제
    return () => {
      if (client && client.connected) {
        client.disconnect(() => {
          console.log('Disconnected from WebSocket');
        });
      }
    };
  }, [roomId, userIdx, token]);

  // 메시지 전송
  const sendMessage = async ({ content, file }) => {
    if (!stompClient || !stompClient.connected) {
      alert('WebSocket 연결이 아직 완료되지 않았습니다.');
      return;
    }

    if (content.trim() === '' && !file) {
      alert('메시지를 입력하거나 파일을 첨부해주세요.');
      return;
    }

    let fileUrl = null;

    if (file) {
      // 파일 업로드
      const formData = new FormData();
      formData.append('file', file);

      try {
        const uploadResponse = await axios.post(`${process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL || "http://localhost:8080/api"}/upload/file`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        });

        fileUrl = uploadResponse.data.url || uploadResponse.data;
      } catch (error) {
        console.error('파일 업로드 실패:', error);
        alert('파일 업로드에 실패했습니다.');
        return;
      }
    }

    let messagePayload = {
      room_idx: roomId,
      sender_idx: userIdx,
      content: content,
      message_type: 'text',
      created_at: new Date().toISOString(),
      file_url: fileUrl,
    };

    if (file) {
      messagePayload = {
        ...messagePayload,
        content: file.name,
        message_type: 'file',
      };
    }

    stompClient.send('/app/message', {}, JSON.stringify(messagePayload));

    // 메시지 입력 초기화는 ChatInput에서 처리
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '700px',
        border: '1px solid #F5F4F6',
        borderRadius: '14px',
        backgroundColor: '#fff',
      }}
    >
      {/* 채팅방 헤더 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 15px',
          borderBottom: '1px solid #F5F4F6',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={"/images/picture4.png"} alt="user1" />  
          {/* sender_profile_image ? `${IMAGE_BASE_URL}/${sender_profile_image}` :  */}
          <Box sx={{ marginLeft: '10px' }}>
            <Typography variant="h6" fontWeight="bold">
              {`채팅방 ID: ${roomId}`}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Active Now
            </Typography>
          </Box>
        </Box>
        <Box>
          <IconButton onClick={onClose}>
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Box>

      {/* 채팅 메시지 영역 */}
      <Box sx={{ flex: 1, overflowY: 'auto', padding: '15px', backgroundColor: '#FAFAFA' }}>
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: msg.sender_idx === userIdx ? 'flex-end' : 'flex-start',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            {/* 상대방 메시지일 경우 아바타 표시 */}
            {msg.sender_idx !== userIdx && (
              <Avatar
                src={msg.sender_avatar_url ? `${IMAGE_BASE_URL}/${msg.sender_avatar_url}` : '/images/picture2.jpg'}
                alt="상대방 아바타"
                sx={{ width: 35, height: 35, marginRight: '10px' }}
              />
            )}
            <Paper
              sx={{
                padding: '10px',
                maxWidth: '60%',
                borderRadius: '10px',
                backgroundColor: msg.sender_idx === userIdx ? '#CFE9BA' : '#F5F5F5',
                color: msg.sender_idx === userIdx ? '#000' : '#555',
              }}
            >
              {msg.file_url ? (
                <a
                  href={msg.file_url}
                  download target="_blank" rel="noopener noreferrer"
                >
                  {msg.content}
                </a>
              ) : (
                <Typography variant="body1">{msg.content}</Typography>
              )}
            </Paper>
          </Box>
        ))}
      </Box>

      {/* 메시지 입력 영역 */}
      <Box sx={{ padding: '10px', borderTop: '1px solid #F5F4F6', position: 'relative' }}>
        <ChatInput onSendMessage={sendMessage} connected={connected} />
      </Box>
    </Box>
  );
};

ChatRoom.propTypes = {
  roomId: PropTypes.number.isRequired,
  userIdx: PropTypes.number.isRequired,
  userName: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ChatRoom;
