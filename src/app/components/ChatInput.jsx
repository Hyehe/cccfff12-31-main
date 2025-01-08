// src/components/ChatInput.jsx

import React, { useState } from "react";
import { TextField, Button, InputAdornment, IconButton } from "@mui/material";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import Picker from 'emoji-picker-react';
import PropTypes from 'prop-types';
import { connected } from "process";

const ChatInput = ({ onSendMessage, connected }) => {
  const [inputValue, setInputValue] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);

  const handleEmojiClick = (emojiObject) => {
    setInputValue(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileAttach = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAttachedFile(file);
      setInputValue(file.name);
    }
  };

  const handleSend = () => {
    onSendMessage({ content: inputValue, file: attachedFile });
    setInputValue('');
    setAttachedFile(null);
  };

  return (
    <div style={{position: 'relative'}}>
      {showEmojiPicker && (
        <div style={{ position: 'absolute', bottom: '60px', left: '20px', zIndex: 100 }}>
          <Picker onEmojiClick={handleEmojiClick} />
        </div>
      )}
      <TextField
        fullWidth
        placeholder={connected ? "메시지를 입력하세요..." : "연결 대기중..."}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={!connected} // 연결되지 않았을 때 입력 불가
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)} disabled={!connected}>
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
        onKeyPress={(e) => {
          if (e.key === 'Enter' && connected) {
            handleSend();
          }
        }}
      />
      <Button
        variant="contained"
        onClick={handleSend}
        disabled={!connected}
        sx={{ marginTop: '10px', backgroundColor: '#007BFF', color: '#fff' }}
      >
        전송
      </Button>
    </div>
  );
};

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  connected: PropTypes.bool.isRequired,
};

export default ChatInput;
