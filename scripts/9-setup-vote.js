import sdk from "./1-initialize-sdk.js";

// the governance contract 
const vote = sdk.getVote("0x813244Ca4AC13550F7411A5Cd40C29AF6Cb35BA5");

// the ERC-20 contract
const token = sdk.getToken("0xeEe746dcE397378567039d845740D9bf28Fb399D");

(async () => {
    try {
        // giving the treasury power to mint more if or as needed
        await token.roles.grant("minter", vote.getAddress());

        console.log(
            "Successfully gave voting contract permission to act on the token contract"
        );
    } catch (error) {
        console.error(
            "Failed to grant voting contract permissions on the token contract",
            error
        );
        process.exit(1);
    }
    try {
        // grab the wallet's token balance because it's all owned by the minter currently
        const ownedTokenBalance = await token.balanceOf(
            process.env.WALLET_ADDRESS
        );

        // Reference 70% of the supply currently held
        const ownedAmount = ownedTokenBalance.displayValue;
        const percent70 = Number(ownedAmount) / 100 * 70;

        // transfer 70% of the supply to the voting contract
        await token.transfer(
            vote.getAddress(),
            percent70
        );

        console.log("Successfully transferred" + percent70 + " tokens to the voting contract");
    } catch (err) {
        console.error("Failed to transfer tokens to the voting contract", err);
    }
})();
