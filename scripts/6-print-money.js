import sdk from "./1-initialize-sdk.js";

const toAddress = "0xb67F379C9e7C7711563D5aA80bEEd9ed2D4652F8";

(async () => {
    try {
        // max token supply
        const amount = 2_000_000_000;
        // interact with the deployed ERC-20 contract and mint the tokens
        
        await contract.mintTo(toAddress, amount);
        
        const totalSupply = await token.totalSupply();

        // printing to the console how many tokens now exist
        console.log("💸 There are now ", totalSupply.displayValue, "$MCVD in circulation");  
    } catch (error){
        console.error("😿 Failed to print money", error);  
    }
})();

 
