import { useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { ERC20Client } from 'casper-erc20-js-client'
import BridgeAppContext from 'context/BridgeAppContext'
import ToastMessage from '../ToastMessage'
import WalletModal from '../WalletModal'
import { useActiveWeb3React, useBridgeAddress, useBridgeContract, useTokenBalance, useNetworkInfo } from 'hooks'
import { StyledButton } from './styled'
import { toWei } from 'utils'
import { NativeTokenAddress } from '../../constants'
import {
  CasperServiceByJsonRPC,
  CLPublicKey,
  CLValueBuilder,
  decodeBase16,
  DeployUtil,
  RuntimeArgs,
  verifyMessageSignature,
} from 'casper-js-sdk'
import { SafeEventEmitterProvider } from 'casper-js-sdk/dist/services/ProviderTransport'

function TransferButton(): JSX.Element {
  const { selectedToken, targetNetwork, tokenAmount } = useContext(BridgeAppContext)
  const { account, chainId, library, connector } = useActiveWeb3React()

  const networkInfo = useNetworkInfo(chainId)

  const tokenBalance = useTokenBalance(
    selectedToken ? selectedToken.address : undefined,
    selectedToken ? selectedToken.decimals : undefined,
    account,
    library,
    tokenAmount,
    networkInfo,
  )

  const [showWalletModal, setShowWalletModal] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const bridgeAddress = useBridgeAddress(chainId)
  const bridgeContract = useBridgeContract(bridgeAddress)

  const onTransferERC20Token = async () => {
    try {
      setLoading(true)

      if (account && selectedToken && connector && networkInfo && bridgeContract) {
        const amountInWei = toWei(tokenAmount, selectedToken.decimals)
        const value = '10000000000000000'

        // if (selectedToken.address === NativeTokenAddress) {
        //   value = amountInWei.toNumber()
        // }

        // @ts-ignore
        const { torus } = connector
        const erc20 = new ERC20Client(networkInfo.rpcURL, networkInfo.key ?? '', networkInfo.eventStream)
        await erc20.setContractHash(selectedToken.address ?? '')

        const _deploy = await erc20.createUnsignedRequestBridgeBack(
          CLPublicKey.fromHex(account),
          value.toString(),
          targetNetwork ? targetNetwork.chainId.toString() : '42',
          '0x00481E0dE32FecFF1C7ce3AF19cb03E01aFC0e48',
          '2000000000',
        )

        // const AMOUNT_TO_TRANSFER = 2000000000000
        // // Time interval in milliseconds after which deploy will not be processed by a node.
        // const DEPLOY_TTL_MS = 1800000
        // const DEPLOY_GAS_PAYMENT = 200000000000
        // const receiverCLPubKey = CLPublicKey.fromHex(
        //   '02036d0a481019747b6a761651fa907cc62c0d0ebd53f4152e9f965945811aed2ba8',
        // )
        // const senderKey = CLPublicKey.fromHex(account)
        // const casperService = new CasperServiceByJsonRPC(torus?.provider as SafeEventEmitterProvider)
        // const contractHash = '9EccB15D2001D57c971185D05be97Ac43C2E2bDA5ACd13D47d681B23a0A5979b'
        // const contractHashAsByteArray = decodeBase16(selectedToken.address ?? '')
        // const deploy = DeployUtil.makeDeploy(
        //   new DeployUtil.DeployParams(CLPublicKey.fromHex(account), 'casper-test', 1, DEPLOY_TTL_MS),
        //   DeployUtil.ExecutableDeployItem.newStoredContractByHash(
        //     contractHashAsByteArray,
        //     'request_bridge_back',
        //     RuntimeArgs.fromMap({
        //       amount: CLValueBuilder.u256(AMOUNT_TO_TRANSFER),
        //       recipient: CLValueBuilder.byteArray(receiverCLPubKey.toAccountHash()),
        //     }),
        //   ),
        //   DeployUtil.standardPayment(DEPLOY_GAS_PAYMENT),
        // )

        // console.log('deploy', deploy)
        // console.log('_deploy', _deploy)
        console.log(JSON.stringify(_deploy.deploy))
        console.log(DeployUtil.deployToJson(_deploy.deploy))
        // console.log(DeployUtil.deployToJson(_deploy.deploy))
        // console.log(DeployUtil.deployFromJson({ deploy: JSON.stringify(_deploy) }))

        // // const torus = new Torus()
        // console.log(_deploy.hash)
        const message = Buffer.from(_deploy.hashToSign).toString('hex') // _deploy.hashToSign // Buffer.from(_deploy.hashToSign).toString('hex')
        const res = await torus?.signMessage({
          message,
          from: account,
        })

        console.log(message)

        if (res?.signature) {
          // const pubKey = CLPublicKey.fromHex(account)
          // const isVerified = verifyMessageSignature(pubKey, message, res?.signature)
          // console.log(res?.signature)
          // if (isVerified) {
          // await erc20.putSignatureAndSend({
          //   publicKey: pubKey,
          //   deploy: deploy,
          //   signature: res?.signature,
          //   nodeAddress: networkInfo.rpcURL,
          // })
          // }
        } else {
          toast.error(<ToastMessage color="danger" headerText="Error!" bodyText="Invalid signature" />, {
            toastId: 'onTransferToken',
          })
          setLoading(false)
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // we only care if the error is something _other_ than the user rejected the tx
      if (error?.code !== 4001) {
        const message = `Could not transfer this token to our bridge. Please try again.`
        toast.error(<ToastMessage color="danger" headerText="Error!" bodyText={message} />, {
          toastId: 'onTransferToken',
        })
      }
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {account ? (
        <>
          {selectedToken ? (
            <StyledButton
              fill
              isLoading={isLoading}
              // isDisabled={tokenAmount <= 0 || tokenAmount > tokenBalance}
              onClick={onTransferERC20Token}
            >
              Transfer {selectedToken.symbol} to bridge
            </StyledButton>
          ) : (
            <StyledButton fill isDisabled>
              Select a token to transfer
            </StyledButton>
          )}
        </>
      ) : (
        <>
          <StyledButton fill onClick={() => setShowWalletModal(true)}>
            Unlock Wallet
          </StyledButton>
          {showWalletModal && <WalletModal closeModal={() => setShowWalletModal(false)} />}
        </>
      )}
    </>
  )
}

export default TransferButton
