const bcrypt = require("bcryptjs");
const readline = require("node:readline/promises");

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const password = await rl.question("Enter your new admin password: ");
  rl.close();

  if (!password) {
    console.log("Password cannot be empty.");
    return;
  }

  const hash = await bcrypt.hash(password, 12);

  console.log("\nGenerated bcrypt hash:\n");
  console.log(hash);
}

main();