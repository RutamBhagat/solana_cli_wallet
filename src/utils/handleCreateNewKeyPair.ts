import { Keypair } from "@solana/web3.js";
import { keypairToBase58 } from "./handleUtils";

export async function handleCreateNewKeypair() {
  const newKeypair = createNewKeypair();
  console.log(`New Keypair created:`);
  console.log(`Public Key: ${newKeypair.publicKey.toBase58()}`);
  console.log(`Private Key (Base58): ${keypairToBase58(newKeypair)}`);
}

export function createNewKeypair(): Keypair {
  return Keypair.generate();
}
