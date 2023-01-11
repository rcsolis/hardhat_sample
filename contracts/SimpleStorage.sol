// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract SimpleStorage {
    uint256 internal amount;
    
    function setAmount(uint256 _amount) public {
        amount = _amount;
    }

    function getAmount() public view returns (uint256) {
        return amount;
    }
}