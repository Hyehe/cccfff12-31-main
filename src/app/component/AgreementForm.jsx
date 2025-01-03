import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Box, Checkbox, Collapse, FormControlLabel, List, ListItem, ListItemText, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useSignup from '../authentication/signUp/hooks/useSignUP';

//CommonForm에 있는 state 받아서 사용
function AgreementForm({agreed, handleAgreeChange}) {
  const [openTerms, setOpenTerms] = useState({ term1: false, term2: false });  // 약관 열기
  
  // 약관 열기/닫기 핸들러
  const toggleTerm = (term) => {
    setOpenTerms((prev) => ({ ...prev, [term]: !prev[term] }));
  };

  useEffect(() => {
    console.log(agreed)
  },[agreed])
  return (
    <div>
      {/* 약관 목록 */}
      <Box
      sx={{
        background: "#fff",
        padding: "30px 20px",
        borderRadius: "10px",
        mb: "20px",
      }}
      className="bg-black"
      >
        <Box
          sx={{
            width: "auto",
            margin: 0,
            padding: 2,
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            boxShadow: 1
          }}
        >
          <Typography variant="subtitle1">약관</Typography>
          <List>
            {/* 약관 1 */}
            <ListItem onClick={() => toggleTerm("term1")}>
              <ListItemText primary="이용약관" />
              {openTerms.term1 ? <ExpandLess /> : <ExpandMore />}

            </ListItem>
            <Collapse in={openTerms.term1} timeout="auto" unmountOnExit>
              <Box sx={{ padding: 2, backgroundColor: "#f1f1f1", borderRadius: "4px" }}>
                <Typography variant="body2">
                  이 약관은 사용자가 서비스를 이용함에 있어 필요한 조건과 규정을 담고 있습니다.
                </Typography>
              </Box>
            </Collapse> 

            {/* 약관 2 */}
            <ListItem onClick={() => toggleTerm("term2")}>
              <ListItemText primary="개인정보 처리방침" />
              {openTerms.term2 ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openTerms.term2} timeout="auto" unmountOnExit>
              <Box sx={{ padding: 2, backgroundColor: "#f1f1f1", borderRadius: "4px" }}>
                <Typography variant="body2">
                  개인정보는 안전하게 보호되며, 법적 요건에 따라 처리됩니다.
                </Typography>
              </Box>
            </Collapse>
          </List>
        </Box>

        {/* 약관 동의 */}
        <FormControlLabel
          control={<Checkbox checked={agreed} onChange={handleAgreeChange} />}
          label={<Typography variant="body2">회원가입 약관에 동의합니다.</Typography>}
          sx={{ marginTop: 2, alignSelf: "flex-start" }}
        />
      </Box> 
    </div>
  );
}

export default AgreementForm;