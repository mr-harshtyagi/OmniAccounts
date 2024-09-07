"use client";
import Navbar from "@/components/Navbar";
import {
  DollarSignIcon,
  FolderSyncIcon,
  RepeatIcon,
  WalletIcon,
} from "lucide-react";

const links = [
  {
    href: "/app/wallets",
    text: "My Wallets",
    image: <WalletIcon className="h-6 w-6" />,
  },
  {
    href: "/app/bridge",
    text: "Bridge",
    image: <RepeatIcon className="h-6 w-6" />,
  },
  {
    href: "/app/transfer",
    text: "Transfer",
    image: <DollarSignIcon className="h-6 w-6" />,
  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="">
      <Navbar links={links} />
      <div className="px-12 py-4"> {children}</div>
    </section>
  );
}
