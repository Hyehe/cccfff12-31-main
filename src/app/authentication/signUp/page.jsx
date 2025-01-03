"use client";
import React, { useEffect, useState } from "react";

import CommonForm from "../../component/CommonForm";


function SignupPage() {

  return (
    <CommonForm
      agreement={true}
      type="회원가입"
    />
  );
}

export default SignupPage;