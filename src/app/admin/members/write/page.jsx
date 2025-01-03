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

function page() {
  const [formData, setFormData] = useState({
    id: "",
    username: "",
    password: "",
    email: "",
    phone: "",
    address: "",
    type: "",
  });
  const [tel, setTel] = useState({ first: "", middle: "", last: "" });
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullPhoneNumber = `${tel.first}-${tel.middle}-${tel.last}`;
    const data = new FormData();
    data.append("id", formData.id);
    data.append("username", formData.username);
    data.append("password", formData.password);
    data.append("email", formData.email);
    data.append("address", formData.address);
    data.append("type", formData.type);
    data.append("phone", fullPhoneNumber);

    try {
      const response = await fetch("http://localhost:8080/api/member/insert", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        alert("회원 등록 성공!");
        router.push("/admin/members/view");
      } else {
        alert("회원 등록 실패");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      alert("등록 중 문제가 발생했습니다.");
    }
  };
  // 아이디 중복검사
  const [isIdAvailable, setIsIdAvailable] = useState(null);
  const checkIdAvailability = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/member/members/check-id?id=${formData.id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const isDuplicate = await response.json(); // 백엔드에서 반환된 boolean 값을 확인
      // 중복 여부에 따라 상태 설정
      if (isDuplicate) {
        setIsIdAvailable(false); // 중복 (사용 불가)
      } else {
        setIsIdAvailable(true); // 사용 가능
      }
    } catch (error) {
      console.error("Error checking ID availability:", error);
      alert("아이디 중복 확인 중 오류가 발생했습니다.");
      setIsIdAvailable(null); // 오류 발생 시 상태 초기화
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      name === "phoneFirst" ||
      name === "phoneMiddle" ||
      name === "phoneLast"
    ) {
      // 전화번호 처리
      setTel((prevTel) => ({
        ...prevTel,
        [name.replace("phone", "").toLowerCase()]: value, // 키 이름 수정
      }));
    } else {
      // 기본 값 처리
      setFormData((prevData) => ({ ...prevData, [name]: value }));
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
        <h2>회원 등록하기</h2>
        <Link
          href="/admin/members/view"
          passHref
          style={{ textDecoration: "none", color: "black" }}
        >
          <p>[목록으로 돌아가기]</p>
        </Link>
        <hr></hr>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {/* 사용자 고유 ID */}
              <TableRow>
                <TableCell width={"30%"}>사용자 ID</TableCell>
                <TableCell>
                  <TextField
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    onBlur={checkIdAvailability} // 포커스를 잃었을 때 중복 체크
                    fullWidth
                    className="input-field"
                    required
                    type="number"
                  />
                  {isIdAvailable === true && (
                    <Typography sx={{ color: "green", fontSize: "12px" }}>
                      사용 가능한 아이디입니다.
                    </Typography>
                  )}
                  {isIdAvailable === false && (
                    <Typography sx={{ color: "red", fontSize: "12px" }}>
                      이미 사용 중인 아이디입니다.
                    </Typography>
                  )}
                </TableCell>
              </TableRow>

              {/* 사용자 이름 */}
              <TableRow>
                <TableCell>사용자 이름</TableCell>
                <TableCell>
                  <TextField
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    fullWidth
                    className="input-field"
                    required
                  />
                </TableCell>
              </TableRow>
              {/* 비밀번호 */}
              <TableRow>
                <TableCell>비밀번호</TableCell>
                <TableCell>
                  <TextField
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type="password"
                    fullWidth
                    className="input-field"
                    required
                  />
                </TableCell>
              </TableRow>

              {/* 이메일 */}
              <TableRow>
                <TableCell>이메일</TableCell>
                <TableCell>
                  <TextField
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    fullWidth
                    className="input-field"
                    required
                  />
                </TableCell>
              </TableRow>

              {/* 연락처 */}
              <TableRow>
                <TableCell>연락처</TableCell>
                <TableCell>
                  <Box display="flex" gap={2}>
                    <TextField
                      name="phoneFirst"
                      value={tel.first}
                      onChange={handleChange}
                      sx={{ width: "30%" }}
                      type="number"
                    />
                    <Typography sx={{ mx: 1 }}>-</Typography>
                    <TextField
                      name="phoneMiddle"
                      value={tel.middle}
                      onChange={handleChange}
                      sx={{ width: "30%" }}
                      type="number"
                    />
                    <Typography sx={{ mx: 1 }}>-</Typography>
                    <TextField
                      name="phoneLast"
                      value={tel.last}
                      onChange={handleChange}
                      sx={{ width: "30%" }}
                      type="number"
                    />
                  </Box>
                </TableCell>
              </TableRow>

              {/* 주소 */}
              <TableRow>
                <TableCell>주소</TableCell>
                <TableCell>
                  <TextField
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    fullWidth
                    className="input-field"
                    required
                  />
                </TableCell>
              </TableRow>

              {/* 회원 종류 */}
              <TableRow>
                <TableCell>회원 종류</TableCell>
                <TableCell>
                  <FormControl fullWidth>
                    <InputLabel>회원 종류</InputLabel>
                    <Select
                      name="memberType"
                      value={formData.type}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                    >
                      <MenuItem value="general">일반 사용자</MenuItem>
                      <MenuItem value="business">사업자</MenuItem>
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
            disabled={!isIdAvailable} // 아이디 사용 불가능 시 비활성화
          >
            등록하기
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default page;
