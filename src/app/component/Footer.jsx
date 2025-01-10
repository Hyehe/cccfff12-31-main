import React from 'react';
import { Box, Typography } from '@mui/material';
import ForestIcon from '@mui/icons-material/Forest';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();
  
  // 경로에 '/chat'이 포함되어 있으면 푸터 제외
  // (예: '/MeetingGroup/regular-Meeting/detail/1/chat')
  if (pathname.includes('/chat')) {
    return null;
  }

  return (
    <footer style={{ backgroundColor: '#2e2f31', padding: '25px 0', textAlign: 'center',position: 'relative', }}>
      {/* 상호명과 아이콘 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '20px',
          padding: '0 20px',
        }}
      >
        {/* 왼쪽 상호명과 아이콘 */}
        <Box sx={{ display: 'flex', alignItems: 'center' , marginLeft: "30px"}}>
          <ForestIcon sx={{ fontSize: 30, color: '#ffffff'}} />
          <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
            경빈이네 캠핑
          </Typography>
        
          <Typography
            variant="body2"
            sx={{
              color: '#E4E0E1',
              marginLeft: '60px',
              marginRight: '15px',
              cursor: 'pointer',
            }}
          >
            개인정보처리방침
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#E4E0E1',
              marginRight: '15px',
              cursor: 'pointer',
            }}
          >
            이용약관
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#E4E0E1',
              marginRight: '15px',
              cursor: 'pointer',
            }}
          >
            고객센터
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#E4E0E1',
              cursor: 'pointer',
            }}
          >
            오시는길
          </Typography>
        </Box>
      </Box>

      {/* 푸터 본문 내용 */}
      <div style={{ marginBottom: '10px' }}>
        <p style={{ color: '#E7F0DC', fontSize: '12px', margin: '0' }}>
          | 경빈이네 주식회사, 대표자: 3조(mun@naver.com) 주소: 서울특별시 마포구 |
        </p>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <p style={{ color: '#E7F0DC', fontSize: '12px', margin: '0' }}>
          | 전화: 1818-9797 | 팩스: 042-526-9289 |
        </p>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <p style={{ color: '#E7F0DC', fontSize: '12px', margin: '0' }}>
          | 개인정보보호책임자: 노종문 (jsfood5@naver.com) |
        </p>
      </div>
      <div>
        <p style={{ color: '#E7F0DC', fontSize: '12px', margin: '0' }}>
          | COPYRIGHT (c) 경빈이네 주식회사 ALL RIGHTS RESERVED. |
        </p>
      </div>
    </footer>
  );
};

export default Footer;