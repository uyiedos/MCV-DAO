import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    const token = await sdk.getContract(
      "0x6CE8913B8139B44ea43C2509b0eEf03835fF6345",
      "token"
    );
    //log the curent roles
    const allRoles = await token.roles.getAll();

    console.log("Roles that exist right now: ", allRoles);

    //revoke all power that my wallet has over the erc20
    await token.roles.setAll({ admin: [], minter: [] });
    console.log("Roles after revoking ourselves", await token.roles.getAll());
    console.log("Succesfully revoked authority from erc20");
  } catch (error) {
    console.error("Failed to revoke power from the dao treasury", error);
  }
})();
