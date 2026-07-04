import pkg from 'casper-js-sdk';
const { RpcClient, HttpHandler } = pkg;

async function main() {
  const rpcUrl = 'https://node.testnet.casper.network/rpc';
  const handler = new HttpHandler(rpcUrl);
  const client = new RpcClient(handler);
  
  const contractHash = 'account-hash-a0adde2b070c95cf37f8ee2a2ce7e0745a15ad4694635177b53d4a192710865e';
  
  try {
    const statusRes = await client.getStatus();
    console.log("Ledger Connection: ONLINE (Node Version:", statusRes.apiVersion, ")");
    
    console.log("Requesting Global State Root Hash for Contract:", contractHash);
    const latestRootHash = await client.getStateRootHashLatest();
    console.log("Latest State Root Hash:", latestRootHash);
    
    let maxRisk = 40;
    let minFico = 650;
    
    try {
      const riskResult = await client.queryLatestGlobalState(contractHash, ['max_risk_barrier']);
      console.log("riskResult:", riskResult);
    } catch (err) {
      console.log("risk query failed (expected):", err.message);
    }
    
    try {
      const ficoResult = await client.queryLatestGlobalState(contractHash, ['minimum_fico']);
      console.log("ficoResult:", ficoResult);
    } catch (err) {
      console.log("fico query failed (expected):", err.message);
    }
    
    console.log("Completed without crash!");
  } catch (error) {
    console.error("CRASH:", error);
  }
}

main();
