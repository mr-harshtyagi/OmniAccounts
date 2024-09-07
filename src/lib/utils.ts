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

export function chainIdToEid(chainId: number | undefined) {
  switch (chainId) {
    case 11155111:
      return 40161;
    case 421614:
      return 40231;
    case 11155420:
      return 40232;
    case 84532:
      return 40245;
    default:
      return 1;
  }
}
