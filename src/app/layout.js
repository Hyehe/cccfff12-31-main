"use client"
import React from 'react';
import Header from './component/Header';
import Footer from './component/Footer';





const Layout = ({ children }) => {
  return (
    <html lang="ko">
        
      <body>
        <Header />
        
        {children}
        
        <Footer />    

      </body>
     
    </html>
  );
};

export default Layout;
