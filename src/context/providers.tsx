"use client";

import React from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import {
  baseSepolia,
  arbitrumSepolia,
  sepolia,
  optimismSepolia,
} from "wagmi/chains";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";

const config = getDefaultConfig({
  appName: "Omni Accounts",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  chains: [sepolia, arbitrumSepolia, baseSepolia, optimismSepolia],
  // transports: {
  //   [mainnet.id]: http('https://eth-mainnet.g.alchemy.com/v2/...'),
  //   [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/...'),
  // },
  // transport is the networking middle layer that handles sending JSON-RPC requests to the Ethereum Node Provider (like Alchemy, Infura, etc).
  ssr: false, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Providers;
