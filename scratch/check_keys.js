import pkg from 'casper-js-sdk';
const { RpcClient, HttpHandler } = pkg;

async function main() {
  const rpcUrl = 'https://node.testnet.casper.network/rpc';
  const handler = new HttpHandler(rpcUrl);
  const client = new RpcClient(handler);
  
  const accountHash = 'account-hash-a0adde2b070c95cf37f8ee2a2ce7e0745a15ad4694635177b53d4a192710865e';
  
  try {
    console.log("Getting state root hash...");
    const stateRootHash = await client.getStateRootHashLatest();
    
    console.log("Querying account info / named keys...");
    const result = await client.queryLatestGlobalState(accountHash, []);
    console.log("rawJSON:", JSON.stringify(result.rawJSON, null, 2));
  } catch (error) {
    console.error("Error querying Casper:", error);
  }
}

main();
