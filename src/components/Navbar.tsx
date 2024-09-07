"use client"

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useAccount } from 'wagmi';
import { NavbarProps } from "@/lib/types";
import Image from 'next/image';

const Navbar: React.FC<NavbarProps> = ({ links }) => {

  const router = useRouter();
  const pathname = usePathname();
  const { isDisconnected } = useAccount();

  useEffect(() => {
    if (isDisconnected) {
      router.push("/app");
    }
  }, [isDisconnected]);

  return (
    <div className='flex items-center justify-between px-6 py-4'>
      <div className="flex items-center gap-16">
        <Link
          href="/app"
          className="flex items-center gap-4 font-bold"
          prefetch={false}
        >
          <Image
            src="/logo.png"
            width={40}
            height={40}
            alt="Picture of the author"
          />
          <span className="text-3xl">
            OmniAccounts
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 text-msm py-2 my-2 transition-all hover:bg-slate-200 ${pathname === link.href ? "bg-slate-300" : ""
                }`}
              prefetch={false}
            >
              {link.image}
              {link.text}
            </Link>
          ))}
        </nav>
      </div>
      <ConnectButton />
    </div>
  )
}

export default Navbar