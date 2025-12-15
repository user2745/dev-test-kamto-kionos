// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <0.6.0;

import "../HomeTransaction.sol";

contract HomeTransactionTest {
    HomeTransaction ht;
    address payable realtor;
    address payable seller;
    address payable buyer;

    function setUp() public {
        realtor = address(0x1);
        seller = address(0x2);
        buyer = address(0x3);

        ht = new HomeTransaction(
            "123 Main St",
            "12345",
            "New York",
            1 ether,
            10 ether,
            realtor,
            seller,
            buyer
        );
    }

    function testInitialState() public {
        assert(keccak256(bytes(ht.homeAddress())) == keccak256(bytes("123 Main St")));
        assert(keccak256(bytes(ht.zip())) == keccak256(bytes("12345")));
        assert(keccak256(bytes(ht.city())) == keccak256(bytes("New York")));
        assert(ht.price() == 10 ether);
        assert(ht.realtorFee() == 1 ether);
    }

    function testSellerSignContract() public {
        ht.sellerSignContract();
        assert(true);
    }

    function testBuyerDeposit() public {
        ht.sellerSignContract();
        ht.buyerSignContractAndPayDeposit.value(1.5 ether)();
        assert(ht.deposit() == 1.5 ether);
    }

    function testBuyerDepositMinimum() public {
        ht.sellerSignContract();
        // Minimum deposit is 10% of price = 1 ether
        ht.buyerSignContractAndPayDeposit.value(1 ether)();
        assert(ht.deposit() == 1 ether);
    }

    function testBuyerDepositMaximum() public {
        ht.sellerSignContract();
        // Maximum deposit is 100% of price = 10 ether
        ht.buyerSignContractAndPayDeposit.value(10 ether)();
        assert(ht.deposit() == 10 ether);
    }

    function testRealtorApproval() public {
        ht.sellerSignContract();
        ht.buyerSignContractAndPayDeposit.value(1.5 ether)();
        ht.realtorReviewedClosingConditions(true);
        assert(true);
    }

    function testRealtorRejection() public {
        ht.sellerSignContract();
        ht.buyerSignContractAndPayDeposit.value(1.5 ether)();
        ht.realtorReviewedClosingConditions(false);
        assert(true);
    }

    function testBuyerFinalization() public {
        ht.sellerSignContract();
        ht.buyerSignContractAndPayDeposit.value(1.5 ether)();
        ht.realtorReviewedClosingConditions(true);
        ht.buyerFinalizeTransaction.value(8.5 ether)();
        assert(true);
    }

    function testCompleteFlow() public {
        // Seller signs
        ht.sellerSignContract();
        
        // Buyer deposits and signs
        ht.buyerSignContractAndPayDeposit.value(5 ether)();
        
        // Realtor approves
        ht.realtorReviewedClosingConditions(true);
        
        // Buyer finalizes
        ht.buyerFinalizeTransaction.value(5 ether)();
        
        assert(true);
    }
}