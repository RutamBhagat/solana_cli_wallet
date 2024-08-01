import { Connection } from "@solana/web3.js";
import { handleCreateNewKeypair } from "./utils/handleCreateNewKeyPair";
import { handleRequestAirdrop } from "./utils/handleRequestAirdrop";
import { handleSendSOL } from "./utils/handleSendSOL";
import { handleUtils } from "./utils/handleUtils";
import inquirer from "inquirer";

// Main function to handle user input
async function main() {
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  while (true) {
    const mainQuestion = [
      {
        type: "list",
        name: "option",
        message: "Choose an option:",
        choices: [
          { name: "Create New Keypair", value: "1" },
          { name: "Request Airdrop", value: "2" },
          { name: "Send SOL", value: "3" },
          { name: "Utils", value: "4" },
          { name: "Exit", value: "5" },
        ],
      },
    ];

    // @ts-ignore
    const { option } = await inquirer.prompt(mainQuestion);

    if (option === "1") {
      await handleCreateNewKeypair();
    } else if (option === "2") {
      await handleRequestAirdrop(connection);
    } else if (option === "3") {
      await handleSendSOL(connection);
    } else if (option === "4") {
      await handleUtils();
    } else if (option === "5") {
      console.log("Exiting the program. Goodbye!");
      break;
    } else {
      console.log("Invalid option. Please choose a valid option.");
    }

    console.log("\n"); // Add a newline for better readability
  }
}

// Execute the main function
main().catch((error) => {
  console.error("An unexpected error occurred: " + (error as Error).message);
});
