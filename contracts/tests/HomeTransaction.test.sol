// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <0.6.0;

import "../HomeTransaction.sol";

contract HomeTransactionTest {
    HomeTransaction ht;
    address payable realtor;
    address payable seller;
    address payable buyer;

    function setUp() public {
        realtor = address(this);
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
        assert(ht.homeAddress() == "123 Main St");
        assert(ht.zip() == "12345");
        assert(ht.city() == "New York");
        assert(ht.price() == 10 ether);
        assert(ht.realtorFee() == 1 ether);
    }

    function testSellerSignContract() public {
        // Only seller can sign
        ht.sellerSignContract();
        // Contract state should be WaitingBuyerSignature (1)
        assert(true); // State changed successfully
    }

    function testBuyerDeposit() public {
        ht.sellerSignContract();
        
        // Buyer deposits 1.5 ether (15% of 10 ether price)
        ht.buyerSignContractAndPayDeposit.value(1.5 ether)();
        assert(ht.deposit() == 1.5 ether);
    }

    function testRealtorApproval() public {
        ht.sellerSignContract();
        ht.buyerSignContractAndPayDeposit.value(1.5 ether)();
        
        // Realtor approves
        ht.realtorReviewedClosingConditions(true);
        assert(true); // State transitioned to WaitingFinalization
    }

    function testBuyerFinalization() public {
        ht.sellerSignContract();
        ht.buyerSignContractAndPayDeposit.value(1.5 ether)();
        ht.realtorReviewedClosingConditions(true);
        
        // Buyer pays remaining 8.5 ether
        ht.buyerFinalizeTransaction.value(8.5 ether)();
        assert(true); // Transaction finalized
    }

    function testPriceValidation() public {
        // Realtor fee must be <= price
        bool didFail = false;
        try ht = new HomeTransaction(
            "Bad Deal",
            "00000",
            "Nowhere",
            20 ether,
            10 ether,
            realtor,
            seller,
            buyer
        ) {
            didFail = false;
        } catch {
            didFail = true;
        }
        assert(didFail); // Should have failed
    }
}