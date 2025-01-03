// src/utils/axiosInstance.js

import axios from 'axios';
import { getCookie } from 'cookies-next';

// BASE_URL 설정
const BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL || 'http://localhost:8080/api';

// `axiosInstance` 생성
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터를 사용하여 토큰을 헤더에 자동으로 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
