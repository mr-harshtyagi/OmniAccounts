import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex flex-col gap-12 items-center justify-between px-24 pt-12">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-bold text-3xl lg:flex">
        OmniAccounts
        <div className="fixed bottom-0 left-0 flex w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <Link href="/app">
            <Button>Launch App</Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-4 items-center mt-8">
        <Image src="/logo.png" width={150} height={150} alt="Logo" />
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-bold text-primary ">
            Welcome to OmniAccounts !
          </h1>
          <p className="text-muted-foreground">
            This will be a line of description.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-8 px-20">
        <Card className="shadow-sm border-none h-full w-full rounded-lg bg-yellow-200 bg-opacity-15 border cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-110">
          <CardHeader>
            <CardDescription className="text-center pt-1 text-lg text-black">
              This is a featured card.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="shadow-sm border-none h-full w-full rounded-lg bg-yellow-200 bg-opacity-15 border cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-110">
          <CardHeader>
            <CardDescription className="text-center pt-1 text-lg text-black">
              This is a featured card.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="shadow-sm border-none h-full w-full rounded-lg bg-yellow-200 bg-opacity-15 border cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-110">
          <CardHeader>
            <CardDescription className="text-center pt-1 text-lg text-black">
              This is a featured card.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="fixed container mx-auto bottom-4">
        <hr className="border-t-1 border-slate-600 mb-4" />
        <div className="flex justify-center items-center">
          <p className="text-muted-foreground">
            &copy;{" "}
            <a href="https://www.alphadevs.dev/" target="_blank">
              Team AlphaDevs
            </a>{" "}
            | All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
