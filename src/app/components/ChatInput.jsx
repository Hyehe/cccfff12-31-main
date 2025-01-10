// src/components/ChatInput.jsx

import React, { useState } from "react";
import { TextField, Button, InputAdornment, IconButton } from "@mui/material";
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import Picker from 'emoji-picker-react';
import PropTypes from 'prop-types';

const ChatInput = ({ onSendMessage, connected }) => {
  const [inputValue, setInputValue] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);

  // 이모티콘 클릭 시
  const handleEmojiClick = (emojiObject) => {
    setInputValue((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  // 전송
  const handleSend = () => {
    if (!connected) return;
    onSendMessage({ content: inputValue, file: attachedFile });
    setInputValue('');
    setAttachedFile(null);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* 이모지 피커 */}
      {showEmojiPicker && (
        <div style={{ position: 'absolute', bottom: '60px', left: '20px', zIndex: 100 }}>
          <Picker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <TextField
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'green', // 기본 border 색상
            },
            '&:hover fieldset': {
              borderColor: 'darkgreen', // Hover 시 border 색상
            },
            '&.Mui-focused fieldset': {
              borderColor: 'green', // 포커스 시 border 색상
            },
          },
        }}
        fullWidth
        placeholder={connected ? "메시지를 입력하세요." : "연결 대기중..."}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={!connected} // 연결되지 않았을 때 입력 불가
        onKeyPress={(e) => {
          if (e.key === 'Enter' && connected) {
            handleSend();
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {/* 이모지 아이콘 */}
              <IconButton
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                disabled={!connected}
              >
                <EmojiEmotionsIcon color="success" />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {/* 전송 버튼을 오른쪽에 배치 */}
              <Button
                variant="contained"
                disabled={!connected}
                onClick={handleSend}
                sx={{ backgroundColor: 'green', color: '#fff' }}
              >
                전송
              </Button>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  connected: PropTypes.bool.isRequired,
};

export default ChatInput;
