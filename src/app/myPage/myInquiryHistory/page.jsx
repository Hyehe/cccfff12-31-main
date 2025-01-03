"use client"
import React, { useState } from "react";
import { Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box } from "@mui/material";
import QuestionList from "./QuestionList.jsx";


const Page = () => {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: "배송이 언제 되나요?",
      content: "배송 예정일을 알고 싶어요.",
      answer: "배송은 3일 이내에 이루어집니다.",
    },
    {
      id: 2,
      title: "상품이 잘못 왔어요.",
      content: "받은 상품이 주문한 상품과 달라요.",
      answer: "교환 절차를 안내드리겠습니다.",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: "", content: "" });

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { ...newQuestion, id: questions.length + 1, answer: "" },
    ]);
    setIsModalOpen(false);
    setNewQuestion({ title: "", content: "" });
  };

  return (
    <div className="app-container">
      <Box>
      <Typography variant="h4" gutterBottom>
        1대1 문의
      </Typography>

      {/* 질문 목록 */}
      <QuestionList questions={questions}/>

      {/* 문의하기 버튼 */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsModalOpen(true)}
        style={{ 
          position: "fixed", 
          bottom: 20, 
          right: 20,
          width: "150px",
          height: "50px",
          fontSize: '20px'
        }}
      >
        문의하기
      </Button>

      {/* 모달창 */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>문의하기</DialogTitle>
        <DialogContent>
          <TextField
            label="질문 제목"
            fullWidth

            margin="normal"
            value={newQuestion.title}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, title: e.target.value })
            }
          />
          <TextField
            label="질문 내용"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={newQuestion.content}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, content: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)} color="secondary">
            취소
          </Button>
          <Button onClick={handleAddQuestion} color="primary">
            등록하기
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </div>
  );
};

export default Page;
