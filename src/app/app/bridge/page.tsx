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
import { useWriteContract } from "wagmi";
import { useToast } from "@/components/ui/use-toast";
import { chainIdToContractAddress, chainIdToEid } from "@/lib/utils";
import { getContract, createPublicClient, http, pad } from "viem";
//@ts-ignore
import { Options } from "@layerzerolabs/lz-v2-utilities";

const availableChains = [
  { id: baseSepolia.id, name: baseSepolia.name },
  { id: arbitrumSepolia.id, name: arbitrumSepolia.name },
  { id: sepolia.id, name: sepolia.name },
  { id: optimismSepolia.id, name: optimismSepolia.name },
];

const Bridge = () => {
  const { address, chainId, chain } = useAccount();
  const { toast } = useToast();
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
    if (error) {
      toast({
        title: "Oops!",
        description: "Error Bridging NFT. Please try again!",
        variant: "destructive",
      });
    }
  }, [error]);

  useEffect(() => {
    console.log(nftData);
    if (nftData) {
      setNftWallets(nftData as string[]);
    } else {
      setNftWallets([]);
    }
  }, [nftData]);

  useEffect(() => {
    if (isPending)
      toast({
        title: "Bridging NFT...",
        description: "Confirm transaction in wallet.",
        variant: "default",
      });
  }, [isPending]);

  useEffect(() => {
    if (isSuccess) {
      toast({
        variant: "success",
        title: "NFT Bridged!!",
        description: "OmniAccountWallet NFT bridged successfully!",
      });
    }
  }, [isSuccess]);

  const filteredChains = availableChains.filter((c) => c.id !== currentChainId);

  const handleSelectionChange = (field: string, value: string): any => {
    setSelection((prevSelection) => ({
      ...prevSelection,
      [field]: value,
    }));
  };

  const handleBridgeClick = async () => {
    console.log(selection);
    if (selection.nft == null || !selection.chain) {
      toast({
        title: "Oops!",
        description:
          "Please select both an NFT and a destination chain to proceed.",
        variant: "destructive",
      });
      return;
    }

    const onftContract = getContract({
      abi,
      address: chainIdToContractAddress(chainId) as `0x${string}`,
      client: createPublicClient({
        chain: chain,
        transport: http(),
      }),
    });

    // Defining extra message execution options for the send operation
    const options = Options.newOptions()
      .addExecutorLzReceiveOption(200000, 0)
      .toHex()
      .toString();

    const sendParam = [
      chainIdToEid(Number(selection.chain)),
      pad(address as `0x${string}`),
      selection.nft,
      options,
      "0x",
      "0x",
    ];

    const result = await onftContract.read.quoteSend([sendParam, false]);

    //@ts-ignore
    const nativeFee: number = result?.nativeFee;
    writeContract({
      address: chainIdToContractAddress(chainId) as `0x${string}`,
      abi,
      functionName: "send",
      args: [sendParam, [nativeFee, 0], address],
      value: BigInt(nativeFee),
    });

    console.log([sendParam, nativeFee, false], BigInt(nativeFee));
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="flex justify-start">
          <Skeleton className="h-10 w-72 rounded-full" />
        </div>
        <div className="flex flex-col space-y-4 items-center mt-28 w-full">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-40 rounded-full" />
            <Skeleton className="h-8 w-72 rounded-full" />
          </div>

          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-40 rounded-full" />
            <Skeleton className="h-8 w-72 rounded-full" />
          </div>
          <div className="flex justify-center">
            <Skeleton className="h-10 w-40 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex justify-start">
        <p className="text-3xl font-medium">Bridge your NFT Wallet</p>
      </div>
      <div className="flex flex-col space-y-4 items-center mt-28 w-full">
        <div className="flex items-center space-x-4">
          <p className="font-semibold  pr-2">Select your NFT</p>
          <Select
            onValueChange={(value) => handleSelectionChange("nft", value)}
            required
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
          <p className="font-semibold">Destination Chain</p>
          <Select
            onValueChange={(value) => handleSelectionChange("chain", value)}
            required
          >
            <SelectTrigger className="w-[400px]">
              <SelectValue placeholder="Select Chain" />
            </SelectTrigger>
            <SelectContent>
              {filteredChains.map((chain) => (
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

export default Bridge;
