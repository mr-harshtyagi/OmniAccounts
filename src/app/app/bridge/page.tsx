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
// import {
//   sepoliaAddress as omniAccountWalletNFTAddress,
//   abi,
// } from "@/lib/contracts/omniAccountWalletNFT.json";
import {
  baseSepolia,
  arbitrumSepolia,
  sepolia,
  optimismSepolia,
} from "wagmi/chains";
import { Skeleton } from "@/components/ui/skeleton";
import { useWriteContract } from "wagmi";
// import {
//   abi as omniAccountWalletNFTBridgeEntrypointABI,
//   sepoliaAddress,
//   arbitrumAddress,
// } from "@/lib/contracts/omniAccountWalletNFTBridgeEntrypoint.json";
import { useToast } from "@/components/ui/use-toast";

const availableChains = [
  { id: baseSepolia.id, name: baseSepolia.name },
  { id: arbitrumSepolia.id, name: arbitrumSepolia.name },
  { id: sepolia.id, name: sepolia.name },
  { id: optimismSepolia.id, name: optimismSepolia.name },
];

const Bridge = () => {
  const { address } = useAccount();
  const { toast } = useToast();
  const currentChainId = useChainId();
  const [nftWallets, setNftWallets] = useState<any[]>([]);
  const [selection, setSelection] = useState({
    nft: null,
    chain: null,
  });

  // const { data: nftData, isLoading } = useReadContract({
  //   abi,
  //   address: omniAccountWalletNFTAddress as `0x${string}`,
  //   functionName: "getAllomniAccountWalletNFTsForUser",
  //   args: [address],
  // });

  // const { data: cost } = useReadContract({
  //   address: "",
  //   abi: omniAccountWalletNFTBridgeEntrypointABI,
  //   functionName: "quoteCrossChainGreeting",
  //   args: [],
  // });

  // console.log(cost);

  const { isPending, isSuccess, error, writeContract } = useWriteContract();

  // useEffect(() => {
  //   if (nftData) {
  //     setNftWallets(nftData as string[]);
  //   }
  // }, [nftData]);

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


    // writeContract({
    //   address: bridgeEntrypointAddress as `0x${string}`,
    //   abi: omniAccountWalletNFTBridgeEntrypointABI,
    //   functionName: "sendCrossChainMessage",
    //   args: [targetChain, targetAddress, selection.nft],
    //   value: BigInt(Number(cost)),
    // });
  };



  return (
    <div className="py-8">
      <div className="flex justify-start">
        <p className="text-3xl font-medium">Bridge omniAccountWallet NFT</p>
      </div>
      <div className="flex flex-col space-y-4 items-center mt-28 w-full">
        <div className="flex items-center space-x-4">
          <p className="font-semibold  pr-2">Select your NFT</p>
          <Select
            onValueChange={(value) => handleSelectionChange("nft", value)}
          >
            <SelectTrigger className="w-[400px]">
              <SelectValue placeholder="Select NFT" />
            </SelectTrigger>
            <SelectContent>
              {/* {nftWallets.length > 0 ? (
                nftWallets.map((wallet) => (
                  <SelectItem key={wallet} value={wallet}>
                    omniAccountWallet NFT #{Number(wallet)}
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled value="">
                  No NFTs available
                </SelectItem>
              )} */}
              <SelectItem value={"1"}>NFT 1</SelectItem>
              <SelectItem value={"2"}>NFT 2</SelectItem>
              <SelectItem value={"3"}>NFT 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-4">
          <p className="font-semibold">Destination Chain</p>
          <Select
            onValueChange={(value) => handleSelectionChange("chain", value)}
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
  )
}

export default Bridge