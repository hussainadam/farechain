const Farechain = artifacts.require("Farechain");
const Farechain2 = artifacts.require("Farechain2");

module.exports = function (deployer) {
  deployer.deploy(Farechain);
  deployer.deploy(Farechain2);
};
