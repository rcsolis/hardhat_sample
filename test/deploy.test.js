const hre = require("hardhat");
const { assert, expect } = require("chai");

describe("SimpleStorage Test", function () {
    let simpleStorageContract;

    beforeEach(async function () {
        const simpleStorageFactory = await hre.ethers.getContractFactory("SimpleStorage");
        simpleStorageContract = await simpleStorageFactory.deploy();
        simpleStorageContract.deployTransaction.wait(1);
    });

    it("Should amount start with 0", async function () {
        const currentAmount = await simpleStorageContract.getAmount();
        const expectedAmount = "0";
        assert.equal(currentAmount.toString(), expectedAmount, "Amount should start with 0");
        
    });

    it("Should update to 100 if we call setData with 100", async function () {
        const expectedAmount = "100";
        const tx = await simpleStorageContract.setAmount(parseInt(expectedAmount));
        await tx.wait(1);
        const currentAmount = await simpleStorageContract.getAmount();
        expect(currentAmount.toString()).to.equal(expectedAmount, "Amount should be 100");
        
    });
});
