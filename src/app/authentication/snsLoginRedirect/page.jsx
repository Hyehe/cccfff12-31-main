"use client"
import React, { useEffect } from 'react';
import useAuthStore from '../../../../store/authStore';
import { useRouter } from 'next/navigation';


function page(props) {
  const { login } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    const email = urlParams.get('email');
    const id = urlParams.get('id');
    const userInfo = {
      "username": username,
      "email": email,
      "id": id
    }
    const token = urlParams.get('token');
    console.log(token);
    console.log("유저 정보 : ");
    console.log(userInfo);
    
    if (token) {
      login(userInfo, token);
      router.push('/');  // 로그인 후 대시보드로 리다이렉트
    } else {
      alert('로그인 실패');
    }
  },[])
  return (
    <div>
      
    </div>
  );
}

export default page;