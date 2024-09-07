"use client"

import React, { useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Card } from '@/components/ui/card'
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { WalletIcon } from 'lucide-react';

const AppPage = () => {
  const router = useRouter();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      router.push("/app/wallets");
    }
  }, [isConnected]);

  return (
    <div className='px-80 py-28'>
      <Card className='shadow-md'>
        <div className='flex flex-col items-center justify-center gap-4 py-12'>
          <p className='font-semibold text-2xl'>No wallet connected ❌</p>
          <p className='font-light text-xl text-muted-foreground'>Connect your wallet to get started with OmniAccounts</p>
          <ConnectButton />
        </div>
      </Card>
    </div>
  )
}

export default AppPage