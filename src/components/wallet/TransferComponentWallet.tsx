"use client";

import React, { use, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAccount, useSendTransaction } from "wagmi";
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

const TransferComponentWallet = ({ walletId }: any) => {
  const { address, chainId, chain } = useAccount();

  const { toast } = useToast();
  const { switchChain } = useSwitchChain();
  const [tokenboundClient, setTokenboundClient] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    nftWallet: "",
    amount: "",
  });
  const [isTransferring, setIsTransferring] = useState(false);

  const signer = useEthersSigner({ chainId: chainId });

  const handleTransfer = async () => {
    console.log(formData);
    const { nftWallet, amount } = formData;
    if (!nftWallet || !amount) {
      toast({
        title: "Oops!",
        description: "Please fill in all fields to proceed with the transfer.",
        variant: "destructive",
      });
      return;
    }

    const to = tokenboundClient.getAccount({
      tokenContract: chainIdToContractAddress(chainId) as `0x${string}`,
      tokenId: String(nftWallet),
    });

    const from = tokenboundClient.getAccount({
      tokenContract: chainIdToContractAddress(chainId) as `0x${string}`,
      tokenId: String(walletId),
    });

    setIsTransferring(true);
    try {
      const executedTransfer = await tokenboundClient.transferETH({
        account: from,
        recipientAddress: to as `0x${string}`,
        amount: Number(formData.amount),
      });

      toast({
        title: "Transfer Successful",
        description: `Sent ${formData.amount} ETH to ${formData.recipientAddress}`,
        duration: 3000,
        variant: "success",
      });
    } catch (error) {
      console.error("Transfer failed", error);
      toast({
        title: "Transfer Failed",
        description:
          "There was an issue with the transaction. Please try again.",
        duration: 3000,
        variant: "destructive",
      });
    } finally {
      setIsTransferring(false);
      setFormData({
        recipientAddress: "",
        amount: 0,
      });
    }

    // console.log(to, parseEther(String(amount)));
    setFormData({
      nftWallet: "",
      amount: "",
    });
  };

  useEffect(() => {
    const tokenboundClient = new TokenboundClient({
      signer,
      chain: chain,
    });
    setTokenboundClient(tokenboundClient);
  }, [signer, chain]);

  return (
    <div className="w-full">
      <div className="grid items-center gap-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="nftWallet" className="font-semibold">
            NFT Wallet ID
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
            disabled={isTransferring}
          >
            Transfer Funds
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransferComponentWallet;
