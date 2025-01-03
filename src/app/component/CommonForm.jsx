import React, { useEffect, useState } from 'react';
import usePhoneVerification from '../authentication/signUp/hooks/usePhoneVerification';
import { Box, Button, Grid, Typography } from '@mui/material';
import useEmailVerification from '../authentication/signUp/hooks/useEmailVerification';
import useSignup from '../authentication/signUp/hooks/useSignUP';
import useBussinessNumberCheck from '../authentication/signUp/hooks/useBussinessNumberCheck';
import InputForm from './InputForm';
import api from "../../../services/axios";
import { useRouter } from 'next/navigation';
import AgreementForm from './AgreementForm';

function CommonForm({agreement}, type) {

  const router = useRouter();

  const {
    phone,
    otp,
    phoneVerified,
    otpSended,
    handlePhoneChange,
    handleOtpChange,
    sendOtp,
    verifyOtp
  } = usePhoneVerification();
    // 이메일 커스텀 훅
    const {
      email,
      verificationCode,
      verificationSent,
      emailVerified,
      countdown,
      error,
      handleVerificationCodeChange,
      handleEmailChange,
      verifyCode,
      sendVerificationCode,
    } = useEmailVerification();
  
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  
    const {
      id, password, passwordConfirm, username, 
      zipcode, address, addressDetail, agreed, idStatus, passwordCheck,
      handleIdChange, handlePasswordChange, handlePasswordConfirmChange, handleUsernameChange,
      handleAgreeChange, handleZipcodeChange, handleAddressChange, handleAddressDetailChange,  //주소
      setError, handlePostCode,
      setUserType, userType
    } = useSignup(LOCAL_API_BASE_URL);

      
    // 사업자 등록번호 조회 훅
    const {
      businessNumber, 
      startedDate,
      ceoName,
      setBusinessNumber,
      setStartedDate,
      setCeoName,
      handleValidate,
      handleBusinessNumberChange,
      handleCeoNameChange,
      handleStartedDateChange,
      validated
    } = useBussinessNumberCheck();

    const [selectedForm, setSelectedForm] = useState("form1");         // 일반, 사업자 폼 구분
    useEffect(() => {
      // 카카오 주소 검색 스크립트 추가
      const script = document.createElement("script");
      script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }, []);

    const handleSubmit = async (e) => {
    
      e.preventDefault();

      if(userType == "사업자 가입자"){
        if(!businessNumber || !ceoName || !startedDate){
          alert('사업자 정보를 입력해주세요.');
          return;
        }
        if(!validated){
          alert('사업자 인증을 완료해주세요.');
        }
      }
  
      if (!id || !password || !passwordConfirm || !username || !phone || !email || !zipcode || !address || !addressDetail) {
        alert("모든 필드를 입력하세요.");
        return;
      }
      if(!idStatus){
        alert("이미 사용중인 아이디입니다.");
      }
      if (password !== passwordConfirm) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
      if (!emailVerified) {
        alert("이메일 인증을 완료해주세요.");
        return;
      }
      if (!agreed) {
        alert("약관에 동의해주세요." + agreed);

        const userData = {
            id: id,
            username: username,
            password: password,
            email: email,
            phone: phone,
            zipcode: zipcode,
            address: address,
            address_detail: addressDetail,
            business_number: businessNumber,
            business_ceo: ceoName,
            started_date: startedDate,
            type : userType
        };
    
    
        try {
          const response = await api.post('/api/users/join', userData, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          console.log(response);
          if(response.data.success){
            console.log(response.data);
            router.push('/');
          }
        } catch (error) {
          alert('회원가입 실패' + error);
        }   

        return;
      }

      console.log(password);
  
      
        const userData = {
          id: id,
          username,
          password: password,
          email: email,
          phone: phone,
          zipcode: zipcode,
          address: address,
          address_detail: addressDetail,
          business_number: businessNumber,
          business_ceo: ceoName,
          started_date: startedDate,
          type: userType
      };
  
  
      try {
        const response = await api.post('/api/users/join', userData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log(response);
        if(response.data.success){
          console.log(response.data);
          alert("환영합니다.");
          router.push('/');
        }
      } catch (error) {
        alert('회원가입 실패' + error);
      }   
    };



  return (
    <Box
        component="main"  
        sx={{
          maxWidth: "510px",
          ml: "auto",
          mr: "auto",
          padding: "50px 0 100px",
        }}
      >
    <Grid item xs={12} md={12} lg={12} xl={12}>
      <form onSubmit={handleSubmit}>
      <Box>
          {/* 선택된 폼 */}
          <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <Button
                variant={selectedForm === 'form1' ? 'contained' : 'outlined'}
                onClick={() => {
                  setSelectedForm('form1');
                  setUserType('일반 가입자');
                  // 사업자 폼 초기화
                  setBusinessNumber('');
                  setStartedDate('');
                  setCeoName('');
                }}
                
                sx={{ margin: '0 10px' }}
              >
                일반 가입자
              </Button>
            <Button
              variant={selectedForm === 'form2' ? 'contained' : 'outlined'}
              onClick={() => {
                setSelectedForm('form2')
                setUserType('사업자 가입자');
              }}
              sx={{ margin: '0 10px' }}
            >
              사업자 가입자 
            </Button>
          </Box>
          <Box>
            {selectedForm === 'form1' && (
              <p/>
            )}
            {selectedForm === 'form2' && (
              <Box component="form">
                <h2>사업자등록번호 조회</h2>
                <Box
                  sx={{background: "#fff", padding: "30px 20px", borderRadius: "10px", mb: "20px",}}
                  className="bg-black"
                >
                  <Grid container alignItems="center" spacing={2}>
                    <InputForm
                      label="사업자명"
                      name="ceoName"
                      value={ceoName}
                      onChange={handleCeoNameChange}
                      disabled={validated}
                    />
                    <InputForm
                      label="사업자등록번호"
                      maxLength='10'
                      name="BusinessNumber"
                      placeholder="-없이 입력해주세요."
                      value={businessNumber}
                      onChange={handleBusinessNumberChange}
                      disabled={validated}
                    />
                    <InputForm
                      label="개업일자"
                      name="startedDate"
                      maxLength='8'
                      placeholder="YYYYMMDD"
                      value={startedDate}
                      onChange={handleStartedDateChange}
                      disabled={validated}
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        mt: 2,
                        mb: 2,
                        textTransform: "capitalize",
                        borderRadius: "8px",
                        fontWeight: "500",
                        fontSize: "16px",
                        ml:"20px",
                        mr:"2px",
                        padding: "10px 10px",
                        color: "#fff !important",
                      }}
                      onClick={handleValidate}
                      disabled={false}
                    >
                      인증하기
                    </Button>

                    <Typography variant="body2" color="textSecondary" sx={{ mt: 3, ml: 3 }}>
                      {validated ? '인증 완료되었습니다.' : ''}
                    </Typography>
                  
                  </Grid>
                
                </Box>      
              </Box>
            )}
          </Box>
        {/* 페이지 제목 */}
        <Typography as="h1" fontSize="28px" fontWeight="700" mb="5px">
          {/* <img
            src="/images/favicon.png" //메인 이미지
            alt="favicon"
            className={styles.favicon}
          /> */}
        </Typography>

        <Box noValidate>
          <Box
            sx={{
              background: "#fff",
              padding: "30px 20px",
              borderRadius: "10px",
              mb: "20px",
            }}
            className="bg-black"
          >
            <Grid container alignItems="center" spacing={2}>
              {/* 입력 필드 */}
              <InputForm
                label="아이디"
                name="id"
                value={id}
                onChange={handleIdChange}
              />
              {/* 아이디 중복확인 */}

              <Typography variant="body2" color="textSecondary" sx={{ mt: 2, ml: 3 }}>
                {idStatus.message}
              </Typography>
              
              <InputForm
                label="비밀번호"
                type="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
              />
              <InputForm
                label="비밀번호 확인"
                type="password"
                name="passwordChk"
                value={passwordConfirm}
                onChange={handlePasswordConfirmChange}
              />

               {/* 비밀번호 일치 확인 */}
              {/* InputForm(label, type, name, value, onChange) */}
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2, ml: 3 }}>
                {passwordConfirm == "" ?  "" : (passwordCheck ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다.")}
              </Typography>
            </Grid>
          </Box>
          <Box 
            sx={{
              background: "#fff",
              padding: "30px 20px",
              borderRadius: "10px",
              mb: "20px",
            }}
            className="bg-black"
          >
            <Grid container alignItems="center" spacing={2}>
              <InputForm
                label="이름" 
                name="username"
                value={username}
                onChange={handleUsernameChange}
              />
              <InputForm
                label="휴대폰번호"
                name="phone"
                value={phone}
                onChange={handlePhoneChange}
                xs={12}
                disabled={phoneVerified}
              />
              <Button
                xs={4}
                variant="outlined"
                color="primary"
                fullWidth
                onClick={sendOtp}
                disabled={phoneVerified}
              >
                휴대폰 인증하기
              </Button> 
              <InputForm
                label="인증번호"
                name="otp"
                value={otp}
                onChange={handleOtpChange}
                //otp 발송 전과 인증 후에 disabled
                disabled={!otpSended || phoneVerified}
                xs={12}
              />
              <Button
                xs={4}
                variant="outlined"
                color="primary"
                fullWidth
                disabled={!otpSended || phoneVerified}
                onClick={verifyOtp}
              >
                확인
              </Button> 
            </Grid>
          </Box>
          <Box
            sx={{
              background: "#fff",
              padding: "30px 20px",
              borderRadius: "10px",
              mb: "20px",
            }}
            className="bg-black"
          >
            <Grid container alignItems="center" spacing={2}>
              <InputForm
                label="이메일"
                name="email"
                value={email}
                onChange={handleEmailChange}
                disabled={emailVerified}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  mb: 2,
                  textTransform: "capitalize",
                  borderRadius: "8px",
                  fontWeight: "500",
                  fontSize: "16px",
                  ml:"20px",
                  mr:"2px",
                  padding: "10px 10px",
                  color: "#fff !important",
                }}
                onClick={sendVerificationCode}
                disabled={emailVerified}
              >
              인증번호 보내기
              </Button>
              <InputForm
                label="인증 코드"
                name="verificationCode"
                value={verificationCode}
                onChange={handleVerificationCodeChange}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  mb: 2,
                  textTransform: "capitalize",
                  borderRadius: "8px",
                  fontWeight: "500",
                  fontSize: "16px",
                  ml:"20px",
                  mr:"2px",
                  padding: "10px 10px",
                  color: "#fff !important",
                }}
                onClick={verifyCode}
                disabled={emailVerified}
              >
                인증번호 확인
              </Button>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 3, ml: 3 }}>
                {emailVerified
                  ? '인증 완료되었습니다.'
                  : verificationSent
                  ? `인증 코드가 이메일로 발송되었습니다. 남은 시간: ${Math.floor(countdown / 60)}:${countdown % 60}`
                  : null}
              </Typography>
            
            </Grid>
          
          </Box>            
          <Box
            sx={{
              background: "#fff",
              padding: "30px 20px",
              borderRadius: "10px",
              mb: "20px",
            }}
            className="bg-black"
          >
            <Grid container alignItems="center" spacing={2}>
              <InputForm 
                label="우편번호"
                name="zipcode"
                value={zipcode}
                onChange={handleZipcodeChange}
                disabled
              />
            </Grid>
          
            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                mb: 2,
                textTransform: "capitalize",
                borderRadius: "8px",
                fontWeight: "500",
                fontSize: "16px",
                mr:"2px",
                padding: "10px 10px",
                color: "#fff !important",
              }}
              onClick={handlePostCode}
            >
              우편번호 검색
            </Button>
            <Grid container alignItems="center" spacing={2}>
              <InputForm 
                label="주소"
                value={address}
                onChange={handleAddressChange}
                disabled
              />
              <InputForm 
                label="상세주소"
                value={addressDetail}
                onChange={handleAddressDetailChange}
              />
            </Grid>
          </Box>
        </Box>

        {
          agreement ? <AgreementForm agreed={agreed} handleAgreeChange={handleAgreeChange}/> : ""
        }

        {/* 에러 메시지 */}
        {error && (
          <Typography color="error" sx={{ marginTop: 2 }}>
            {error}
          </Typography>
        )}

        {/* 회원가입 버튼 */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          // onClick={handleSignup}
          sx={{ marginTop: 2 }}
          disabled={false}
        >
          회원가입
        </Button>

        {/* 로그인 페이지로 이동 */}
        <Button
          variant="text"
          color="secondary"
          fullWidth
          onClick={() => router.push("/authentication/login")}
          sx={{ marginTop: 1 }} 
        >
          이미 계정이 있으신가요? 로그인
        </Button>
      </Box>
  </form>
</Grid>
</Box>
  );
}

export default CommonForm;