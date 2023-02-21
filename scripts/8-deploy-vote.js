import sdk from './1-initialize-sdk.js';

(async () => {
    try {
        const voteContractAddress = await sdk.deployer.deployVote({
            // Giving the governance contract a name
            name: "MCV DAO Governance Contract",

            // assigning the location property of the governance token (hint it's @ the ERC-20 contract address) 
            voting_token_address: "0xeEe746dcE397378567039d845740D9bf28Fb399D",
            voting_delay_in_blocks: 0,
            // 1 day = 6570 blocks
            voting_period_in_blocks: 6570,
            voting_quorum_fraction: 0,
        proposal_token_threshold: 0,
        });

        console.log("Successfully deployed vote contract, address:",
        voteContractAddress,
        );
    } catch (err){
        console.error("Failed to deploy vote contract.", err);
    }
})();
