"use client";

import React, { useState, useEffect, use } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/navigation"; // 라우터 사용
import Link from "next/link";
import { fetchMeetingDetail } from "../../fetchMeetingDetail/page";

export default function CampingDetail({ params }) {
  const { post_idx } = use(params); // URL에서 전달된 id 값
  const [data, setData] = useState(null); // 캠핑장 데이터
  const [error, setError] = useState(null); // 에러 상태
  const router = useRouter();

  // 화면 크기 체크 (1000px 이하에서 텍스트 숨기기)
  const isSmallScreen = useMediaQuery("(max-width:1000px)");

  useEffect(() => {
    // 데이터를 가져오는 함수
    const fetchData = async () => {
      try {
        const meetings = await fetchMeetingDetail(post_idx);
        if (!meetings) {
          throw new Error("데이터를 찾을 수 없습니다.");
        }
        setData(meetings);
      } catch (meetings) {
        console.error("Error fetching data:", error);
        setError(error.message || "데이터를 가져오는 데 실패했습니다.");
      }
    };
    if (post_idx) {
      fetchData();
    }
  }, [post_idx]); // id가 변경되면 데이터 다시 가져오기
  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    meeting_location: "",
    meeting_date: "",
    personnel: "",
  });

  const handleSubmit = async () => {
    // contentId가 고정값으로 사용됨
    const post_idx = data.post_idx;
    if (!post_idx) {
      alert("post_idx 설정되지 않았습니다.");
      return;
    }
    const url = `http://localhost:8080/api/meeting/meetings/update/${post_idx}`;
    const formdata = new FormData();
    // 모든 데이터를 FormData로 변환 (빈 값은 추가하지 않음)
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== "" && value !== undefined && value !== null) {
        formdata.append(key, value);
      }
    });
    // FormData 확인용 출력
    console.log("전송할 FormData:");
    formdata.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    try {
      const response = await fetch(url, {
        method: "POST",
        body: formdata, // FormData 전송
      });
      if (response.ok) {
        alert("모임 정보가 성공적으로 업데이트되었습니다.");
        router.push("/admin/events/lightning/view");
      } else {
        const error = await response.text();
        alert(`업데이트 실패: ${error}`);
      }
    } catch (err) {
      console.error("업데이트 중 오류 발생:", err);
      alert("업데이트 중 오류가 발생했습니다.");
    }
  };
  return (
    <div>
      <Box
        sx={{
          padding: "80px 40px 40px 40px",
          backgroundColor: "grey",
          color: "black",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "5px",
            width: "600px",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              marginTop: "20px",
              marginBottom: "20px",
              fontWeight: "bold",
              fontSize: "28px",
              color: "#333",
            }}
          >
            번개 모임 수정
          </Typography>
          <Link
            href="/admin/events/lightning/view"
            passHref
            style={{ textDecoration: "none", color: "black" }}
          >
            <p>[목록으로 돌아가기]</p>
          </Link>
          <hr></hr>
          {data ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between", // 좌우로 정렬
                  gap: "10px", // 두 테이블 간 간격
                  flexWrap: "wrap", // 화면이 좁아질 경우 테이블이 아래로 내려감
                }}
              >
                {/* 밑에 테이블 */}
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>IDX</TableCell>
                        <TableCell>{data.post_idx}</TableCell>
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell
                          className="custom-table-cell-title"
                          sx={{ width: "30%" }}
                        >
                          작성자
                        </TableCell>
                        <TableCell>{data.username}</TableCell>
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell
                          className="custom-table-cell-title"
                          sx={{ width: "30%" }}
                        >
                          제목
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.title}
                            value={formData.title || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                title: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell
                          className="custom-table-cell-title"
                          sx={{ width: "30%" }}
                        >
                          내용
                        </TableCell>
                        <TableCell>
                          <textarea
                            rows={6}
                            placeholder={data.content}
                            value={formData.content || ""} // value에 content 연결
                            style={{
                              width: "100%", // 가로 크기를 부모 요소에 맞춤
                              resize: "none",
                              fontSize: "14px",
                            }}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                content: e.target.value, // content를 업데이트
                              })
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell
                          className="custom-table-cell-title"
                          sx={{ width: "30%" }}
                        >
                          모임일자
                        </TableCell>
                        <TableCell>
                          <input
                            type="date"
                            name="meeting_date"
                            value={formData.meeting_date || ""} // value 연결
                            style={{
                              width: "95%", // 가로 크기
                              padding: "8px", // 내부 여백
                              fontSize: "14px", // 글자 크기
                              border: "1px solid #ddd", // 테두리
                              borderRadius: "5px", // 둥근 모서리
                            }}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                meeting_date: e.target.value, // meeting_date 업데이트
                              })
                            }
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell-title">
                          모임장소
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.meeting_location}
                            value={formData.meeting_location || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                meeting_location: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell-title">
                          모임인원
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            placeholder={data.personnel}
                            type="number"
                            value={formData.personnel || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                personnel: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="custom-table-row">
                        <TableCell className="custom-table-cell-title">
                          등록일자
                        </TableCell>
                        {data.created_at ? (
                          <TableCell>{data.created_at}</TableCell>
                        ) : (
                          <TableCell className="custom-table-cell">
                            정보없음
                          </TableCell>
                        )}
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box display="flex" justifyContent="flex-end" width={"100%"}>
                  <Link href="/admin/events/lightning/view" passHref>
                    <Button variant="outlined" sx={{ mr: 2 }}>
                      취소
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                  >
                    수정완료
                  </Button>
                </Box>
              </Box>
            </>
          ) : (
            <p>데이터 없음</p>
          )}
        </Box>
      </Box>
    </div>
  );
}
