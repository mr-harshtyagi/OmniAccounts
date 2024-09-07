"use client";

import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { useAccount, useWriteContract } from "wagmi";
import { useToast } from "../ui/use-toast";


const CreateWallet = () => {
  const { address: walletAddress } = useAccount();
  const { toast } = useToast();
  const { isPending, isSuccess, error, writeContract } = useWriteContract();

  const handleNFTmint = async () => {
    try {
      // writeContract({
      //   address: address as `0x${string}`,
      //   abi: abi,
      //   functionName: "safeMint",
      //   args: [walletAddress],
      // });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to create wallet",
      });
    }
  };

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Failed to create wallet. Try Again!",
      });
    }
  }, [error]);

  useEffect(() => {
    if (isPending) {
      toast({
        variant: "default",
        description: "Wallet NFT minting is in progress...",
      });
    }
  }, [isPending]);

  useEffect(() => {
    if (isSuccess) {
      toast({
        variant: "success",
        title: "NFT Minted !!",
        description: "Wallet NFT minted successfully!",
      });
    }
  }, [isSuccess]);

  return (
    <div>
      <Button className="rounded-[10px] font-semibold" onClick={handleNFTmint}>
        + Mint OmniAccount NFT Wallet
      </Button>
    </div>
  );
};

export default CreateWallet;
