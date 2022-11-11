const { network, ethers } = require("hardhat");
const fs = require("fs");
const {
  developmentChains,
  VOTING_PERIOD,
} = require("../helper-hardhat-config");
const { moveBlocks } = require("../utils/move-blocks");
const { proposalsFile } = require("../helper-hardhat-config");

const index = 0;

async function vote(proposalIndex) {
  const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  const proposalId = proposals[network.config.chainId][proposalIndex];
  // 0 =Against, 1 For, 2 Abstain
  const voteWay = 1;
  const reason = "I like to move it!";
  const governor = await ethers.getContract("GovernorContract");

  const proposalState = await governor.state(proposalId);
  console.log(proposalState);
  const voteTxResponse = await governor.castVoteWithReason(
    proposalId,
    voteWay,
    reason
  );
  await voteTxResponse.wait(1);
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1);
  }
  console.log("Voted! Ready to go!");
}

vote(index)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
