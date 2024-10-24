// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Test.sol";


contract TestContract is Test {
    address public skillVerifyAddress;

    function setup() public {
        skillVerifyAddress = address(0x123);
    }
}
