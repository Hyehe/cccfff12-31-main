import axios from "axios";
import { useEffect, useState } from "react";

const useEmailVerification = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(180); // 3분 (180초)

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleVerificationCodeChange = (e) => setVerificationCode(e.target.value);

  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;

  //이메일 인증 타이머
  useEffect(() => {
    let timer;
    if (countdown > 0 && verificationSent) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      clearInterval(timer);
      setVerificationSent(180);
    }
    return () => clearInterval(timer);
  }, [countdown, verificationSent]);

  // 이메일 인증 코드 발송
  const sendVerificationCode = async () => {
    const API_URL = `${LOCAL_API_BASE_URL}/signup/sendVerificationEmail`
    if (email === "") {
      setError("이메일을 입력해주세요.");
      alert("이메일을 입력해주세요.");
      return;
    }
    if (!email.includes("@")) {
      setError("올바른 이메일 형식을 입력해주세요.");
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post(API_URL,{
        "email" : email
      });
      //성공
      if(response.data.success){
        setError("");  // 에러 초기화
        alert("이메일이 발송되었습니다.");
        setVerificationSent(true);
        setVerificationCode("");
      } else {
        setError("이메일 발송에 실패했습니다.");
        alert(error);
      }
    } catch (error) {
      setError("오류가 발생했습니다.");
      alert(error);
    }
  };

  // 인증 코드 확인
  const verifyCode = async () => {
    if (!verificationSent) {
      setError("인증 코드를 먼저 발송해주세요.");
      return;
    }

    const API_URL = `${LOCAL_API_BASE_URL}/signup/verifyEmail`
    try {
      const response = await axios.post(API_URL, {
        "email" : email,
        "verificationCode" : verificationCode
      });
      if (response.data.success) {
        setEmailVerified(true);
        alert(response.data.message);
        setError(""); // 에러 초기화
      } else {
        setError("인증 코드가 일치하지 않습니다.");
        alert("인증 코드가 일치하지 않습니다.");
      }
    } catch (err) {
      setError("서버 오류가 발생했습니다.");
      alert("서버 오류가 발생했습니다.");
    }
  };

  return {
    email,
    verificationCode,
    verificationSent,
    emailVerified,
    error,
    countdown,
    handleEmailChange,
    handleVerificationCodeChange,
    verifyCode,
    sendVerificationCode,
  };
};

export default useEmailVerification;
