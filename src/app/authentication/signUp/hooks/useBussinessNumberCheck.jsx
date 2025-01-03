import axios from 'axios';
import React, { useState } from 'react';

const useBussinessNumberCheck = () =>{
  const [businessNumber, setBusinessNumber] = useState('');
  const [startedDate,setStartedDate] = useState('');
  const [ceoName, setCeoName] = useState('');
  const [businessInfo, setBusinessInfo] = useState('');
  const [validated, setValidated] = useState(false);
  const [message, setMessage] = useState(false);
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_BUSINESS_URL;
  const LOCAL_API_SERVICE_KEY = process.env.NEXT_PUBLIC__BUSINESS_API_SERVICE_KEY

  const API_URL = `${LOCAL_API_BASE_URL}/validate?serviceKey=${LOCAL_API_SERVICE_KEY}`;


  const handleBusinessNumberChange = (e) => setBusinessNumber(e.target.value); 
  const handleCeoNameChange = (e) => setCeoName(e.target.value);
  const handleStartedDateChange = (e) => setStartedDate(e.target.value);


  const handleValidate = async () => {

    if (businessNumber === '') {
      alert('사업자등록번호를 입력해주세요.');
      return;
    }
    if (ceoName === '') {
      alert('사업자명을 입력해주세요.');
      return;
    }
    if (startedDate === '') {
      alert('개업일자를 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post(API_URL, {
        businesses: [
          {
            b_no: businessNumber,
            start_dt: startedDate,
            p_nm: ceoName,
            p_nm2: "",
            b_nm: "",
            corp_no: "",
            b_sector: "",
            b_type: "",
            b_adr: ""
          }
        ]
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
    
      const data = response.data;
      setBusinessInfo(data);
      console.log(data.data[0]);


      // 실패
      if(data.data[0].valid_msg == "확인할 수 없습니다."){
        console.log("실패");
        setValidated(false);
        setMessage("인증에 실패하였습니다.");
        setBusinessNumber("");
        setCeoName("");
        setStartedDate("");
        alert("인증 실패");
        return;
      }

      if(data.status_code=="OK"){
        setValidated(true);
        console.log("성공");
        setMessage("인증에 성공하였습니다.");
        alert("인증 성공");
        return;
      }
    } catch (error) {
      alert('오류가 발생했습니다.' + error);
    }
    
  };

  return {
    businessNumber, setBusinessNumber,
    startedDate,setStartedDate,
    ceoName, setCeoName,
    handleValidate,
    handleBusinessNumberChange,
    handleCeoNameChange,
    handleStartedDateChange,
    validated,
    message
  };
};
export default useBussinessNumberCheck;
