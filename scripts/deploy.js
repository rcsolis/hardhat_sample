const hre = require("hardhat");

function main() {
    return new Promise(async (resolve, reject) => {
        try {
            // Shows current network data
            console.log("Current Network:", hre.network.name, hre.network.config.chainId);
            // Create and deploy contract
            const SimpleStorageFactory = await hre.ethers.getContractFactory("SimpleStorage");
            console.log("Deploying contract ...");
            const simpleStorageContract = await SimpleStorageFactory.deploy();
            await simpleStorageContract.deployed();
            console.log("Contract deployed to:", simpleStorageContract.address);
            // Verify contract if we are deploying to Goerli
            if (
                process.env.ETHERSCAN_API_KEY &&
                hre.network.name.toLowerCase() === "goerli" &&
                hre.network.config.chainId === process.env.GOERLI_CHAIN_ID
            ) {
                await simpleStorageContract.deployTransaction.wait(6);
                await verifyUsingEtherscan(simpleStorageContract.address, []);
            }
            // Get contract value
            const currentValue = await simpleStorageContract.getAmount();
            console.log("Current value:", currentValue.toString());
            // Update contract value
            const newValue = 100;
            const tx = await simpleStorageContract.setAmount(newValue);
            await tx.wait(1);
            const updatedValue = await simpleStorageContract.getAmount();
            console.log("Updated value:", updatedValue.toString());
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

function verifyUsingEtherscan(contractAddress, contractArgs) {
    return new Promise(async (resolve, reject) => {
        console.log("Verifying contract using Etherscan ...");
        try {
            // Execute verify:verify task
            await hre.run("verify:verify", {
                address: contractAddress,
                constructorArguments: contractArgs,
            });
            console.log("Contract verified");
            resolve();
        } catch (err) {
            if (err.message.toLowerCase().includes("already verified")) {
                console.log("Contract already verified");
                resolve();
            } else {
                console.error(err);
                reject(err);
            }
        }
    });
}

main()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
