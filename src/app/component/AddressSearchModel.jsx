"use client";

import { useEffect } from "react";

const AddressSearchModal = ({ onAddressSelect }) => {
  const handlePostCode = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        // 선택된 주소와 우편번호 전달
        onAddressSelect(data.zonecode, data.address);
      },
    }).open();
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h3>우편번호 검색</h3>
      <button onClick={handlePostCode} style={{ padding: "10px 20px", fontSize: "16px" }}>
        우편번호 검색 실행
      </button>
    </div>
  );
};

export default AddressSearchModal;