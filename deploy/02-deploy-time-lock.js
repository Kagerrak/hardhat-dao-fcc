const { network, ethers } = require("hardhat");
const { MIN_DELAY } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("--------------------");

  const args = [MIN_DELAY, [], [], deployer];

  log("Deploying Timelock...");

  const timeLock = await deploy("TimeLock", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  log(`Deployed time lock to address ${timeLock.address}`);
};

module.exports.tags = ["all", "timelock"];
