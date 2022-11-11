const { network, ethers } = require("hardhat");
const {
  VOTING_PERIOD,
  VOTING_DELAY,
  QUORUM_PERCENTAGE,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const governanceToken = await get("GovernanceToken");
  const timeLock = await get("TimeLock");

  log("--------------------");

  const args = [
    governanceToken.address,
    timeLock.address,
    VOTING_DELAY,
    VOTING_PERIOD,
    QUORUM_PERCENTAGE,
  ];

  log("Deploying Governor...");

  const governorContract = await deploy("GovernorContract", {
    from: deployer,
    args,
    log: true,
    waitConfirmations: network.config.waitConfirmations || 1,
  });

  log(`Deployed time lock to address ${governorContract.address}`);
};

module.exports.tags = ["all", "governorcontract"];
