/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: '/api/:path*', // 이 경로에 들어오는 요청을
                destination: 'https://apis.data.go.kr/:path*', // 실제 API 주소로 프록시
            },
            {
                source: '/proxy/:path*', // 프록시 서버 경로
                destination: 'http://localhost:8080/:path*', // 로컬 프록시 서버
            }
        ];
    },
};

export default nextConfig;