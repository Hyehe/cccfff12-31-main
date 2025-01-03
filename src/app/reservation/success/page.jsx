"use client";

import { useSearchParams } from "next/navigation";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const paymentKey = searchParams.get("paymentKey");

  if (!orderId  || !amount  || !paymentKey) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h1>결제 성공!</h1>
      <p>주문 번호: {orderId}</p>
     
      <p>결제 금액: {amount}원</p>
      <p>결제 키: {paymentKey}</p>
    </div>
  );
};

export default SuccessPage;