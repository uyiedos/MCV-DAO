import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
  try {
    const editionDrop = await sdk.getContract("0xc0FDE8e26e1cF78E9e0581D3cDB5d3b94FFAF34c", "edition-drop");
    await editionDrop.createBatch([
      {
        name: "MCV DAO MEMBERSHIP NFT",
        description: "This NFT will give you access to MCVDAO. My Crypto Ventures Dao is a completely decentral organisation with one passion.!",
        image: readFileSync("scripts/assets/mcvdaoNFT.png"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})();
