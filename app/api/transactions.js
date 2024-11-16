import { Account, Contract, RpcProvider } from "starknet";
import * as dotenv from "dotenv";
dotenv.config();

const connectAccount = () => {
  try {
    // initialize provider
    const provider = new RpcProvider({
      nodeUrl: process.env.NEXT_PUBLIC_RPC_ENDPOINT,
    });

    // initialize existing pre-deployed account 0 of Devnet
    const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
    const accountAddress = process.env.NEXT_PUBLIC_ACCOUNT_ADDRESS;

    if (!privateKey || !accountAddress) {
      throw new Error(
        "Missing private key or account address in environment variables"
      );
    }

    const account = new Account(provider, accountAddress, privateKey);

    return { provider, account };
  } catch (error) {
    console.error("Error in connectAccount:", error);
    throw error;
  }
};

const invokeTransaction = async () => {
  try {
    const { provider, account } = connectAccount();

    // Connect the deployed counter contract on Sepolia
    const counterAddress =
      "0x059ec333d64266425bc9e31f73fd5517ef6c80bdb465e509012db0361efb62b6";

    // read abi of the counter contract
    const { abi: counterABI } = await provider.getClassAt(counterAddress);
    if (counterABI === undefined) {
      throw new Error("No ABI found for the contract.");
    }

    const counterContract = new Contract(counterABI, counterAddress, provider);

    // Connect account with the contract
    counterContract.connect(account);

    // Correctly call increase_counter
    const myCall = await counterContract.populate("increase_counter", []);
    const res = await account.execute(myCall);

    return { transactionHash: res.transaction_hash };
  } catch (error) {
    console.error("Error in invokeTransaction:", error);
    throw error;
  }
};

const readCounter = async () => {
  try {
    const { provider, account } = connectAccount();

    // Connect the deployed counter contract
    const counterAddress =
      "0x059ec333d64266425bc9e31f73fd5517ef6c80bdb465e509012db0361efb62b6"; // Use the same address as invoke

    // read abi of counter contract
    const { abi: counterABI } = await provider.getClassAt(counterAddress);
    if (counterABI === undefined) {
      throw new Error("No ABI found for the contract.");
    }

    const counterContract = new Contract(counterABI, counterAddress, provider);

    // Connect account with the contract
    counterContract.connect(account);

    // Get counter value
    const counterValue = await counterContract.get_counter();
    console.log("Counter value:", counterValue);

    return counterValue;
  } catch (error) {
    console.error("Error in readCounter:", error);
    throw error;
  }
};

export { invokeTransaction, readCounter };
