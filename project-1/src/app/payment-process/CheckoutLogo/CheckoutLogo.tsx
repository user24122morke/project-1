"use client";

import React from "react";
import Image from "next/image";

const CheckoutLogo: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      {/* Logo-ul */}
      {/* <Image
        src="/logo.png"
        alt="Globalixa Logo"
        width={320} // Dimensiunea logo-ului
        height={1}
        className=" w-[30rem] ml-8 -mb-24 -mt-14" // Spațiu între logo și text
      /> */}
      {/* Textul Globalixa */}
      <h3 className=" text-4xl font-bold text-gray-800">Payment Process</h3>
    </div>
  );
};

export default CheckoutLogo;
