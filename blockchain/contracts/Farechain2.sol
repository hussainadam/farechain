// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./AccessControl.sol";

/// @title Farechain smart-contract.
contract Farechain2 is AccessControl {
  /*** EVENTS ***/

  /// @dev Emitted when a purchase is made. 
  event Purchased(
    address indexed buyerAddress,
    address indexed organisationAddress,
    uint16 indexed quantity
  );

  /*** MODIFIERS ***/
  
  /// @dev Functions with modifier can only be called by a valid organisation.
  modifier isOrganisation {
    require((addressToIndex[msg.sender] != 0) &&
      organisations[addressToIndex[msg.sender]].valid, "Farechain2: Caller is not a valid organisation");
    _;
  }

  /*** DATA STRUCTURES ***/

  /// @dev Stores the data of an organisation.
  struct Organisation {
    address organisationAddress;
    string organisationName;
    string organisationPhone;
    string organisationLocation;
    uint256 bagPrice;
    uint256 bagValue;
    string bagDescription;
    uint16 totalBags;
    bool valid;
  }
  
  /*** STORAGE ***/
  
  /// @dev Total number of organisations operating on the platform.
  uint32 public totalOrganisations;

  /// @dev Mapping from organisation's Ethereum address to corresponding
  ///   index in organisations array. Do not use for validation as default
  ///   zero value will clash with first item in array.
  mapping(address => uint256) addressToIndex;

  /// @dev Array of all organisations.
  Organisation[] organisations;

  /*** FUNCTIONS ***/

  /// @dev Set zero item in array to an empty struct to prevent bugs
  ///   caused due to mapping having default value of 0.
  constructor () {
    organisations.push(Organisation({
      organisationAddress: address(0),
      organisationName: "",
      organisationPhone: "",
      organisationLocation: "",
      bagPrice: 0,
      bagValue: 0,
      bagDescription: "",
      totalBags: 0,
      valid: false
    }));
  }

  /// @dev Returns balance of contract in Wei.
  function balance() public view returns (uint256) {
    return address(this).balance;
  }

  /// @dev Withdraw specified funds from the contract. Only callable by owner.
  /// @param amount Amount to be withdrawn in Wei
  function withdraw(uint256 amount) public onlyOwner {
    require(amount <= address(this).balance, "Farechain2: Insufficient funds");

    payable(msg.sender).transfer(amount);
  }

  /// @dev Add new organisation.
  /// @param organisationAddress Ethereum address of organisation
  /// @param organisationName Name of organisation
  /// @param organisationPhone Phone number of organisation
  /// @param organisationLocation Location of organisation
  /// @param bagPrice Price of the bag in Wei.
  /// @param bagValue Value of the bag in Wei.
  /// @param bagDescription Short description of the bag contents.
  function addOrganisation(
    address organisationAddress,
    string memory organisationName,
    string memory organisationPhone,
    string memory organisationLocation,
    uint256 bagPrice,
    uint256 bagValue,
    string memory bagDescription
    ) public onlyOwner {
    require(!organisations[addressToIndex[organisationAddress]].valid, "Farechain2: Organisation is already registered");

    organisations.push(Organisation({
      organisationAddress: organisationAddress,
      organisationName: organisationName,
      organisationPhone: organisationPhone,
      organisationLocation: organisationLocation,
      bagPrice: bagPrice,
      bagValue: bagValue,
      bagDescription: bagDescription,
      totalBags: 0,
      valid: true
    }));

    addressToIndex[organisationAddress] = organisations.length - 1;
    totalOrganisations++;
  }

  /// @dev Remove organisation.
  /// @param organisationAddress Ethereum address of organisation
  function removeOrganisation(address organisationAddress) public onlyOwner {
    require(organisations[addressToIndex[organisationAddress]].valid, "Farechain2: Organisation address is not valid");

    delete organisations[addressToIndex[organisationAddress]];
    delete addressToIndex[organisationAddress];
    totalOrganisations--;
  }

  /// @dev Return array of all organisations. Will contain elements with
  ///   empty structs after deletions occur.
  function getOrganisations() public view returns (Organisation[] memory) {
    return organisations;
  }

  /// @dev Change price of bag.
  /// @param newPrice New price of bag in Wei
  function updateBagPrice(uint256 newPrice) public isOrganisation {
    organisations[addressToIndex[msg.sender]].bagPrice = newPrice;
  }

  /// @dev Change value of bag.
  /// @param newValue New value of bag in Wei
  function updateBagValue(uint256 newValue) public isOrganisation {
    organisations[addressToIndex[msg.sender]].bagValue = newValue;
  }

  /// @dev Change description of bag.
  /// @param newDescription New description of bag
  function updateBagDescription(string memory newDescription) public isOrganisation {
    organisations[addressToIndex[msg.sender]].bagDescription = newDescription;
  }

  /// @dev Update organisation's stock of bags.
  /// @param quantity Number of bags to be added
  function addBags(uint16 quantity) public isOrganisation {
    require(quantity != 0, "Farechain2: Cannot add zero bags");

    organisations[addressToIndex[msg.sender]].totalBags += quantity;
  }

  /// @dev Buy specified quantity of bags from organisation.
  /// @param organisationAddress Ethereum address of organisation
  /// @param quantity Number of bags to be purchased
  function buy(address organisationAddress, uint16 quantity) public payable {
    require(organisations[addressToIndex[organisationAddress]].valid, "Farechain2: Organisation address is not valid");
    require(quantity != 0, "Farechain2: Cannot purchase 0 bags");
    require(quantity <= organisations[addressToIndex[organisationAddress]].totalBags, "Farechain2: Not enough bags in stock");
    require(msg.value >= (organisations[addressToIndex[organisationAddress]].bagPrice * quantity), "Farechain2: Insufficient funds");

    uint256 sellerCut = (msg.value * 66) / 100;
    payable(organisationAddress).transfer(sellerCut);

    organisations[addressToIndex[organisationAddress]].totalBags -= quantity;
    emit Purchased(msg.sender, organisationAddress, quantity);
  }

  /// @dev Fallback function.
  receive() external payable {}
}