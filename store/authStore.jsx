import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie'; // 쿠키 관리 라이브러리 사용

const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // 사용자 정보
      isAuthenticated: false, // 로그인 여부

        // 상태 초기화
      initialize: () => {
        const token = Cookies.get('token');
        const userCookie = Cookies.get('user');
        if (token && userCookie) {
          set({
            token,
            user: JSON.parse(userCookie),
            isAuthenticated: true,
          });
        }
      },

      // 쿠키에서 토큰 가져오기
      token: Cookies.get('token') || '',

      // 토큰 저장
      setToken: (newToken) => {
        set({ token: newToken });
        Cookies.set('token', newToken, {
          expires: 1, // 1일 동안 유효
          secure: false, // HTTPS에서만 전송
          sameSite: 'Strict', // 동일 출처 요청에만 쿠키 포함
        });
      },

      // 토큰 삭제
      removeToken: () => {
        set({ token: '' });
        Cookies.remove('token'); // 쿠키에서 토큰 제거
      },

      // 로그인 처리
      login: (user, token) => {
        set({ user, token, isAuthenticated: true });
        Cookies.set('token', token, {
          expires: 7,
          secure: false,
          sameSite: 'Strict',
        });
        console.log('Token stored in cookie:', token);
        // User 기본 정보 저장 (JSON 문자열로 변환)
        Cookies.set('user', JSON.stringify({
          id: user.id,       // 사용자 ID
          email: user.email, // 사용자 이메일
          name: user.name    // 사용자 이름
        }), {
          expires: 7,
          secure: false,
          sameSite: 'Strict',
        });

        console.log('Token and user info stored in cookies:', token, user);
      },

      // 로그아웃 처리
      logout: () => {
        set({ user: null, token: '', isAuthenticated: false });
        Cookies.remove('token'); // 쿠키 삭제
        Cookies.remove('user'); // 'user' 쿠키 삭제
        console.log('Token removed from cookie');
      },

      // 상태 초기화
      reset: () => {
        set({ user: null, token: '', isAuthenticated: false });
        Cookies.remove('token'); // 쿠키 삭제
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage, // persist를 위한 기본 설정
    }
  )
);

export default useAuthStore;
