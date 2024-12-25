"use client";

import React from "react";
import Image from "next/image";

const CheckoutLogo: React.FC = () => {
  return (
    <div className="flex justify-center items-center mb-6">
      {/* Logo-ul */}
      <Image
        src="/logo.png"
        alt="Globalixa Logo"
        width={320} // Dimensiunea logo-ului
        height={1}
        className=" w-[30rem] ml-8 -mb-24 -mt-14" // Spațiu între logo și text
      />
      {/* Textul Globalixa */}
      {/* <h3 className="text-xl font-bold text-gray-800">Globalixa</h3> */}
    </div>
  );
};

export default CheckoutLogo;
