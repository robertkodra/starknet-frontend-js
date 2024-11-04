"use client";
import React, { useEffect, useState } from "react";
import { connect, disconnect } from "starknetkit";

const Connect = () => {
  const [connection, setConnection] = useState(null);
  const [account, setAccount] = useState(null);
  const [address, setAddress] = useState("");

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await connect({
          modalMode: "neverAsk",
          webWalletUrl: "https://web.argent.xyz",
        });

        if (response?.wallet) {
          setConnection(response.wallet);
          if (response.connectorData?.account) {
            setAccount(response.connectorData.account);
            setAddress(response.connectorData.account);
          }
        }
      } catch (error) {
        console.error("Failed to check connection:", error);
      }
    };

    checkConnection();
  }, []);

  const connectWallet = async () => {
    try {
      const response = await connect({
        webWalletUrl: "https://web.argent.xyz",
      });

      console.log("Connect response:", response);

      if (response?.wallet) {
        setConnection(response.wallet);
        if (response.connectorData?.account) {
          setAccount(response.connectorData.account);
          setAddress(response.connectorData.account);
          console.log(
            "Connected with address:",
            response.connectorData.account
          );
        }
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnect();
      setConnection(null);
      setAccount(null);
      setAddress("");
      console.log("Disconnected wallet");
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  const truncateAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 5)}...${addr.slice(-6)}`;
  };

  if (!connection || !address) {
    return (
      <button
        className="h-[50px] w-[120px] rounded-full bg-[#008FB9] text-white 
                   hover:bg-[#007a9e] transition-colors duration-200 
                   cursor-pointer focus:outline-none focus:ring-2 
                   focus:ring-[#008FB9] focus:ring-opacity-50"
        onClick={connectWallet}
      >
        Connect
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-end">
        <span className="text-sm text-gray-300">Welcome,</span>
        <span className="text-sm font-medium text-white">
          {truncateAddress(address)}
        </span>
      </div>
      <button
        className="h-[50px] px-4 rounded-full bg-red-500 text-white 
                   hover:bg-red-600 transition-colors duration-200 
                   cursor-pointer focus:outline-none focus:ring-2 
                   focus:ring-red-500 focus:ring-opacity-50 text-sm"
        onClick={disconnectWallet}
      >
        Disconnect
      </button>
    </div>
  );
};

export default Connect;
