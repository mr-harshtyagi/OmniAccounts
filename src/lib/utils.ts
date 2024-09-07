import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  abi,
  sepoliaAddress,
  arbitrumSepoliaAddress,
  optimismSepoliaAddress,
  baseSepoliaAddress,
} from "@/lib/contracts/NFTWallet.json";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function chainIdToContractAddress(chainId: number | undefined) {
  switch (chainId) {
    case 111155111:
      return sepoliaAddress;
    case 421614:
      return arbitrumSepoliaAddress;
    case 11155420:
      return optimismSepoliaAddress;
    case 84532:
      return baseSepoliaAddress;
    default:
      return sepoliaAddress;
  }
}
