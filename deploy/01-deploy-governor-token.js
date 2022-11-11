const { network, ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("--------------------");

  const args = [];

  const governanceToken = await deploy("GovernanceToken", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.waitConfirmations || 1,
  });

  log(`Deployed governance token to address ${governanceToken.address}`);

  await delegate(governanceToken.address, deployer);
  log("Delegated");
};

const delegate = async (governanceTokenAddress, delegatedAccount) => {
  const governanceToken = await ethers.getContractAt(
    "GovernanceToken",
    governanceTokenAddress
  );
  const tx = await governanceToken.delegate(delegatedAccount);
  await tx.wait(1);
  checkPoints = await governanceToken.numCheckpoints(delegatedAccount);
  console.log(`Checkpoints ${checkPoints} `);
};

module.exports.tags = ["all", "governance"];
