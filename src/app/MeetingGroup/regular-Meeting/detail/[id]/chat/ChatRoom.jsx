'use client';

import React, { useEffect, useState } from 'react';
import {Box, Typography, IconButton, Avatar, Paper, TextField, Button, InputAdornment,} from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import CallIcon from '@mui/icons-material/Call';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import Picker from 'emoji-picker-react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [nickname, setNickname] = useState('');
    const [nicknameSet, setNicknameSet] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [attachedFile, setAttachedFile] = useState(null);

    useEffect(() => {
        if (!nicknameSet) return;

        const socket = new SockJS('http://localhost:8080/ws/chat');
        const client = Stomp.over(socket);

        client.connect({}, () => {
            console.log('Connected to WebSocket');
            client.subscribe('/topic/messages', (message) => {
                const receivedMessage = JSON.parse(message.body);
                setMessages((prev) => [...prev, receivedMessage]);
            });
        }, (error) => {
            console.error('STOMP 연결 오류:', error);
        });

        setStompClient(client);

        return () => {
            if (client) client.disconnect();
        };
    }, [nicknameSet]);

    const handleSetNickname = () => {
        if (nickname.trim()) {
            setNicknameSet(true);
        }
    };

    const sendMessage = async () => {
        if (!stompClient || !stompClient.connected) {
           // console.error('STOMP 클라이언트가 연결되지 않았습니다.');
            return;
        }

        if (attachedFile) {
            // 파일 데이터를 Base64로 변환하여 전송
            const reader = new FileReader();
            reader.onload = () => {
                const fileMessage = {
                    sender: nickname,
                    content: inputValue || 'File Attached',
                    fileName: attachedFile.name,
                    fileType: attachedFile.type,
                    fileData: reader.result.split(',')[1], // Base64 인코딩된 데이터
                };
                stompClient.send('/app/message', {}, JSON.stringify(fileMessage));
                setAttachedFile(null); // 파일 상태 초기화
                setInputValue(''); // 입력창 초기화
            };
            reader.readAsDataURL(attachedFile);
        } else if (inputValue.trim()) {
            const textMessage = {
                sender: nickname,
                content: inputValue,
            };
            stompClient.send('/app/message', {}, JSON.stringify(textMessage));
            setInputValue('');
        }
    };

    const handleEmojiClick = (emojiObject) => {
        setInputValue((prev) => prev + (emojiObject?.emoji || ''));
        setShowEmojiPicker(false);
    };

    const handleFileAttach = (event) => {
        const file = event.target.files[0];
        if (file) {
            setAttachedFile(file);
            setInputValue(file.name); // 입력창에 파일 이름 표시
        }
    };

    if (!nicknameSet) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                }}
            >
                <Typography variant="h5" sx={{ marginBottom: '20px' }}>
                    Enter your nickname to join the chat
                </Typography>
                <TextField
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Enter your nickname"
                    sx={{ marginBottom: '20px', width: '300px' }}
                />
                <Button
                    variant="contained"
                    onClick={handleSetNickname}
                    sx={{ backgroundColor: '#007BFF', color: '#fff' }}
                >
                    Join Chat
                </Button>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                maxWidth: '730px',
                margin: '0 auto',
                border: '1px solid #F5F4F6',
                borderRadius: '14px',
                backgroundColor: '#fff',
            }}
        >
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
                    <Avatar src="/images/user1.png" alt="user1" />
                    <Box sx={{ marginLeft: '10px' }}>
                        <Typography variant="h6" fontWeight="bold">
                            Chat Room
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            Active Now
                        </Typography>
                    </Box>
                </Box>
                <Box>
                    <IconButton>
                        <VideocamIcon />
                    </IconButton>
                    <IconButton>
                        <CallIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </Box>
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto', padding: '15px', backgroundColor: '#FAFAFA' }}>
                {messages.map((msg, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: 'flex',
                            justifyContent:
                                msg.sender === nickname ? 'flex-end' : 'flex-start',
                            alignItems: 'center',
                            marginBottom: '10px',
                        }}
                    >
                        {msg.sender !== nickname && (
                            <Avatar
                                src="/images/user2.png"
                                alt="user2"
                                sx={{ width: 35, height: 35, marginRight: '10px' }}
                            />
                        )}
                        <Paper
                            sx={{
                                padding: '10px',
                                maxWidth: '60%',
                                borderRadius: '10px',
                                backgroundColor:
                                    msg.sender === nickname ? '#CFE9BA' : '#F5F5F5',
                                color: msg.sender === nickname ? '#000' : '#555',
                            }}
                        >
                            {msg.fileData ? (
                                <a
                                    href={`data:${msg.fileType};base64,${msg.fileData}`}
                                    download={msg.fileName}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {msg.fileName}
                                </a>
                            ) : (
                                <Typography variant="body1">{msg.content}</Typography>
                            )}
                        </Paper>
                    </Box>
                ))}
            </Box>

            <Box sx={{ padding: '10px', borderTop: '1px solid #F5F4F6' }}>
                {showEmojiPicker && (
                    <Box sx={{ position: 'absolute', bottom: '60px', left: '20px', zIndex: 100 }}>
                        <Picker onEmojiClick={handleEmojiClick} />
                    </Box>
                )}
                <TextField
                    fullWidth
                    placeholder="Type a message or attach a file"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <IconButton
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                >
                                    <EmojiEmotionsIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton component="label">
                                    <AttachFileIcon />
                                    <input
                                        type="file"
                                        hidden
                                        onChange={handleFileAttach}
                                    />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    variant="contained"
                    onClick={sendMessage}
                    sx={{ marginTop: '10px', backgroundColor: '#007BFF', color: '#fff' }}
                >
                    전송
                </Button>
            </Box>
        </Box>
    );
};

export default ChatRoom;
