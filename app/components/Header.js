import React from "react";
import Image from "next/image";
import Logo from "/public/Logo.png";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <div className="relative">
      <div className="absolute left-8">
        <Image src={Logo} alt="Postman Logo" width={120} height={120} />
      </div>

      <div className="flex flex-col items-center mt-8 mb-4">
        <h1 className="text-4xl font-bold text-red-700 text-center mb-2">
          Welcome to Travelling Postman Services
        </h1>
      </div>
      <div className="bg-red-700 top-1 h-4 w-screen"></div> 
      {/* <Navbar /> */}
    </div>
  );
};

export default Header;
