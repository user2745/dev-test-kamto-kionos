// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <0.6.0;

import "../Factory.sol";
import "../HomeTransaction.sol";

contract FactoryTest {
    Factory factory;

    function setUp() public {
        factory = new Factory();
    }

    function testCreateHomeTransaction() public {
        address payable seller = address(0x2);
        address payable buyer = address(0x3);

        HomeTransaction ht = factory.create(
            "123 Main St",
            "12345",
            "New York",
            1 ether,
            10 ether,
            seller,
            buyer
        );

        assert(ht.realtor() != address(0));
        assert(ht.seller() == seller);
        assert(ht.buyer() == buyer);
        assert(keccak256(bytes(ht.homeAddress())) == keccak256(bytes("123 Main St")));
    }

    function testGetInstanceCount() public {
        assert(factory.getInstanceCount() == 0);
        
        factory.create(
            "123 Main St",
            "12345",
            "New York",
            1 ether,
            10 ether,
            address(0x2),
            address(0x3)
        );
        
        assert(factory.getInstanceCount() == 1);
    }

    function testGetInstance() public {
        HomeTransaction ht = factory.create(
            "456 Oak Ave",
            "67890",
            "Boston",
            2 ether,
            20 ether,
            address(0x2),
            address(0x3)
        );

        HomeTransaction retrieved = factory.getInstance(0);
        assert(address(retrieved) == address(ht));
    }

    function testMultipleInstances() public {
        factory.create("123 Main St", "12345", "New York", 1 ether, 10 ether, address(0x2), address(0x3));
        factory.create("456 Oak Ave", "67890", "Boston", 2 ether, 20 ether, address(0x4), address(0x5));
        
        assert(factory.getInstanceCount() == 2);
    }
}
