const { ethers, network } = require("hardhat");
const {
  NEW_STORE_VALUE,
  FUNC,
  PROPOSAL_DESCRIPTION,
  developmentChains,
  MIN_DELAY,
} = require("../helper-hardhat-config");
const { moveBlocks } = require("../utils/move-blocks");
const moveTime = require("../utils/move-time");

async function queueAndExecute() {
  const args = [NEW_STORE_VALUE];
  const box = await ethers.getContract("Box");
  const encodedFunctionCall = box.interface.encodeFunctionData(FUNC, args);
  const descriptionHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION)
  );

  const governor = await ethers.getContract("GovernorContract");
  console.log("Queueing...");
  const queueTx = await governor.queue(
    [box.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );
  await queueTx.wait(1);

  if (developmentChains.includes(network.name)) {
    await moveTime(MIN_DELAY + 1);
    await moveBlocks(1);
  }

  console.log("Executuing...");
  const executeTx = await governor.execute(
    [box.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );
  await executeTx.wait(1);

  const boxNewValue = await box.retrieve();
  console.log(`New Box Value: ${boxNewValue.toString()}`);
}

queueAndExecute()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// 0x5FbDB2315678afecb367f032d93F642f64180aa3 token
// 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 timelock
// 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9 governor
// 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853 box
