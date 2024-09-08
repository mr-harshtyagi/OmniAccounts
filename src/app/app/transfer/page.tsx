"use client";
import TransferComponent from "@/components/transfer/TransferComponent";
import React from "react";

const Transfer = () => {
  return (
    <div className="py-8">
      <div className="flex justify-start mb-24">
        <p className="text-3xl font-medium">
          Transfer ETH to Omnichain Accounts
        </p>
      </div>
      <div className="w-full flex justify-center px-72">
        <TransferComponent />
      </div>
    </div>
  )
    ;
};

export default Transfer;
