import pkg from 'casper-js-sdk';
const { RpcClient, HttpHandler } = pkg;

async function main() {
  const rpcUrl = 'https://node.testnet.casper.network/rpc';
  const handler = new HttpHandler(rpcUrl);
  const client = new RpcClient(handler);
  
  const contractHash = 'hash-00d1b41e16fa7423d402d1e390cf2e7c66688ddc4f3edafa601c7ca7778ba4cc';
  
  try {
    const rootHash = await client.getStateRootHashLatest();
    console.log("Root Hash:", rootHash);
    
    console.log("Querying max_risk_barrier...");
    const result = await client.queryLatestGlobalState(contractHash, ['max_risk_barrier']);
    console.log("max_risk_barrier result keys:", Object.keys(result));
    console.log("storedValue:", JSON.stringify(result.storedValue, null, 2));
    console.log("rawJSON:", JSON.stringify(result.rawJSON, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
