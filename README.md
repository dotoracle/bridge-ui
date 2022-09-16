# How to Integrate Front-end Bridges

## Network Information
To use an existing Bridge, the first task is to retrieve the Bridge information. You can get the bridge address on a chain from this link:

https://raw.githubusercontent.com/dotoracle/evm-contract-lists/main/networks.json

---

## Supported Tokens
You can get the list of supported tokens on a chain from 2 links below

- [EVM Chain](https://raw.githubusercontent.com/dotoracle/evm-contract-lists/main/56.json) (for BSC Mainnet - chain id: 56). All supported networks in [this repo](https://github.com/dotoracle/evm-contract-lists)
- [Casper](https://github.com/dotoracle/casper-contract-hash/blob/master/config.json)

---
## Request Bridge

### EVM Chain
To request bridge on EVM Chain, you need to call the ```requestBridge``` method in the bridge contract
  For example:
  ```ts
  // use web3.js
  import Web3 from 'web3'
  import { toHex } from 'web3-utils'
  import { useWeb3React } from '@web3-react/core'

  const { account, library } = useWeb3React()
  const web3 = new Web3(library)

  // if the target network is a EVM chain
  let encoded = web3.eth.abi.encodeParameters(['string'], [account?.toLowerCase()])

  // If the target network is Casper
  // accountHash get from
  if (targetNetwork.notEVM) {
    encoded = web3.eth.abi.encodeParameters(['string'], [accountHash.toLowerCase()])
  }

  await bridgeContract.methods
    .requestBridge(
      tokenAddress,
      encoded,
      amount,
      targetNetwork.chainId
    )
    .send({
      chainId: toHex(sourceNetwork.chainId),
      from: account,
      value: amount,
    })
  ```
  For more details, please refer [this file](https://github.com/dotoracle/bridge-ui/blob/master/src/components/ActionButtons/index.tsx#L180).

---
### Casper Network
1. Install: ```casper-js-sdk``` ```casper-js-client-helper```

  ```
    yarn add casper-js-sdk
    yarn add casper-js-client-helper@https://github.com/dotoracle/casper-js-client-helper
  ```

2. Make a Deploy
   ```ts
    import {
      CasperClient,
      CasperServiceByJsonRPC,
      CLPublicKey,
      CLValueBuilder,
      decodeBase16,
      DeployUtil,
      RuntimeArgs,
    } from 'casper-js-sdk'
    import { SafeEventEmitterProvider } from 'casper-js-sdk/dist/services/ProviderTransport'
    import { contractSimpleGetter } from 'casper-js-client-helper/dist/helpers/lib'

    const senderKey = CLPublicKey.fromHex(account)

    // networkInfo: current network information
    const deployParams = new DeployUtil.DeployParams(senderKey, networkInfo?.key ?? 'casper-test', 1, 1800000)

    // selectedToken: token that you want to send
    const contractHash = selectedToken.address

    // contractHash: the contract hash that gets from this link (with the corresponding token): https://github.com/dotoracle/casper-contract-hash/blob/master/config.json
    const contractHashAsByteArray = decodeBase16(contractHash)

    // Get fee
    const fee = await contractSimpleGetter(networkInfo.rpcURL, contractHash, ['swap_fee'])

    const deploy = DeployUtil.makeDeploy(
      deployParams,
      DeployUtil.ExecutableDeployItem.newStoredContractByHash(
        contractHashAsByteArray,
        'request_bridge_back',
        RuntimeArgs.fromMap({
          amount: CLValueBuilder.u256(toPlainString(value)),
          fee: CLValueBuilder.u256(fee),
          to_chainid: CLValueBuilder.u256(targetNetwork.chainId.toString()),
          receiver_address: CLValueBuilder.string(receipient),
          id: CLValueBuilder.string(1),
        }),
      ),
      DeployUtil.standardPayment(400000000),
    )
   ```
3. Sign and Send Deploy
   ```ts
    const json = DeployUtil.deployToJson(deploy)
    const casperClient = new CasperClient(networkInfo.rpcURL)

    // Sign transaction using casper-signer.
    const signature = await window.casperlabsHelper.sign(json, account, account)
    const deployObject = DeployUtil.deployFromJson(signature)

    if (deployObject.val instanceof DeployUtil.Deploy) {
      deployRes = await casperClient.putDeploy(deployObject.val)
    }
   ```
4. For more details, please refer [this file](https://github.com/dotoracle/bridge-ui/blob/master/src/components/TransferButton/index.tsx#L79).

---

## API Endpoints

- Mainnet: https://bridge-mainnet.dotoracle.network/
- Testnet: https://api.dotoracle.network/

### Get transaction history of and account:
1. Get all transactions of an account: ```/transactions/account/chainId```. For example: https://api.dotoracle.network/transactions/0x00481E0dE32FecFF1C7ce3AF19cb03E01aFC0e48/42

2. Get all transactions from all accounts: ```/history[?limit=50&page=1/]```. For example: https://api.dotoracle.network/history/


---
## Claim assets on target chain (EVM chain)

```‼️ Please note, that you only need to claim assets on EVM chains. On Casper Network, our contract will mint & transfer tokens to the account hash that you have entered while requesting bridge success.```


1. This is JSON describing the transaction history, you can easily get all informations of a transaction.
   ```json
    "transactions": [
      {
        "_id": "631983cb526fa6fc80aff3b9",
        "fromChainId": 96945816564243,
        "index": 2,
        "originChainId": 42,
        "originToken": "0x1111111111111111111111111111111111111111",
        "toChainId": 42,
        "account": "0xe68485b880898b5c4cde29d40a588846a5ced582",
        "amount": "49000000000000000",
        "originSymbol": "",
        "requestBlock": 1078222,
        "requestHash": "0x9820cb3198499f57573321a59e8c2ca25413703ec23c1da6a91ac29d63c1d196",
        "requestTime": 1662616272,
        "txCreator": "account-hash-a769093d50eebe829668ce0116cf24da9f17dcfe223bac30e1c33967d5888c71",
        "originDecimals": 18
      },
    ]
   ```

2. Request Withdraw by sending a ```POST``` request to our API: ```/request-withdraw```.

   Params:

   ```requestHash```: request bridge transaction hash

   ```fromChainId```: source chain Id

   ```toChainId```: target chain Id

   ```index```: transaction index (get from API)

  You will get a signature that looks like this
   ```json
    {
      "r": "0xaa",
      "s": "0xbb",
      "v": "0xcc",
      "name": "BUSD",
      "symbol": "BUSD",
      "decimals": "18"
    }
   ```

3. Call ```claimToken``` method
  ```ts
    const chainIdData = [originChainId, fromChainId, toChainId, index]

    await bridgeContract.methods
      .claimToken(originToken, account, amount, chainIdData, requestHash, r, s, v, name, symbol, decimals)
      .send({
        chainId: toHex(toChainId),
        from: account,
      })
  ```
For more details, please refer [this file](https://github.com/dotoracle/bridge-ui/blob/master/src/components/TransactionsTable/index.tsx#L405).
