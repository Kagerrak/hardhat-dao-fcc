const { network } = require("hardhat");

module.exports = async function moveTime(amount) {
  console.log("Moving time...");
  await network.provider.send("evm_increaseTime", [amount]);
  console.log(`move forward ${amount} seconds`);
};
