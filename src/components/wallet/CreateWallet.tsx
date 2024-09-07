"use client";

import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { useAccount, useWriteContract } from "wagmi";
import { useToast } from "../ui/use-toast";
import { chainIdToContractAddress } from "@/lib/utils";
import { abi } from "@/lib/contracts/NFTWallet.json";

const CreateWallet = () => {
  const { address, chainId } = useAccount();
  const { toast } = useToast();
  const { isPending, isSuccess, error, writeContract } = useWriteContract();

  const handleNFTmint = async () => {
    try {
      writeContract({
        address: chainIdToContractAddress(chainId) as `0x${string}`,
        abi: abi,
        functionName: "mintWallet",
        args: [address],
      });
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
