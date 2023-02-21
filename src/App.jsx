import { useState, useEffect, useMemo } from "react";
import { AddressZero } from "@ethersproject/constants";
import {
  useAddress,
  useMetamask,
  useEditionDrop,
  useToken,
  useVote,
  useNetwork,
} from "@thirdweb-dev/react";
import { ChainId } from "@thirdweb-dev/sdk";

const App = () => {
  // Use the hooks thirdweb give us.
  const address = useAddress();
  const network = useNetwork();
  const connectWithMetamask = useMetamask();
  console.log("💯 Address:", address);

  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  // isClaiming keeps a loading state while the NFT is minting.

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [memberAddresses, setMemberAddresses] = useState([]);
  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  // the state of the amount of tokens each member has

  const vote = useVote("");
  // Vote ERC-20 from https://rinkeby.etherscan.io/address/0x813244Ca4AC13550F7411A5Cd40C29AF6Cb35BA5
  //  provides access to coded proposals

  const token = useToken("0x6CE8913B8139B44ea43C2509b0eEf03835fF6345");
  // ERC-20 from https://rinkeby.etherscan.io/address/0xeEe746dcE397378567039d845740D9bf28Fb399D

  const editionDrop = useEditionDrop(
    "0xc0FDE8e26e1cF78E9e0581D3cDB5d3b94FFAF34c"
  );
  // Initializing the editionDrop contract

  // shortening the wallet address with JavaScript substring() method
  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  
  
  
  
  
  
  
  import {useEffect, useMemo, useState} from "react";
import {ThirdwebSDK} from "@3rdweb/sdk";
import {useWeb3} from "@3rdweb/hooks";
import {ethers} from "ethers";

const sdk = new ThirdwebSDK("rinkeby");

const BUNDLE_DROP_ADDRESS = "0xc0FDE8e26e1cF78E9e0581D3cDB5d3b94FFAF34c";
const TOKEN_ADDRESS = "0x6CE8913B8139B44ea43C2509b0eEf03835fF6345";
const VOTING_ADDRESS = "0x223d1476320FAE207fe8DF1335d7e7Ed69d05f0e";

const bundleDropModule = sdk.getBundleDropModule(BUNDLE_DROP_ADDRESS);
const tokenModule = sdk.getTokenModule(TOKEN_ADDRESS);
const voteModule = sdk.getVoteModule(VOTING_ADDRESS);

const App = () => {
  const {connectWallet, address, error, provider} = useWeb3();
  console.log("👋 Address:", address)

  const signer = provider ? provider.getSigner() : undefined;
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
  const [memberAddresses, setMemberAddresses] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  useEffect(() => {
    if (!address) {
      return;
    }

    return bundleDropModule
      .balanceOf(address, "0")
      .then((balance) => {
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("✅🥱 this user is definitely bored!")
        } else {
          setHasClaimedNFT(false);
          console.log("🚫🥱 this user has way too many things to do!")
        }
      })
      .catch((error) => {
        setHasClaimedNFT(false);
        console.error("failed to nft balance", error);
      });
  }, [address]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    bundleDropModule
      .getAllClaimerAddresses("0")
      .then((addresess) => {
        console.log("🚀 Members addresses", addresess)
        setMemberAddresses(addresess);
      })
      .catch((err) => {
        console.error("failed to get member list", err);
      });
  }, [hasClaimedNFT]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    tokenModule
      .getAllHolderBalances()
      .then((amounts) => {
        console.log("👜 Amounts", amounts)
        setMemberTokenAmounts(amounts);
      })
      .catch((err) => {
        console.error("failed to get token amounts", err);
      });
  }, [hasClaimedNFT]);

  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          memberTokenAmounts[address] || 0,
          18,
        ),
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    voteModule
      .getAll()
      .then((proposals) => {
        setProposals(proposals);
        console.log("🌈 Proposals:", proposals)
      })
      .catch((err) => {
        console.error("failed to get proposals", err);
      });
  }, [hasClaimedNFT]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    if (!proposals.length) {
      return;
    }

    voteModule
      .hasVoted(proposals[0].proposalId, address)
      .then((hasVoted) => {
        setHasVoted(hasVoted);
        console.log("🥵 User has already voted")
      })
      .catch((err) => {
        console.error("failed to check if wallet has voted", err);
      });
  }, [hasClaimedNFT, proposals, address]);

  if (error && error.name === "UnsupportedChainIdError") {
    return (
      <div className="unsupported-network">
        <h2>Please connect to Rinkeby</h2>
        <p>
          This dapp only works on the Rinkeby network, please switch networks
          in your connected wallet.
        </p>
      </div>
    );
  }

  const mintNft = () => {
    setIsClaiming(true);
    bundleDropModule
      .claim("0", 1)
      .catch((err) => {
        console.error("failed to claim", err);
        setIsClaiming(false);
      })
      .finally(() => {
        setIsClaiming(false);
        setHasClaimedNFT(true);
        console.log(
          `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`
        );
      });
  }

  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to MCVDAO 🥱</h1>
        <button onClick={() => connectWallet("injected")} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>🥱 MCVDAO Member Page</h1>
        <p>Congratulations on being officially bored</p>
        <div>
          <div>
            <h2>Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>$BOREDOM Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div>
            <h2>Active Proposals</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                setIsVoting(true);

                const votes = proposals.map((proposal) => {
                  let voteResult = {
                    proposalId: proposal.proposalId,
                    vote: 2,
                  };
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + "-" + vote.type
                    );

                    if (elem.checked) {
                      voteResult.vote = vote.type;
                      return;
                    }
                  });
                  return voteResult;
                });

                try {
                  const delegation = await tokenModule.getDelegationOf(address);
                  if (delegation === ethers.constants.AddressZero) {
                    await tokenModule.delegateTo(address);
                  }
                  try {
                    await Promise.all(
                      votes.map(async (vote) => {
                        const proposal = await voteModule.get(vote.proposalId);
                        if (proposal.state === 1) {
                          return voteModule.vote(vote.proposalId, vote.vote);
                        }
                        return;
                      })
                    );
                    try {
                      await Promise.all(
                        votes.map(async (vote) => {
                          const proposal = await voteModule.get(
                            vote.proposalId
                          );

                          if (proposal.state === 4) {
                            return voteModule.execute(vote.proposalId);
                          }
                        })
                      );
                      setHasVoted(true);
                      console.log("successfully voted");
                    } catch (err) {
                      console.error("failed to execute votes", err);
                    }
                  } catch (err) {
                    console.error("failed to vote", err);
                  }
                } catch (err) {
                  console.error("failed to delegate tokens");
                } finally {
                  setIsVoting(false);
                }
              }}
            >
              {proposals.map((proposal, index) => (
                <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map((vote) => (
                      <div key={vote.type}>
                        <input
                          type="radio"
                          id={proposal.proposalId + "-" + vote.type}
                          name={proposal.proposalId}
                          value={vote.type}
                          defaultChecked={vote.type === 2}
                        />
                        <label htmlFor={proposal.proposalId + "-" + vote.type}>
                          {vote.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button disabled={isVoting || hasVoted} type="submit">
                {isVoting
                  ? "Voting..."
                  : hasVoted
                    ? "You Already Voted"
                    : "Submit Votes"}
              </button>
              <small>
                This will trigger multiple transactions that you will need to
                sign.
              </small>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mint-nft">
      <h1>Mint your free 🥱 MCVDAO Membership NFT</h1>
      <button
        disabled={isClaiming}
        onClick={() => mintNft()}
      >
        {isClaiming ? "Minting..." : "Mint your NFT (FREE)"}
      </button>
    </div>
  );
};

export default App;
