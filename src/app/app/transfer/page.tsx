"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAccount, useReadContract, useChainId } from "wagmi";
import { abi } from "@/lib/contracts/NFTWallet.json";
import {
  baseSepolia,
  arbitrumSepolia,
  sepolia,
  optimismSepolia,
} from "wagmi/chains";
import { Skeleton } from "@/components/ui/skeleton";
import { useWriteContract, useSwitchChain } from "wagmi";
import { useToast } from "@/components/ui/use-toast";
import { chainIdToContractAddress } from "@/lib/utils";

const availableChains = [
  { id: baseSepolia.id, name: baseSepolia.name },
  { id: arbitrumSepolia.id, name: arbitrumSepolia.name },
  { id: sepolia.id, name: sepolia.name },
  { id: optimismSepolia.id, name: optimismSepolia.name },
];

const Transfer = () => {
  const { address, chainId } = useAccount();
  const { toast } = useToast();
  const { chains, switchChain } = useSwitchChain();
  const currentChainId = useChainId();
  const [nftWallets, setNftWallets] = useState<any[]>([]);
  const [selection, setSelection] = useState({
    nft: null,
    chain: null,
  });

  const { data: nftData, isLoading } = useReadContract({
    abi,
    address: chainIdToContractAddress(chainId) as `0x${string}`,
    functionName: "getUserTokens",
    args: [address],
  });

  const { isPending, isSuccess, error, writeContract } = useWriteContract();

  useEffect(() => {
    console.log(nftData);
    if (nftData) {
      setNftWallets(nftData as string[]);
    } else {
      setNftWallets([]);
    }
  }, [nftData]);

  useEffect(() => {
    if (isSuccess) {
      toast({
        variant: "success",
        title: "NFT Bridged!!",
        description: "OmniAccountWallet NFT bridged successfully!",
      });
    }
  }, [isSuccess]);

  const handleSelectionChange = (field: string, value: string): any => {
    setSelection((prevSelection) => ({
      ...prevSelection,
      [field]: value,
    }));

    switchChain({ chainId: Number(value) });
  };

  const handleBridgeClick = async () => {
    console.log(selection);
  };

  return (
    <div className="py-8">
      <div className="flex justify-start">
        <p className="text-3xl font-medium">
          Transfer ETH to Omnichain Accounts
        </p>
      </div>

      <div className="flex flex-col space-y-4 items-center mt-28 w-full">
        <div className="flex items-center space-x-4">
          <p className="font-semibold">Select your destination Chain</p>
          <Select
            onValueChange={(value) => handleSelectionChange("chain", value)}
          >
            <SelectTrigger className="w-[400px]">
              <SelectValue placeholder="Select Chain" />
            </SelectTrigger>
            <SelectContent>
              {availableChains.map((chain) => (
                <SelectItem key={chain.id} value={chain.id.toString()}>
                  {chain.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-4">
          <p className="font-semibold  pr-2">NFT Wallet</p>
          <Select
            onValueChange={(value) => handleSelectionChange("nft", value)}
          >
            <SelectTrigger className="w-[400px]">
              <SelectValue placeholder="Select NFT" />
            </SelectTrigger>
            <SelectContent>
              {nftWallets.length > 0 ? (
                nftWallets.map((wallet) => (
                  <SelectItem key={wallet} value={wallet}>
                    NFT Wallet #{Number(wallet)}
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled value="No NFTs Available">
                  No NFTs available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-4">
          <p className="font-semibold"> Amount </p>
          <Select
            onValueChange={(value) => handleSelectionChange("chain", value)}
          >
            <SelectTrigger className="w-[400px]">
              <SelectValue placeholder="Select Chain" />
            </SelectTrigger>
            <SelectContent>
              {availableChains.map((chain) => (
                <SelectItem key={chain.id} value={chain.id.toString()}>
                  {chain.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-center">
          <Button
            className="mt-4"
            onClick={handleBridgeClick}
            disabled={isPending}
          >
            Bridge NFT
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Transfer;
