'use client';

import {
  Box,
  Typography,
  TextField,
  Button,
  FormHelperText,
} from '@mui/material';
import { useState, useEffect } from 'react';

export default function LightningMeetingCreatePage() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  // 유효성 검사 함수
  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = '필수 입력입니다.';
    if (!location.trim()) newErrors.location = '필수 입력입니다.';
    if (!date) newErrors.date = '필수 입력입니다.';
    if (!description.trim()) newErrors.description = '필수 입력입니다.';
    if (!capacity || capacity <= 0) newErrors.capacity = '1 이상의 숫자를 입력해주세요.';
    setErrors(newErrors);
    setIsSubmitDisabled(Object.keys(newErrors).length > 0);
  };

  // 유효성 검사 연결
  useEffect(() => {
    validateForm();
  }, [title, location, date, description, capacity]);

  // 작성 버튼 클릭 핸들러
  const handleSubmit = () => {
    validateForm();

    if (!isSubmitDisabled) {
      const newMeeting = {
        title,
        location,
        date,
        description,
        capacity,
      };

      console.log('새로운 번개 모임:', newMeeting);

      // localStorage 저장 로직 (옵션)
      const savedMeetings = JSON.parse(localStorage.getItem('lightningMeetings')) || [];
      localStorage.setItem('lightningMeetings', JSON.stringify([...savedMeetings, newMeeting]));

      alert('새로운 번개 모임이 작성되었습니다.');
    }
  };

  const handleCancel = () => {
    // 취소 시 초기화
    setTitle('');
    setLocation('');
    setDate('');
    setDescription('');
    setCapacity('');
  };

  return (
    <Box
      sx={{
        padding: '20px',
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto',
        paddingTop: '80px',
      }}
    >
      {/* 페이지 제목 */}
      <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '30px' }}>
        번개 모임 만들기
      </Typography>

      {/* 모임 제목 */}
      <TextField
        fullWidth
        label="모임 제목"
        variant="outlined"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={!!errors.title}
        helperText={errors.title}
        sx={{
          marginBottom: '20px',
          '& .MuiOutlinedInput-root.Mui-error fieldset': {
            borderColor: 'black', // 테두리 검정색
          },
          '& .MuiFormHelperText-root.Mui-error': {
            color: 'green', // 오류 메시지 초록색
          },
          '& .MuiFormLabel-root.Mui-error': {
            color: 'black', // 라벨(placeholder)의 색상을 검정으로 설정
          },
        }}
      />

      {/* 캠핑 장소 */}
      <TextField
        fullWidth
        label="캠핑 장소"
        variant="outlined"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        error={!!errors.location}
        helperText={errors.location}
        sx={{
          marginBottom: '20px',
          '& .MuiOutlinedInput-root.Mui-error fieldset': {
            borderColor: 'black',
          },
          '& .MuiFormHelperText-root.Mui-error': {
            color: 'green',
          },
          '& .MuiFormLabel-root.Mui-error': {
            color: 'black', // 라벨(placeholder)의 색상을 검정으로 설정
          },
        }}
      />

      {/* 날짜 선택 */}
      <TextField
        fullWidth
        label="날짜 선택"
        type="date"
        variant="outlined"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        error={!!errors.date}
        helperText={errors.date}
        sx={{
          marginBottom: '20px',
          '& .MuiOutlinedInput-root.Mui-error fieldset': {
            borderColor: 'black',
          },
          '& .MuiFormHelperText-root.Mui-error': {
            color: 'green',
          },
          '& .MuiInputBase-input': {
            padding: '10px',
          },
          '& .MuiFormLabel-root.Mui-error': {
            color: 'black', // 라벨(placeholder)의 색상을 검정으로 설정
          },
        }}
        InputLabelProps={{
          shrink: true,
        }}
      />

      {/* 간단한 설명 */}
      <TextField
        fullWidth
        label="간단한 설명"
        multiline
        rows={10}
        variant="outlined"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={!!errors.description}
        helperText={errors.description}
        sx={{
          marginBottom: '20px',
          '& .MuiOutlinedInput-root.Mui-error fieldset': {
            borderColor: 'black',
          },
          '& .MuiFormHelperText-root.Mui-error': {
            color: 'green',
          },
          '& .MuiFormLabel-root.Mui-error': {
            color: 'black', // 라벨(placeholder)의 색상을 검정으로 설정
          },
        }}
      />

      {/* 정원 */}
      <TextField
        fullWidth
        label="정원"
        type="number"
        variant="outlined"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
        error={!!errors.capacity}
        helperText={errors.capacity}
        sx={{
          marginBottom: '30px',
          '& .MuiOutlinedInput-root.Mui-error fieldset': {
            borderColor: 'black',
          },
          '& .MuiFormLabel-root.Mui-error': {
            color: 'black', // 라벨(placeholder)의 색상을 검정으로 설정
          },
          '& .MuiFormHelperText-root.Mui-error': {
            color: 'green',
          },
        }}
      />

      {/* 버튼 그룹 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          style={{ backgroundColor: '#79c75f' }}
          disabled={isSubmitDisabled} // 버튼 비활성화 조건
          href="/MeetingGroup/lightning-Meeting"
        >
          작성
        </Button><span />

        <Button
          variant="outlined"
          sx={{
            color: 'green', // 텍스트 색상
            borderColor: 'green', // 테두리 색상
            '&:hover': {
              borderColor: 'darkgreen', // 호버 시 테두리 색상
              backgroundColor: 'rgba(0, 128, 0, 0.1)', // 호버 시 배경색
            },
          }}
          onClick={handleCancel} href="/MeetingGroup/lightning-Meeting"
        >
          취소
        </Button>
      </Box>
    </Box>
  );
}
