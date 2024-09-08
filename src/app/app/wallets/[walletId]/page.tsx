"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeftIcon, CopyIcon, FileCheckIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { TokenboundClient } from "@tokenbound/sdk";
import { useEthersSigner } from "@/hooks/useEthersSigner";
import { useAccount, useBalance } from "wagmi";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/Spinner";
import { Core } from "@walletconnect/core";
import { Web3Wallet, Web3WalletTypes } from "@walletconnect/web3wallet";
import { buildApprovedNamespaces, getSdkError } from "@walletconnect/utils";
import { chainIdToContractAddress } from "@/lib/utils";
import TransferComponent from "@/components/transfer/TransferComponent";

interface FormData {
  recipientAddress: string;
  amount: number;
}

const WalletOverview = () => {
  const router = useRouter();
  const { walletId } = useParams();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [nftAccount, setNftAccount] = useState<any>();
  const [isAccountActive, setIsAccountActive] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferType, setTransferType] = useState<"Address" | "NFT" | null>(
    null
  );
  const { address, chainId, chain } = useAccount();
  const signer = useEthersSigner({ chainId: chainId });
  const [formData, setFormData] = useState<FormData>({
    recipientAddress: "",
    amount: 0,
  });
  const [isPairing, setIsPairing] = useState(false);
  const [walletConnectUri, setWalletConnectUri] = useState("");

  const omniAccountWalletNFTAddress = chainIdToContractAddress(chainId);

  const tokenboundClient = new TokenboundClient({
    signer,
    chain: chain,
    chainId: chainId,
  });

  const { data: balance, isLoading } = useBalance({
    address: nftAccount,
    chainId: chainId,
  });

  const handleGoBackToWallets = () => {
    router.back();
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(nftAccount);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  const handleTransactionView = () => {
    // open in new tab
    window.open(
      chain?.blockExplorers?.default.url + `/address/${nftAccount}`,
      "_blank"
    );
    // router.push(chain?.blockExplorers?.default.url + `/address/${nftAccount}`);
  };

  const getAccount = async () => {
    const account = tokenboundClient.getAccount({
      tokenContract: omniAccountWalletNFTAddress as `0x${string}`,
      tokenId: walletId as string,
    });
    const isAccountDeployed = await tokenboundClient.checkAccountDeployment({
      accountAddress: account,
    });
    setNftAccount(account);

    setIsAccountActive(isAccountDeployed);

    console.log(account);
  };

  const pair = async () => {
    setIsPairing(true);
    const core = new Core({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    });

    // TO DO : 🟡
    const web3wallet = await Web3Wallet.init({
      core,
      metadata: {
        name: "Demo app",
        description: "Demo Client as Wallet/Peer",
        url: "www.walletconnect.com",
        icons: [],
      },
    });

    console.log("web3wallet", web3wallet);

    async function onSessionProposal({
      id,
      params,
    }: Web3WalletTypes.SessionProposal) {
      try {
        console.log("session proposal", params);

        // ------- namespaces builder util ------------ //
        const approvedNamespaces = buildApprovedNamespaces({
          proposal: params,
          supportedNamespaces: {
            eip155: {
              chains: [`eip155:${chainId}`, `eip155:1`],
              methods: [
                "eth_accounts",
                "eth_requestAccounts",
                "eth_sendTransaction",
                "eth_sendRawTransaction",
                "eth_sign",
                "eth_signTransaction",
                "eth_signTypedData",
                "eth_signTypedData_v3",
                "eth_signTypedData_v4",
                "eth_sendTransaction",
                "personal_sign",
                "wallet_switchEthereumChain",
                "wallet_addEthereumChain",
                "wallet_getPermissions",
                "wallet_requestPermissions",
                "wallet_registerOnboarding",
                "wallet_watchAsset",
                "wallet_scanQRCode",
                "wallet_sendCalls",
                "wallet_getCapabilities",
                "wallet_getCallsStatus",
                "wallet_showCallsStatus",
              ],
              events: [
                "chainChanged",
                "accountsChanged",
                "message",
                "disconnect",
                "connect",
              ],
              accounts: [
                `eip155:${chainId}:${nftAccount}`,
                `eip155:1:${nftAccount}`,
              ],
            },
          },
        });
        // ------- end namespaces builder util ------------ //

        const session = await web3wallet.approveSession({
          id,
          namespaces: approvedNamespaces,
          // sessionConfig: { disableDeepLink: false },
        });

        console.log("session", session);

        setIsPairing(false);
        setWalletConnectUri("");
        toast({
          title: "Wallet Connected",
          description: "Your wallet has been connected successfully",
          duration: 3000,
          variant: "success",
        });
      } catch (error) {
        // use the error.message to show toast/info-box letting the user know that the connection attempt was unsuccessful
        await web3wallet.rejectSession({
          id: id,
          reason: getSdkError("USER_REJECTED"),
        });
        setIsPairing(false);
        setWalletConnectUri("");
        toast({
          title: "Error",
          description:
            "There was an issue connecting the wallet. Please try again.",
          duration: 3000,
          variant: "destructive",
        });
      }
    }

    web3wallet.on("session_proposal", onSessionProposal);
    await web3wallet.pair({ uri: walletConnectUri });
  };

  const handleWalletCreate = useCallback(async () => {
    if (!tokenboundClient || !address) return;
    setIsCreating(true);
    toast({
      description: "Activating your NFT Wallet...",
      variant: "default",
    });
    try {
      console.log("Creating account", omniAccountWalletNFTAddress, walletId);
      const createdAccount = await tokenboundClient.createAccount({
        tokenContract: omniAccountWalletNFTAddress as `0x${string}`, // nft token contract address
        tokenId: walletId as string,
      });
      console.log(createdAccount);
      toast({
        title: "NFT Wallet Activated!",
        description: "Your account has been created successfully",
        duration: 3000,
        variant: "success",
      });
    } catch (error) {
      console.error("Error creating account:", error);
      toast({
        title: "Error",
        description:
          "There was an issue creating the account. Please try again.",
        duration: 3000,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  }, [tokenboundClient]);

  const transferETH = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!tokenboundClient || !address || !nftAccount) return;

    setIsTransferring(true);
    try {
      const executedTransfer = await tokenboundClient.transferETH({
        account: nftAccount,
        recipientAddress: formData.recipientAddress as `0x${string}`,
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
  };

  const goBack = () => {
    setTransferType(null);
    setIsTransferring(false);
    setFormData({
      recipientAddress: "",
      amount: 0,
    });
  };

  useEffect(() => {
    getAccount();
  }, []);

  const handleResetForm = () => ({
    recipientAddress: "",
    amount: "",
  });

  return (
    <div className=" pt-8 px-12">
      <div className="flex justify-between items-center mb-8">
        <div className="text-2xl font-medium">Wallet Overview</div>
        <Button
          onClick={handleGoBackToWallets}
          variant="outline"
          className="font-semibold"
        >
          Go back to Wallets
        </Button>
      </div>
      <div className=" flex justify-between py-8">
        <div className="flex flex-col gap-2">
          <div className="text-3xl font-medium">NFT Wallet #{walletId}</div>
          <div className="flex items-center gap-2">
            <div className="text-md text-muted-foreground">
              Account:
              {nftAccount}
            </div>
            <div onClick={handleCopyToClipboard}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    {copied ? (
                      <FileCheckIcon className="text-green-500 h-4 w-4" />
                    ) : (
                      <CopyIcon className="text-gray-400 h-4 w-4" />
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm text-center">Copy to clipboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div onClick={handleTransactionView}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Image
                      src="/etherscan.png"
                      width={15}
                      height={15}
                      alt="Logo"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm text-center">
                      View on block explorer
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        {isAccountActive ? (
          <div className="flex gap-8 items-center justify-center">
            {/* connect wallet to dapp */}
            <Dialog>
              <DialogTrigger asChild>
                <Button>Connect Wallet to Dapp</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Connect NFT Wallet</DialogTitle>
                  <DialogDescription>
                    Enter the wallet connect URI to connect your wallet to a
                    Dapp.
                  </DialogDescription>
                </DialogHeader>

                {!isPairing && (
                  <>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="recipientAddress"
                          className="text-right"
                        >
                          Wallet Connect URI
                        </Label>
                        <Input
                          id="recipientAddress"
                          type="text"
                          placeholder="wc:..."
                          className="col-span-3"
                          value={walletConnectUri}
                          onChange={(e: { target: { value: any } }) => {
                            setWalletConnectUri(e.target.value);
                          }}
                          required
                        />
                      </div>
                    </div>
                    <Button
                      onClick={pair}
                      className="w-full"
                      disabled={isPairing}
                    >
                      Connect Wallet
                    </Button>
                  </>
                )}
                {isPairing && (
                  <div className=" flex flex-col gap-3 items-center justify-center mt-4 text-center ">
                    <Spinner />
                    <p className="text-sm font-semibold text-muted-foreground">
                      Connecting wallet to Dapp....
                    </p>
                  </div>
                )}
              </DialogContent>
            </Dialog>
            {/* transfer ETH */}
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={handleResetForm}>Transfer ETH</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]  ">
                <DialogHeader>
                  <DialogTitle>Transfer ETH</DialogTitle>
                  <DialogDescription>
                    Enter the required details to transfer ETH.
                  </DialogDescription>
                </DialogHeader>
                {!transferType && (
                  <div className="flex flex-col gap-2">
                    <Button onClick={() => setTransferType("Address")}>
                      Transfer ETH to Address
                    </Button>
                    <Button onClick={() => setTransferType("NFT")}>
                      Transfer ETH to NFT Wallet
                    </Button>
                  </div>
                )}
                {transferType && (
                  <div className="w-full flex justify-between items-center">
                    <Button className="" variant="ghost" onClick={goBack}>
                      <ArrowLeftIcon className="h-4 w-4" />
                    </Button>
                    <p className="text-sm font-semibold text-muted-foreground">
                      Send ETH to {transferType}
                    </p>
                    <p></p>
                  </div>
                )}
                {transferType === "Address" && (
                  <form onSubmit={transferETH}>
                    {!isTransferring ? (
                      <>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="recipientAddress"
                              className="text-right"
                            >
                              Recipient Address
                            </Label>
                            <Input
                              id="recipientAddress"
                              type="text"
                              placeholder="0x..."
                              className="col-span-3"
                              value={formData.recipientAddress}
                              onChange={(e: { target: { value: any } }) =>
                                setFormData({
                                  ...formData,
                                  recipientAddress: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                              Amount
                            </Label>
                            <Input
                              id="amount"
                              placeholder="0.00"
                              className="col-span-3"
                              type="number"
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
                        </div>
                        <Button type="submit" className="w-full">
                          Transfer ETH
                        </Button>
                      </>
                    ) : (
                      <div className="flex flex-col gap-3 items-center justify-center mt-4 text-center">
                        <Spinner />
                        <p className="text-sm font-semibold text-muted-foreground">
                          Transfer in progress....
                        </p>
                      </div>
                    )}
                  </form>
                )}

                {transferType === "NFT" && <TransferComponent />}
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="flex gap-8 items-center justify-center">
            <Button onClick={handleWalletCreate} disabled={isCreating}>
              Activate NFT Wallet
            </Button>
          </div>
        )}
      </div>
      <div className="flex justify-between gap-8">
        <Card className="w-[50%]">
          <CardHeader>
            <CardTitle>Token Balances</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center text-md">
            <p> ETH</p>
            <p>{balance?.formatted} ETH</p>
          </CardContent>
        </Card>
        <Card className="w-[50%]">
          <CardHeader>
            <CardTitle>How to get started with your NFT wallet?</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-left">
            <div className="text-lg">
              <li>Activate your NFT wallet</li>
              <li>Connect your wallet to a Dapp</li>
              <li>
                Transfer ETH or perform any transaction like any other wallet.
              </li>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletOverview;
