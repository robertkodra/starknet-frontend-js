"use client";
import Image from "next/image";
import Connect from "./components/connect";
import { invokeTransaction, readCounter } from "./api/transactions";
import { Toaster, toast } from "sonner";
import { Account, Contract, RpcProvider } from "starknet";
import * as dotenv from "dotenv";
dotenv.config();

// Counter contract ABI
const counterABI = [
  {
    name: "increase_counter",
    type: "function",
    inputs: [],
    outputs: [],
  },
  {
    name: "get_counter",
    type: "function",
    inputs: [],
    outputs: [{ name: "counter", type: "felt" }],
  },
];

const CONTRACT_ADDRESS =
  "0x059ec333d64266425bc9e31f73fd5517ef6c80bdb465e509012db0361efb62b6";

const cards = [
  {
    href: "https://www.starknetkit.com/",
    title: "StarknetKit",
    description:
      "StarknetKit is built with all kinds of users in mind. Developers, crypto experts, mobile users, and complete newbies will find a way to quickly connect to your dapp. For you? only one line of code.",
  },
  {
    href: "https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app",
    title: "Next.js",
    description:
      "Next.js gives you the best developer experience with all the features you need for production: hybrid static & server rendering, smart bundling, and more. No config needed.",
  },
  {
    href: "https://www.starknet-react.com/docs/getting-started",
    title: "Starknet-react",
    description:
      "Starknet React is a collection of React hooks for Starknet. It is inspired by wagmi, powered by starknet.js.",
  },
  {
    href: "#",
    title: "About",
    description:
      "This Starknet Starter Kit was built to provide all you need to take your Starknet dapp from development to production in no time!",
  },
];

export default function Home() {
  const handleInvokeCounter = async () => {
    try {
      const result = await invokeTransaction();
      const txHash = result.transactionHash;

      const explorerLink = `https://sepolia.voyager.online/tx/${txHash}`;

      toast.success("Transaction submitted!", {
        description: (
          <a
            href={explorerLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            View on Voyager
          </a>
        ),
        duration: 5000,
      });
    } catch (error) {
      toast.error("Transaction failed", {
        description: error.message,
      });
    }
  };

  const handleReadCounter = async () => {
    try {
      const value = await readCounter();
      toast.info("Counter Value", {
        description: `Current value: ${value}`,
      });
    } catch (error) {
      toast.error("Failed to read counter", {
        description: error.message,
      });
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-between items-center bg-gradient-to-br from-[#21396a] via-[#1d0a05] via-[#2a264a] to-[#270c06]">
      <Toaster theme="dark" position="bottom-right" />

      {/* Header */}
      <header className="w-full fixed md:relative z-10 p-4 border border-white/30 bg-white/5">
        <nav className="flex justify-between items-center text-sm font-mono">
          <div className="flex items-center gap-2">
            <img
              src="https://starknetkit-website-f0ejy1m72-argentlabs.vercel.app/starknetKit-logo-white.svg"
              alt="starknetkit logo"
            />
            <span>Starknetkit</span>
          </div>
          <Connect />
        </nav>
      </header>

      {/* Center Logo */}
      <section className="relative flex flex-col justify-center items-center py-16 mt-16 md:mt-0">
        <div className="absolute left-1/2 -ml-[400px] w-[480px] h-[360px] bg-secondary rounded-full blur-[45px] -z-10" />
        <div className="absolute left-1/2 w-[240px] h-[180px] bg-primary blur-[45px] -z-10" />
        <Image
          className="relative mb-8"
          src="https://starknetkit-website-f0ejy1m72-argentlabs.vercel.app/starknetKit-logo-white.svg"
          alt="Starknetkit Logo"
          width={400}
          height={150}
          priority
        />

        {/* New Buttons Section */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={handleInvokeCounter}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg transition-all duration-200 text-white font-semibold"
          >
            Increase Counter
          </button>
          <button
            onClick={handleReadCounter}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg transition-all duration-200 text-white font-semibold"
          >
            Read Counter
          </button>
        </div>
      </section>

      {/* Grid */}
      <section className="grid gap-4 px-5 md:px-[10%] md:grid-cols-4">
        {cards.map((card, index) => (
          <a
            key={index}
            href={card.href}
            className="group rounded-lg p-5 border border-transparent transition-all duration-200 hover:bg-white/10 hover:border-white/15"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className="mb-3 font-semibold flex items-center">
              {card.title}
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                -&gt;
              </span>
            </h2>
            <p className="text-sm leading-relaxed opacity-60">
              {card.description}
            </p>
          </a>
        ))}
      </section>
    </main>
  );
}
