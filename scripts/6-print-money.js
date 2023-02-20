import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    // This is the address of our ERC-20 contract printed out in the step before.
    const token = await sdk.getContract("0x6CE8913B8139B44ea43C2509b0eEf03835fF6345", "MCVD");
    // What's the max supply you want to set? 1,000,000 is a nice number!
    const amount = 2_000_000_000;
    // Interact with your deployed ERC-20 contract and mint the tokens!
    await token.mint(amount);
    const totalSupply = await token.totalSupply();

    // Print out how many of our token's are out there now!
    console.log("✅ There now is", totalSupply.displayValue, "MCVD in circulation");
  } catch (error) {
    console.error("Failed to print money", error);
  }
})();
