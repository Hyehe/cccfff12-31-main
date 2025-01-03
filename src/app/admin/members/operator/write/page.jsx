"use client";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function page(props) {
  const [formData, setFormData] = useState({
    user_idx: "",
    contentId: "",
    business_name: "",
    business_number: "",
    started_date: "",
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("user_idx", formData.user_idx);
    data.append("contentId", formData.contentId);
    data.append("business_name", formData.business_name);
    data.append("business_number", formData.business_number);
    data.append("started_date", formData.started_date);

    try {
      const response = await fetch(
        "http://localhost:8080/api/member/insert/operator",
        {
          method: "POST",
          body: data,
        }
      );

      if (response.ok) {
        alert("사업자 등록 성공!");
        router.push("/admin/members/view");
      } else {
        alert("사업자 등록 실패");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      alert("등록 중 문제가 발생했습니다.");
    }
  };
  // 아이디 중복검사
  const [isUserValid, setIsUserValid] = useState(null);

  const checkUserAndBusinessAvailability = async () => {
    try {
      // 1. 사용자 존재 여부 확인 (users 테이블)
      const userResponse = await fetch(
        `http://localhost:8080/api/member/members/check-idx?user_idx=${formData.user_idx}`
      );
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }
      const isUserExist = await userResponse.json(); // true: 사용자 존재, false: 사용자 없음
      // 2. 사업자 중복 여부 확인 (business 테이블)
      const businessResponse = await fetch(
        `http://localhost:8080/api/member/operators/check-user?user_idx=${formData.user_idx}`
      );
      if (!businessResponse.ok) {
        throw new Error("Failed to fetch business data");
      }
      const isBusinessExist = await businessResponse.json(); // true: 사업자 중복, false: 등록 가능
      // 상태 업데이트
      if (isUserExist && !isBusinessExist) {
        setIsUserValid(true); // 사용자 존재 && 사업자 중복 없음
      } else if (!isUserExist) {
        setIsUserValid("userNotExist"); // 사용자 없음
      } else if (isBusinessExist) {
        setIsUserValid("businessExist"); // 이미 사업자로 등록됨
      }
    } catch (error) {
      console.error("Error checking user and business availability:", error);
      alert("사용자 및 사업자 상태 확인 중 오류가 발생했습니다.");
      setIsUserValid(null); // 오류 발생 시 상태 초기화
    }
  };

  const [isCampingAvailable, setIsCampingAvailable] = useState(null);
  const checkCampingAvailability = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/camping/sites/check-contentId?contentId=${formData.contentId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const isDuplicate = await response.json(); // 백엔드에서 반환된 boolean 값을 확인
      setIsCampingAvailable(isDuplicate); // true: 존재, false: 존재하지 않음
    } catch (error) {
      console.error("Error checking ID availability:", error);
      alert("캠핑장 등록 확인 중 오류가 발생했습니다.");
      setIsCampingAvailable(null); // 오류 발생 시 상태 초기화
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    // 기본 값 처리
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <Box
      sx={{
        backgroundColor: "grey",
        minHeight: "100vh",
        padding: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          padding: "20px",
          backgroundColor: "#f9f9f9",
          borderRadius: 2,
          boxShadow: 1,
          maxWidth: "600px",
          margin: "0 auto", // 가운데 정렬
          display: "flex", // Flexbox 사용
          alignItems: "center", // 세로 방향 가운데 정렬
          flexDirection: "column", // 세로 방향 정렬
        }}
      >
        <h2>사업자 등록하기</h2>
        <Link
          href="/admin/members/view"
          passHref
          style={{ textDecoration: "none", color: "black" }}
        >
          <p>[목록으로 돌아가기]</p>
        </Link>
        <hr />
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {/* 사용자 고유 ID */}
              <TableRow>
                <TableCell width={"50%"}>사업자로 전환할 사용자 IDX</TableCell>
                <TableCell>
                  <TextField
                    name="user_idx"
                    value={formData.user_idx}
                    onChange={handleChange}
                    onBlur={checkUserAndBusinessAvailability} // 포커스를 잃었을 때 확인
                    fullWidth
                    className="input-field"
                    required
                    type="number"
                  />
                  {isUserValid === true && (
                    <Typography sx={{ color: "green", fontSize: "12px" }}>
                      등록 가능한 사용자입니다.
                    </Typography>
                  )}
                  {isUserValid === "userNotExist" && (
                    <Typography sx={{ color: "red", fontSize: "12px" }}>
                      해당 사용자는 존재하지 않습니다.
                    </Typography>
                  )}
                  {isUserValid === "businessExist" && (
                    <Typography sx={{ color: "orange", fontSize: "12px" }}>
                      해당 사용자는 이미 사업자로 등록되어 있습니다.
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
              {/* 사업체 이름 */}
              <TableRow>
                <TableCell>사업체 이름</TableCell>
                <TableCell>
                  <TextField
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    fullWidth
                    className="input-field"
                    required
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>사업자번호</TableCell>
                <TableCell>
                  <TextField
                    name="business_number"
                    value={formData.business_number}
                    onChange={handleChange}
                    fullWidth
                    className="input-field"
                    required
                  />
                </TableCell>
              </TableRow>
              {/* 사용자 이름 */}
              <TableRow>
                <TableCell>사업자의 담당 캠핑장 ID</TableCell>
                <TableCell>
                  <TextField
                    name="contentId"
                    value={formData.contentId}
                    onChange={handleChange}
                    onBlur={checkCampingAvailability}
                    fullWidth
                    className="input-field"
                    required
                    type="number"
                  />
                  {isCampingAvailable === true && (
                    <Typography sx={{ color: "green", fontSize: "12px" }}>
                      존재하는 캠핑장입니다.
                    </Typography>
                  )}
                  {isCampingAvailable === false && (
                    <Typography sx={{ color: "red", fontSize: "12px" }}>
                      해당 캠핑장은 존재하지 않습니다.
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>사업체 등록일자</TableCell>
                <TableCell>
                  <TextField
                    name="started_date"
                    value={formData.started_date}
                    onChange={handleChange}
                    fullWidth
                    className="input-field"
                    required
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Link href="/admin/members/view" passHref>
            <Button variant="outlined" sx={{ mr: 2 }}>
              취소
            </Button>
          </Link>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isUserValid !== true || isCampingAvailable !== true} // true가 아니면 비활성화
          >
            등록하기
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default page;
