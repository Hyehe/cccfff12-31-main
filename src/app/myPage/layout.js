// app/myPage/layout.js
'use client';
import React from 'react';
import { Box, Button } from '@mui/material';
import Sidebar from './components/Sidebar';
import UserInfoSidebar from './components/UserInfoSidebar'

const App = ({children}) => {
  return (
    <Box sx={{
      display: 'flex', 
      justifyContent: 'center',
      width:'100%', 
      height: '100%', 
      margin: 'auto', 
      flexGrow:1 
    }}>
      {/* 사이드바 */}
        <Sidebar/>

      {/* 메인 콘텐츠 */}
      <Box
        sx={{
          backgroundColor: '#f4f4f4',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: 'auto',
            minWidth:"1200px",
            height: 'auto',
            alignItems: 'flex-start',
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '0px 15px 15px 0px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          {children}
        </Box>
      </Box>
      <UserInfoSidebar/>
    </Box>
  );
};

export default App;
