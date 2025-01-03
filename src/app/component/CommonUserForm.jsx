"use client"
import React, { useEffect, useState } from 'react';
import useSignup from '../authentication/signUp/hooks/useSignUP';
import { Box, Button, Checkbox, Collapse, FormControlLabel, Grid, List, ListItem, ListItemText, Typography } from '@mui/material';
import useEmailVerification from '../authentication/signUp/hooks/useEmailVerification';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import InputForm from './InputForm';
import usePhoneVerification from '../authentication/signUp/hooks/usePhoneVerification';
import LockIcon from '@mui/icons-material/Lock';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

function CommonUserForm(props) {
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;

  return (
      <Box
        component="main"  
        sx={{
          maxWidth: "510px",
          ml: "auto",
          mr: "auto",
          padding: "50px 0 100px",
        }}
        >
        <Grid item xs={12} md={12} lg={12} xl={12}>
          <Box>
            {/* 선택된 폼 */}
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <Typography
                variant="outlined"
                sx={{ 
                  margin: '0 10px', 
                  border: '1px solid skyblue',
                  borderRadius: '10px',
                  padding: '20px',
                  minWidth: '500px'
                }}
              >
                <Box sx={{
                  display:'flex',
                  justifyContent: "space-between"
                }}>
                  <Typography
                    sx={{
                      fontSize: "20px",
                      fontWeight: 'bold'
                    }}>
                    <LockIcon
                      sx={{
                        fontSize: '20px',

                      }}
                    />
                    비밀번호 변경
                  </Typography>
                  <KeyboardArrowRightIcon 
                    sx={{
                      
                    }}
                  />
                  <></>


                </Box>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Box>
  );
}

export default CommonUserForm;