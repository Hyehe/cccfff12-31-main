"use client";
import React, { useEffect } from "react";

const KakaoMap = ({ latitude, longitude }) => {
  useEffect(() => {
    // 카카오 맵 API 스크립트 로드
    const script = document.createElement("script");
    script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=82653f2edcf163a11fb5d8dc0dab9587&autoload=false";
    script.async = true;

    script.onload = () => {
      // 카카오맵 API 로드
      window.kakao.maps.load(() => {
        const { kakao } = window;

        const container = document.getElementById("map"); // 지도를 표시할 div
        const options = {
          center: new kakao.maps.LatLng(latitude, longitude), // 지도의 중심좌표
          level: 5, // 지도의 확대 레벨
        };

        const map = new kakao.maps.Map(container, options);

        // 마커를 생성
        const markerPosition = new kakao.maps.LatLng(latitude, longitude);
        const marker = new kakao.maps.Marker({
          position: markerPosition,
        });

        // 마커를 지도에 표시
        marker.setMap(map);
      });
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script); // 컴포넌트 언마운트 시 스크립트 제거
    };
  }, [latitude, longitude]);

  return <div id="map" style={{ width: "100%", height: "400px" }} />;
};

export default KakaoMap;
