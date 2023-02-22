 import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    // address of our ERC-20 contract printed out in the step before.
    const token = await sdk.getContract(
      "0x6CE8913B8139B44ea43C2509b0eEf03835fF6345",
      "token"
    );
    // max supply
    const amount = 1_000_000;
    // mint tokens
    await token.mint(amount);
    const totalSupply = await token.totalSupply();

    // Print out how many of our token's are out there now!
    console.log("There are", totalSupply.displayValue, "FOM in circulation");
  } catch (error) {
    console.error("Failed to print money", error);
  }
})();
