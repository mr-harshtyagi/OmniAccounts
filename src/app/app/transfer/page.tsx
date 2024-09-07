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
import {
  useAccount,
  useReadContract,
  useChainId,
  useSendTransaction,
} from "wagmi";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseEther } from "viem";
import { TokenboundClient } from "@tokenbound/sdk";
import { useEthersSigner } from "@/hooks/useEthersSigner";

const availableChains = [
  { id: baseSepolia.id, name: baseSepolia.name },
  { id: arbitrumSepolia.id, name: arbitrumSepolia.name },
  { id: sepolia.id, name: sepolia.name },
  { id: optimismSepolia.id, name: optimismSepolia.name },
];

const Transfer = () => {
  const { address, chainId, chain } = useAccount();
  const {
    data: hash,
    sendTransaction,
    isPending,
    isSuccess,
    error,
  } = useSendTransaction();
  const { toast } = useToast();
  const { switchChain } = useSwitchChain();
  const [formData, setFormData] = useState({
    chain: null,
    nftWallet: 0,
    amount: 0,
  });

  const signer = useEthersSigner({ chainId: chainId });

  const tokenboundClient = new TokenboundClient({
    signer,
    chain: chain,
  });

  useEffect(() => {
    if (isSuccess) {
      toast({
        variant: "success",
        title: "Transfer Successful",
        description: `${formData.amount} ETH transferred successfully!`,
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error)
      toast({
        title: "Oops!",
        description: "Error. Please try again!",
        variant: "destructive",
      });
  }, [error]);

  const handleSelectionChange = (field: string, value: string): any => {
    setFormData((prevSelection) => ({
      ...prevSelection,
      [field]: value,
    }));

    switchChain({ chainId: Number(value) });
  };

  const handleTransfer = async () => {
    console.log(formData);
    const { chain, nftWallet, amount } = formData;
    const to = tokenboundClient.getAccount({
      tokenContract: chainIdToContractAddress(chainId) as `0x${string}`,
      tokenId: String(nftWallet),
    });
    sendTransaction({ to, value: parseEther(String(amount)) });
    // console.log(to, parseEther(String(amount)));
  };

  // if (isLoading)
  //   return (
  //     <div className="py-8">
  //       <div className="flex justify-start">
  //         <Skeleton className="h-8 w-96 rounded-full" />
  //       </div>
  //       <div className="flex justify-center">
  //         <div className="grid w-[40%] items-center gap-4 mt-24">
  //           <div className="flex flex-col space-y-2">
  //             <Skeleton className="h-2 w-28 rounded-full" />
  //             <Skeleton className="h-8 w-[500px] rounded-full" />
  //           </div>
  //           <div className="flex flex-col space-y-2">
  //             <Skeleton className="h-2 w-28 rounded-full" />
  //             <Skeleton className="h-8 w-[500px] rounded-full" />
  //           </div>
  //           <div className="flex flex-col space-y-2">
  //             <Skeleton className="h-2 w-28 rounded-full" />
  //             <Skeleton className="h-8 w-[500px] rounded-full" />
  //           </div>
  //           <div className="flex justify-center">
  //             <Skeleton className="mt-4 h-10 w-20 rounded-lg" />
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );

  return (
    <div className="py-8">
      <div className="flex justify-start">
        <p className="text-3xl font-medium">
          Transfer ETH to Omnichain Accounts
        </p>
      </div>
      <div className="flex justify-center">
        <div className="grid w-[40%] items-center gap-4 mt-24">
          <div className="flex flex-col space-y-2">
            <Label className="font-semibold">
              Select your destination Chain
            </Label>
            <Select
              onValueChange={(value) => handleSelectionChange("chain", value)}
            >
              <SelectTrigger className="">
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

          <div className="flex flex-col space-y-2">
            <Label htmlFor="nftWallet" className="font-semibold">
              NFT Wallet
            </Label>
            <Input
              id="nftWallet"
              type="number"
              placeholder="0"
              className="col-span-3"
              value={formData.nftWallet}
              onChange={(e: { target: { value: any } }) =>
                setFormData({
                  ...formData,
                  nftWallet: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Label className="font-semibold"> Amount </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.0"
              className="col-span-3 pl-4"
              value={formData.amount}
              onChange={(e: { target: { value: any } }) =>
                setFormData({
                  ...formData,
                  amount: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="flex justify-center">
            <Button
              className="mt-4"
              onClick={handleTransfer}
              disabled={isPending}
            >
              Transfer Funds
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transfer;
