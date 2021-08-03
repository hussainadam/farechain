// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Access control contract.
contract AccessControl {
  /*** EVENTS ***/

  /// @dev Emit when contract ownership changes.
  event ownershipTransferred(address indexed from, address indexed to);

  /*** MODIFIERS ***/

  /// @dev Functions with modifier can only be called by _owner.
  modifier onlyOwner {
    require(msg.sender == _owner, "AccessControl: Function only callable by contract owner");
    _;
  }

  /*** STORAGE ***/

  /// @dev Store address of contract owner.
  address private _owner;

  /*** FUNCTIONS ***/

  /// @dev Set _owner to transaction sender on contract deployment.
  constructor() {
    _owner = msg.sender;
    emit ownershipTransferred(address(0), _owner);
  }

  /// @dev Returns address of current contract owner.
  function owner() public view returns (address) {
    return _owner;
  }
  
  /// @dev Transfer ownership of contract.
  /// @param to Address of new owner. 
  function transferOwnership(address to) public onlyOwner {
    require(to != address(0), "AccessControl: Cannot transfer ownership to zero address");
    emit ownershipTransferred(_owner, to);
    _owner = to;
  }
}