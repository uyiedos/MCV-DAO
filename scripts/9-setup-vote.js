
import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    // This is our governance contract.
    const vote = await sdk.getContract(
      "0xeBe3F8c2a84A87ca6e3F497f16B52A5fb59760DA",
      "vote"
    );
    // This is our ERC-20 contract.
    const token = await sdk.getContract(
      "0x6CE8913B8139B44ea43C2509b0eEf03835fF6345",
      "token"
    );
    // Give our treasury the power to mint additional token if needed.
    await token.roles.grant("minter", vote.getAddress());

    console.log(
      "Successfully gave vote contract permissions to act on token contract"
    );
  } catch (error) {
    console.error(
      "failed to grant vote contract permissions on token contract",
      error
    );
    process.exit(1);
  }

  try {
    // This is our governance contract.
    const vote = await sdk.getContract(
      "0xeBe3F8c2a84A87ca6e3F497f16B52A5fb59760DA",
      "vote"
    );
    // This is our ERC-20 contract.
    const token = await sdk.getContract(
      "0x6CE8913B8139B44ea43C2509b0eEf03835fF6345",
      "token"
    );
    // Grab our wallet's token balance, remember -- we hold basically the entire supply right now!
    const ownedTokenBalance = await token.balanceOf(process.env.WALLET_ADDRESS);

    // Grab 50% of the supply that we hold.
    const ownedAmount = ownedTokenBalance.displayValue;
    const percent50 = (Number(ownedAmount) / 100) * 50;

    // Transfer 50% of the supply to our voting contract.
    await token.transfer(vote.getAddress(), percent50);

    console.log(
      "Successfully transferred " + percent50 + " tokens to vote contract"
    );
  } catch (err) {
    console.error("failed to transfer tokens to vote contract", err);
  }
})();
