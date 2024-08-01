import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  type Connection,
} from "@solana/web3.js";
import { base58ToKeypair } from "./handleUtils";

export async function handleSendSOL(connection: Connection) {
  const sendSOLQuestions = [
    {
      type: "input",
      name: "fromPrivateKey",
      message: "Enter the sender's private key (Base58):",
    },
    {
      type: "input",
      name: "toPublicKey",
      message: "Enter the recipient's public key:",
    },
    {
      type: "number",
      name: "amount",
      message: "Enter the amount of SOL to send:",
      validate: (value: number) => value > 0 || "Amount must be greater than 0",
    },
  ];
  // @ts-ignore
  const { fromPrivateKey, toPublicKey, amount } = await inquirer.prompt(sendSOLQuestions);
  try {
    const fromKeypair = base58ToKeypair(fromPrivateKey.trim());
    const toPublicKeyObj = new PublicKey(toPublicKey.trim());
    const signature = await sendSOL(connection, fromKeypair, toPublicKeyObj, amount);
    console.log(`Transaction successful. Signature: ${signature}`);
  } catch (error) {
    console.error("Error sending SOL: " + (error as Error).message);
  }
}

export async function sendSOL(connection: Connection, from: Keypair, to: PublicKey, amount: number): Promise<string> {
  if (amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  const balance = await connection.getBalance(from.publicKey);
  if (balance < amount * LAMPORTS_PER_SOL) {
    throw new Error("Insufficient balance");
  }

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to,
      lamports: amount * LAMPORTS_PER_SOL,
    })
  );

  const signature = await sendAndConfirmTransaction(connection, transaction, [from]);
  return signature;
}
