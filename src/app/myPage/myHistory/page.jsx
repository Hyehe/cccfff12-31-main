import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';

function ReservationHistory() {
  // 예시 데이터
  const reservationData = [
    {
      campground: '해수욕장 캠핑장',
      period: '2024-12-01 ~ 2024-12-05',
      price: '120,000원',
      status: '예약',
    },
    {
      campground: '산속 캠핑장',
      period: '2024-12-10 ~ 2024-12-12',
      price: '80,000원',
      status: '장박',
    },
    {
      campground: '숲속 캠핑장',
      period: '2024-12-15 ~ 2024-12-20',
      price: '150,000원',
      status: '이용완료',
    },
  ];


  // // 후기쓰기 버튼 클릭 핸들러
  // const handleReviewClick = (campground) => {
  //   alert(`${campground}에 대한 후기를 작성할 수 있습니다.`);
  // };

  return (
    <div>
    <Typography sx={{
      fontSize : "30px",
      ml:"15px",
      textAlign: "center",
      
    }}>
      예약/이용 내역  
    </Typography>

      <TableContainer component={Paper}
        sx={{
          textAlign: "center"
        }}
      > 
        <Table sx={{ minWidth: 650 }} aria-label="예약/이용 내역 표">
          <TableHead>
            <TableRow>
              <TableCell>캠핑장 이름</TableCell>
              <TableCell align="left">이용 기간</TableCell>
              <TableCell align="left">결제 금액</TableCell>
              <TableCell align="center">상태</TableCell>
              <TableCell align="center">후기</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservationData.map((row, index) => (


              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {row.campground}
                </TableCell>
                <TableCell align="left">{row.period}</TableCell>
                <TableCell align="left">{row.price}</TableCell>
                <TableCell align="center">{row.status}</TableCell>
                <TableCell align="center">
                  {
                    row.status == "이용완료" ? <Button variant='contained'>후기작성</Button> : ""
                  }

                </TableCell>
              </TableRow>
            ))}
            {reservationData.map((row, index) => (


              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {row.campground}
                </TableCell>
                <TableCell align="left">{row.period}</TableCell>
                <TableCell align="left">{row.price}</TableCell>
                <TableCell align="center">{row.status}</TableCell>
                <TableCell align="center">
                  {
                    row.status == "이용완료" ? <Button variant='contained'>후기작성</Button> : ""
                  }

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ReservationHistory;


                  {/* {row.status === '이용완료' && (
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => handleReviewClick(row.campground)}
                    >
                      후기쓰기
                    </Button>
                  )} */} 