"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { CopyIcon, FileCheckIcon } from "lucide-react";
import { TokenboundClient } from "@tokenbound/sdk";
import { useEthersSigner } from "@/hooks/useEthersSigner";
import { useAccount, useBalance } from "wagmi";
import { chainIdToContractAddress } from "@/lib/utils";

const WalletCard = ({ wallet }: any) => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [nftAccount, setNftAccount] = useState<any>();
  const { address, chainId, chain } = useAccount();
  const signer = useEthersSigner({ chainId: chainId });

  const tokenboundClient = new TokenboundClient({
    signer,
    chain: chain,
  });

  const handleViewWallet = () => {
    router.push(`/app/wallets/${wallet}`);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(nftAccount);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  const getAccount = () => {
    const account = tokenboundClient.getAccount({
      tokenContract: chainIdToContractAddress(chainId) as `0x${string}`,
      tokenId: wallet as string,
    });

    setNftAccount(account);

    console.log(account);
  };

  useEffect(() => {
    getAccount();
  }, []);

  return (
    <Card className="shadow-md hover:shadow-xl">
      <CardContent className="flex justify-between items-center pt-4">
        <div className="flex flex-col gap-2">
          <CardTitle>NFT Wallet #{wallet}</CardTitle>
          <div className="flex items-center gap-2">
            <CardDescription>Account: {nftAccount}</CardDescription>
            <div onClick={handleCopyToClipboard}>
              {copied ? (
                <FileCheckIcon className="text-green-500 h-4 w-4" />
              ) : (
                <CopyIcon className="text-gray-400 h-4 w-4" />
              )}
            </div>
          </div>
        </div>
        <Button onClick={handleViewWallet}> View Wallet </Button>
      </CardContent>
    </Card>
  );
};

export default WalletCard;
