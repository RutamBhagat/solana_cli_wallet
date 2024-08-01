import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import inquirer from "inquirer";

export async function handleUtils() {
  const utilsQuestion = [
    {
      type: "list",
      name: "utilOption",
      message: "Choose a utility option:",
      choices: [
        { name: "Base58 to Keypair", value: "1" },
        { name: "Keypair to Base58", value: "2" },
      ],
    },
  ];

  // @ts-ignore
  const { utilOption } = await inquirer.prompt(utilsQuestion);

  if (utilOption === "1") {
    const questionA = [
      {
        type: "input",
        name: "base58PrivateKey",
        message: "Enter the Base58 private key:",
      },
    ];
    // @ts-ignore
    const { base58PrivateKey } = await inquirer.prompt(questionA);
    try {
      const keypair = base58ToKeypair(base58PrivateKey.trim());
      console.log(`Public Key: ${keypair.publicKey.toBase58()}`);
      const secretKeyArray = Array.from(keypair.secretKey);
      const formattedSecretKey = JSON.stringify(secretKeyArray).replace(/,/g, ", ");
      console.log(`Private Key (Array Format): ${formattedSecretKey}`);
    } catch (error) {
      console.error("Error: " + (error as Error).message);
    }
  } else if (utilOption === "2") {
    const questionB = [
      {
        type: "input",
        name: "secretKeyInput",
        message: "Enter the Keypair secret key as a comma-separated list (e.g., 111, 222, ...):",
      },
    ];
    // @ts-ignore
    const { secretKeyInput } = await inquirer.prompt(questionB);
    const cleanedSecretKeyInput = secretKeyInput.replace(/[\[\]]/g, "");
    const secretKeyArray = cleanedSecretKeyInput.split(",").map((num: string) => parseInt(num.trim(), 10));
    if (secretKeyArray.length !== 64) {
      console.error("Error: Invalid secret key array length. Expected 64 numbers.");
      return;
    }
    try {
      const keypair = Keypair.fromSecretKey(new Uint8Array(secretKeyArray));
      const base58PrivateKey = keypairToBase58(keypair);
      console.log(`Base58 Private Key: ${base58PrivateKey}`);
    } catch (error) {
      console.error("Error creating keypair: " + (error as Error).message);
    }
  }
}

// Utility functions moved to the bottom
export function base58ToKeypair(base58PrivateKey: string): Keypair {
  try {
    const privateKeyBuffer = bs58.decode(base58PrivateKey);
    return Keypair.fromSecretKey(privateKeyBuffer);
  } catch (error) {
    throw new Error("Invalid Base58 private key");
  }
}

export function keypairToBase58(keypair: Keypair): string {
  return bs58.encode(keypair.secretKey);
}
