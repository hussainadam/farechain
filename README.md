# Farechain

## Ropsten Contract Address
[0xB25e8Ed44c255466b22cc9d672E3d66c0Dd615Ee](https://ropsten.etherscan.io/address/0xB25e8Ed44c255466b22cc9d672E3d66c0Dd615Ee)

## Contract Overview
### Functions
#### `owner() → string`
Returns address of contract owner.
#### `transferOwnership(address to)`
Transfers ownership of contract to specified address. Only callable by contract owner.
#### `addOrganisation(address organisationAddress, string organisationName, string organisationPhone, string organisationLocation, uint256 bagPrice, uint256 bagValue, string bagDescription)`
Add new organisation, only callable by contract owner.
#### `removeOrganisation(address organisationAddress)`
Remove organisation, only callable by contract owner.
#### `getOrganisations() → Organisation[]`
Returns array of all organisation structs.
#### `updateBagPrice(uint256 newPrice)`
Updates bag price. Only callable by organisations.
#### `updateBagValue(uint256 newValue)`
Updates bag value. Only callable by organisations.
#### `updateBagDescription(string newDescription)`
Updates bag description. Only callable by organisations.
#### `addBags(uint16 quantity)`
Add 'n' number of bags for sale. Only callable by organisations.
#### `buy(address organisationAddress, uint16 quantity){value: quantity * bagPrice}`
Purchases 'n' number of bags for specified price. Sufficient funds needed for successful call.
#### `balance() → uint256`
Returns balance of smart contract in Wei.
#### `withdraw(uint256 amount)`
Transfers specified amount from contract to owner address. Only callable by contract owner.

## Useful Links
- [MetaMask Download](https://metamask.io/download.html)
- [Ropsten Faucet](https://faucet.dimensions.network/)
