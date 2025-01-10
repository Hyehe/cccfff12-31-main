'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Paper,
  useMediaQuery,
  TextField,
} from '@mui/material';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import axios from 'axios';
import ChatInput from './ChatInput';
import PropTypes from 'prop-types';
import useAuthStore from 'store/authStore';
import axiosInstance from '../utils/axiosInstance';
import SvgIcon from '@mui/material/SvgIcon';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

/* 날짜/시간 포맷 유틸 */
// (1) 날짜 (ex. 2024년 2월 3일)
function formatDate(dateStr) {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${year}년 ${month}월 ${day}일`;
}

// (2) 시간 (ex. 오전 10:05)
function formatTime(dateStr) {
  const d = new Date(dateStr);
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const suffix = hours >= 12 ? '오후' : '오전';
  if (hours > 12) hours -= 12;
  return `${suffix} ${hours}:${minutes}`;
}

/* 검색 하이라이트 */
function findAllMatches(content, searchTerm) {
  if (!searchTerm || !searchTerm) return [];
  const result = [];
  const lowerContent = content.toLowerCase();
  const lowerSearch = searchTerm.toLowerCase();

  let startPos = 0;
  while (true) {
    const found = lowerContent.indexOf(lowerSearch, startPos);
    if (found === -1) break;

    result.push({ start: found, end: found + lowerSearch.length });
    startPos = found + searchTerm.length;
  }
  return result;
}

function highlightTerm(content, matches, currentMatch) {
  if (!matches || matches.length === 0) return content;

  const elements = [];
  let lastIndex = 0;

  matches.forEach((m, idx) => {
    // 하이라이트 전 구간
    if (lastIndex < m.start) {
      elements.push(content.slice(lastIndex, m.start));
    }
    // 매치 구간
    const matchedStr = content.slice(m.start, m.end);
    const style = (idx === currentMatch)
      ? { backgroundColor: 'yellow' }
      : { backgroundColor: 'lightgray' };

    elements.push(
      <span key={idx} style={style}>
        {matchedStr}
      </span>
    );
    lastIndex = m.end;
  });

  // 나머지
  if (lastIndex < content.length) {
    elements.push(content.slice(lastIndex));
  }
  return elements;
}

// HomeIcon 정의 (뒤로가기/메인 등)
function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

const ChatRoom = ({ roomId, userIdx, userName, onClose }) => {
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "http://localhost:8080/uploads";
  
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);

  const token = useAuthStore((state) => state.token);

  // 검색 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [matchedRanges, setMatchedRanges] = useState([]);
  const [flattenedMatches, setFlattenedMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // 스크롤
  const messagesEndRef = useRef(null);
  const messageRefs = useRef({});
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  /* 1) 채팅 내역 불러오기 */
  useEffect(() => {
    if (!roomId || !token) return;
    (async () => {
      try {
        const res = await axiosInstance.get(`/chat/messages/${roomId}`);
        if (Array.isArray(res.data)) {
          setMessages(res.data);
        } else {
          console.error('서버에서 메시지 배열이 오지 않았습니다:', res.data);
          setMessages([]);
        }
      } catch (err) {
        console.error('채팅 내역 불러오기 실패:', err);
      }
    })();
  }, [roomId, token]);

  /* 2) WebSocket 연결 */
  useEffect(() => {
    if (!roomId || !userIdx || !token) return;

    const socket = new SockJS('http://localhost:8080/api/ws/chat');
    const client = Stomp.over(socket);

    client.connect({ Authorization: `Bearer ${token}` }, () => {
      setConnected(true);
      // 채팅방 구독
      client.subscribe(`/topic/chat/${roomId}`, (frame) => {
        const newMsg = JSON.parse(frame.body);
        // 중복 방지
        setMessages((prev) => {
          if (prev.some(m => m.message_idx === newMsg.message_idx)) return prev;
          return [...prev, newMsg];
        });
      });
    }, (err) => {
      console.error('STOMP 연결 오류:', err);
    });

    setStompClient(client);

    return () => {
      if (client && client.connected) {
        client.disconnect(() => console.log('Disconnected WebSocket'));
      }
    };
  }, [roomId, userIdx, token]);

  /* 3) 메시지 갱신 시 자동 스크롤 */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  /* 4) 메시지 전송 */
  const sendMessage = async ({ content, file }) => {
    if (!stompClient || !stompClient.connected) {
      alert('WebSocket 연결이 아직 완료되지 않았습니다.');
      return;
    }
    if (!content.trim() && !file) {
      alert('메시지를 입력하거나 파일을 첨부해주세요.');
      return;
    }
    // (파일 업로드 등은 필요 시 작성)
    const messagePayload = {
      room_idx: roomId,
      sender_idx: userIdx,
      // userName은 DB 저장 시 필요하다면 백엔드에서 처리
      content: content,
      message_type: file ? 'file' : 'text',
      created_at: new Date().toISOString(),
      file_url: null,
    };
    // stomp 전송
    stompClient.send('/app/message', {}, JSON.stringify(messagePayload));
  };

  /* 5) 검색 로직 */
  useEffect(() => {
    if (!searchTerm.trim()) {
      setMatchedRanges([]);
      setFlattenedMatches([]);
      setCurrentMatchIndex(0);
      return;
    }
    // 메시지별 매치
    const newMatched = messages.map((msg) => findAllMatches(msg.content || '', searchTerm));
    setMatchedRanges(newMatched);

    // flatten
    const temp = [];
    newMatched.forEach((ranges, msgIdx) => {
      ranges.forEach((_, matchIdxInMsg) => {
        temp.push({ msgIdx, matchIdxInMsg });
      });
    });
    // 과거→최신 => reverse
    temp.sort((a, b) => a.msgIdx - b.msgIdx).reverse();
    setFlattenedMatches(temp);
    setCurrentMatchIndex(0);
  }, [searchTerm, messages]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setMatchedRanges([]);
      setFlattenedMatches([]);
      setCurrentMatchIndex(0);
      return;
    }
    scrollToMatch(0);
  };
  const handlePrevMatch = () => {
    if (!flattenedMatches.length) return;
    let newIndex = currentMatchIndex + 1;
    if (newIndex >= flattenedMatches.length) newIndex = 0;
    setCurrentMatchIndex(newIndex);
    scrollToMatch(newIndex);
  };
  const handleNextMatch = () => {
    if (!flattenedMatches.length) return;
    let newIndex = currentMatchIndex - 1;
    if (newIndex < 0) newIndex = flattenedMatches.length - 1;
    setCurrentMatchIndex(newIndex);
    scrollToMatch(newIndex);
  };
  const scrollToMatch = (idx) => {
    if (idx < 0 || idx >= flattenedMatches.length) return;
    const { msgIdx } = flattenedMatches[idx];
    const el = messageRefs.current[msgIdx];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  /* ============================
     6) 최종 렌더 with 날짜 구분
  =============================*/
  // 날짜 구분을 위해 messages를 순회하며
  // => [ {type:'date', date:'2024년 2월 3일'}, {type:'msg', data: messageObj}, ... ] 형태로 변환
  let lastDateLabel = '';
  const chatItems = [];
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    // 6-1) 날짜 구분 확인
    const dateLabel = formatDate(msg.created_at);
    if (dateLabel !== lastDateLabel) {
      lastDateLabel = dateLabel;
      chatItems.push({
        type: 'date',
        date: dateLabel,
      });
    }
    // 6-2) 메시지
    chatItems.push({
      type: 'msg',
      data: msg,
      index: i, // messages 배열에서의 index
    });
  }

  // 실제 JSX로 변환 (date item / msg item)
  const renderItems = chatItems.map((item, idx) => {
    if (item.type === 'date') {
      return (
        <Box key={`date-${idx}`} sx={{ textAlign: 'center', my: 2 }}>
          <Typography variant="body2" sx={{ color: '#888' }}>
            ---- {item.date} ----
          </Typography>
        </Box>
      );
    } else {
      // 메시지
      const { data: msg, index: msgIndex } = item;
      const isMine = Number(userIdx) === msg.sender_idx;

      /* 검색한 매치 하이라이트 */
      const ranges = matchedRanges[msgIndex] || [];
      ranges.sort((a, b) => a.start - b.start);

      let currentMatchInThisMessage = null;
      const currentObj = flattenedMatches[currentMatchIndex];
      if (currentObj && currentObj.msgIdx === msgIndex) {
        currentMatchInThisMessage = currentObj.matchIdxInMsg;
      }
      const highlighted = highlightTerm(msg.content || '', ranges, currentMatchInThisMessage);

      /* 보낸 시각 & 보낸 사람 */
      const timeStr = formatTime(msg.created_at);
      const senderName = (isMine ? '' : (msg.sender_nickname || '상대'));

      return (
        <Box
          key={`msg-${msgIndex}`}
          ref={(el) => (messageRefs.current[msgIndex] = el)}
          sx={{
            display: 'flex',
            justifyContent: isMine ? 'flex-end' : 'flex-start',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          {/* 상대방 아바타 */}
          {!isMine && (
            <Avatar
              src={msg.sender_avatar_url
                ? `${IMAGE_BASE_URL}/${msg.sender_avatar_url}`
                : '/images/picture2.jpg'
              }
              alt="상대방 아바타"
              sx={{ width: 35, height: 35, marginRight: '10px', marginTop: '-50px',  }}
            />
          )}
             <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isMine ? 'flex-end' : 'flex-start',
        }}>
          {/* 프로필 옆에 표시될 유저명 (내가 보낸 메시지는 생략) */}
          {!isMine && (
            <Typography variant="subtitle2" sx={{ color: '#222', mb: '2px' }}>
              {senderName}
            </Typography>
          )}

          {/* 말풍선 */}
          <Paper
            sx={{
              padding: '10px',
              margin: '0 7px',
              maxWidth: '220px',       
              borderRadius: '10px',
              backgroundColor: isMine ? '#CFE9BA' : '#F5F5F5',
              color: isMine ? '#000' : '#555',
            }}
          >
            <Typography variant="body1" component="div">
              {highlighted /* 검색 하이라이트된 메시지 */}
            </Typography>
          </Paper>

          {/* 말풍선 아래쪽 오른쪽(또는 왼쪽)에 시간 */}
          <Typography
            variant="caption"
            sx={{
              margin: '0 10px',
              alignSelf: isMine ? 'flex-end' : 'flex-start',
              color: '#999',
              mt: '2px',
            }}
          >
            {timeStr}
          </Typography>
        </Box>

        {/* 내가 보낸 메시지일 때 오른쪽 아바타 */}
        {isMine && (
          <Avatar
            src={
              msg.sender_avatar_url
                ? `${IMAGE_BASE_URL}/${msg.sender_avatar_url}`
                : '/images/picture2.jpg'
            }
            alt="내 프로필"
            sx={{ width: 35, height: 35, marginTop: '-25px', }}
          />
        )}
      </Box>
    );
  }
});

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f2f5',  // 전체 배경
        padding: '20px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: isSmallScreen ? '95%' : '700px',
          height: '90vh',
          border: '1px solid #F5F4F6',
          borderRadius: '14px',
          backgroundColor: '#fff',
          boxShadow: 2,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* 상단부: 검색 등 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px 15px',
            borderBottom: '1px solid #F5F4F6',
            justifyContent: 'space-between',
            border: '1px solid #F5F4F6',
            borderRadius: '14px',
            backgroundColor: '#fff',
          }}
        >
          {/* 검색창 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              size="small"
              placeholder="메시지 검색"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#9ed9a1' },
                  '&:hover fieldset': { borderColor: 'green' },
                  '&.Mui-focused fieldset': { borderColor: 'green' },
                },
              }}
            />
            <IconButton onClick={handleSearch} sx={{ color: '#9ed9a1' }}>
              <SearchIcon />
            </IconButton>
            {/* 위/아래 화살표 */}
            <IconButton onClick={handlePrevMatch} sx={{ color: '#9ed9a1' }} disabled={flattenedMatches.length === 0}>
              <ArrowUpwardIcon />
            </IconButton>
            <IconButton onClick={handleNextMatch} sx={{ color: '#9ed9a1' }} disabled={flattenedMatches.length === 0}>
              <ArrowDownwardIcon />
            </IconButton>
            {/* 현재/전체 매치 */}
            <Typography variant="body2" sx={{ color: '#9ed9a1' }}>
              {flattenedMatches.length > 0
                ? `${currentMatchIndex + 1} / ${flattenedMatches.length}`
                : `0 / 0`
              }
            </Typography>
          </Box>

          {/* 뒤로가기 등 */}
          <Box>
            <IconButton onClick={onClose}>
              <HomeIcon color="success" />
            </IconButton>
          </Box>
        </Box>

        {/* 실제 채팅부분 */}
        <Box sx={{ flex: 1, overflowY: 'auto', padding: '15px', backgroundColor: '#FAFAFA' }}>
          {renderItems}
          <div ref={messagesEndRef} />
        </Box>

        {/* 메시지 입력영역 */}
        <Box sx={{ padding: '10px', borderTop: '1px solid #F5F4F6', position: 'relative' }}>
          <ChatInput onSendMessage={sendMessage} connected={connected} />
        </Box>
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
