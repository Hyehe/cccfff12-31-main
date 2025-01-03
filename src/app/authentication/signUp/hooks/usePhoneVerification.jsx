import axios from 'axios';
import React, { useState } from 'react';

function usePhoneVerification(props) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSended, setOtpSended] = useState(false);
  // const [serverOtp, setServerOtp] = useState(null);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;

  const handlePhoneChange = (e) => setPhone(e.target.value);
  const handleOtpChange = (e) => setOtp(e.target.value);

  // 인증번호 발송
  const sendOtp = async () => {
    try {
      const response = await axios.post(`${LOCAL_API_BASE_URL}/sms/send-otp`, {phone});
      console.log(response);
      // alert("인증번호가 발송되었습니다.");alert(response.ok);
      if(response.data.success){
        setOtpSended(true);
        alert(response.data.message);
      } else{
        setOtpSended(false);
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("인증번호 발송에 실패하였습니다.");
    }
  }

  // 인증번호 인증
  // const verifyOtp = () => {
  //   if (otp === serverOtp) {
  //     alert("Phone number verified!");
  //   } else {
  //     alert("Invalid OTP");
  //   }
  // };
  const verifyOtp = async () => {
    try {
      const response = await axios.post(`${LOCAL_API_BASE_URL}/sms/verify-otp`, {phone, otp});
      console.log(response);
      
      if(response.data.success){
        setPhoneVerified(true);
        alert(response.data.message);
        
      } else {
        setPhoneVerified(false);
        alert(response.data.message);
      }

    } catch (error) {
      console.error(error);
    }
  };
 
  return {
    phone,
    otp,
    phoneVerified,
    otpSended,
    handlePhoneChange,
    handleOtpChange,
    sendOtp,
    verifyOtp,
  }

}


export default usePhoneVerification;