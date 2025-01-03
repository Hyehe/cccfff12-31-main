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
    admin_type: "",
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // 기본 값 처리
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("user_idx", formData.user_idx);
    data.append("admin_type", formData.admin_type);
    try {
      const response = await fetch(
        "http://localhost:8080/api/admin/admins/insert",
        {
          method: "POST",
          body: data,
        }
      );
      if (response.ok) {
        alert("관리자 등록 성공!");
        router.push("/admin/");
      } else {
        alert("관리자 등록 실패");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      alert("등록 중 문제가 발생했습니다.");
    }
  };
  // 아이디 존재검사
  const [isIdAvailable, setIsIdAvailable] = useState(null);
  const checkIdAvailability = async () => {
    try {
      // 사용자 존재 여부 확인
      const userResponse = await fetch(
        `http://localhost:8080/api/member/members/check-idx?user_idx=${formData.user_idx}`
      );
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }
      const isUserExist = await userResponse.json(); // true: 사용자 존재, false: 사용자 없음
      // 관리자 중복 여부 확인
      const adminResponse = await fetch(
        `http://localhost:8080/api/admin/admins/check-id?user_idx=${formData.user_idx}`
      );
      if (!adminResponse.ok) {
        throw new Error("Failed to fetch admin data");
      }
      const isAdminExist = await adminResponse.json(); // true: 관리자 중복, false: 관리자 등록 가능

      // 상태 업데이트
      if (isUserExist && !isAdminExist) {
        setIsIdAvailable(true); // 사용자 존재 && 관리자로 등록되지 않음
      } else if (!isUserExist) {
        setIsIdAvailable(false); // 사용자 없음
      } else if (isAdminExist) {
        setIsIdAvailable("adminExists"); // 이미 관리자로 등록됨
      }
    } catch (error) {
      console.error("Error checking ID availability:", error);
      alert("사용자 및 관리자 상태 확인 중 오류가 발생했습니다.");
      setIsIdAvailable(null); // 오류 발생 시 상태 초기화
    }
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
        <h2>관리자 등록하기</h2>
        <Link
          href="/admin/"
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
                <TableCell width={"50%"}>관리자로 전환할 사용자 IDX</TableCell>
                <TableCell>
                  <TextField
                    name="user_idx"
                    value={formData.user_idx}
                    onChange={handleChange}
                    onBlur={checkIdAvailability} // 포커스를 잃었을 때 ID 확인
                    fullWidth
                    className="input-field"
                    required
                    type="number"
                  />
                  {isIdAvailable === true && (
                    <Typography sx={{ color: "green", fontSize: "12px" }}>
                      관리자로 등록할 수 있는 사용자입니다.
                    </Typography>
                  )}
                  {isIdAvailable === false && (
                    <Typography sx={{ color: "red", fontSize: "12px" }}>
                      해당 사용자는 존재하지 않습니다.
                    </Typography>
                  )}
                  {isIdAvailable === "adminExists" && (
                    <Typography sx={{ color: "orange", fontSize: "12px" }}>
                      해당 사용자는 이미 관리자로 등록되어 있습니다.
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>관리자 유형</TableCell>
                <TableCell>
                  <FormControl fullWidth>
                    <InputLabel>관리자 유형</InputLabel>
                    <Select
                      name="memberType"
                      value={formData.admin_type}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          admin_type: e.target.value,
                        }))
                      }
                    >
                      <MenuItem value="common">일반 관리자</MenuItem>
                      <MenuItem value="super">슈퍼 관리자</MenuItem>
                    </Select>
                  </FormControl>
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
            disabled={isIdAvailable !== true} // true가 아니면 비활성화
          >
            등록하기
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default page;
