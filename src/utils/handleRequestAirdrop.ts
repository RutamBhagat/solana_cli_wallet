import { LAMPORTS_PER_SOL, PublicKey, type Connection } from "@solana/web3.js";
import inquirer from "inquirer";

export async function handleRequestAirdrop(connection: Connection) {
  const airdropQuestions = [
    {
      type: "input",
      name: "publicKey",
      message: "Enter the public key to receive the airdrop:",
    },
    {
      type: "number",
      name: "amount",
      message: "Enter the amount of SOL to request (max 2):",
      validate: (value: number) => (value > 0 && value <= 2) || "Airdrop amount must be between 0 and 2 SOL",
    },
  ];
  // @ts-ignore
  const { publicKey, amount } = await inquirer.prompt(airdropQuestions);
  try {
    const publicKeyObj = new PublicKey(publicKey.trim());
    const signature = await requestAirdrop(connection, publicKeyObj, amount);
    console.log(`Airdrop successful. Transaction signature: ${signature}`);
  } catch (error) {
    console.error("Invalid public key or airdrop failed: " + (error as Error).message);
  }
}

export async function requestAirdrop(connection: Connection, publicKey: PublicKey, amount: number): Promise<string> {
  if (amount <= 0 || amount > 2) {
    throw new Error("Airdrop amount must be between 0 and 2 SOL");
  }

  const signature = await connection.requestAirdrop(publicKey, amount * LAMPORTS_PER_SOL);

  // Use the newer version of confirmTransaction
  const latestBlockHash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: signature,
  });

  return signature;
}
