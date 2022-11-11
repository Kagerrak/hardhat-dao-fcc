const { network, ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("Deploying Box Contract...");

  const box = await deploy("Box", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  log(`Box contract deployed to address ${box.address}`);

  const boxContract = await ethers.getContractAt("Box", box.address);
  const timeLock = await ethers.getContract("TimeLock");
  console.log("ok");
  const transferOwnerTx = await boxContract.transferOwnership(timeLock.address);
  await transferOwnerTx.wait(1);

  log("You've done it!");
};

module.exports.tags = ["all", "box"];
