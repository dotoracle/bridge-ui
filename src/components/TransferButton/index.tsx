import { useState, useContext, useEffect } from 'react'
import { toast } from 'react-toastify'
import BridgeAppContext from 'context/BridgeAppContext'
import ToastMessage from '../ToastMessage'
import WalletModal from '../WalletModal'
import { useActiveWeb3React, useBridgeAddress, useBridgeContract, useNetworkInfo, useTokenBalanceCallback } from 'hooks'
import { StyledButton } from './styled'
import {
  CasperServiceByJsonRPC,
  CLPublicKey,
  CLValueBuilder,
  decodeBase16,
  DeployUtil,
  RuntimeArgs,
} from 'casper-js-sdk'
import { SafeEventEmitterProvider } from 'casper-js-sdk/dist/services/ProviderTransport'
import { contractSimpleGetter } from 'casper-js-client-helper/dist/helpers/lib'
import { toPlainString, toWei } from 'utils'
import BigNumber from 'bignumber.js'

interface TransferButtonProps {
  receipient: string
}

function TransferButton(props: TransferButtonProps): JSX.Element {
  const { receipient } = props
  const { selectedToken, targetNetwork, tokenAmount, setTokenAmount } = useContext(BridgeAppContext)
  const { account, chainId, library, connector } = useActiveWeb3React()

  const networkInfo = useNetworkInfo(chainId)

  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const [tokenBalance, setTokenBalance] = useState(0)
  const tokenBalanceCallback = useTokenBalanceCallback(
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

  const loadTokenBalance = async () => {
    setIsLoadingBalance(true)
    const _tokenBalance = await tokenBalanceCallback()
    setTokenBalance(_tokenBalance)
    setIsLoadingBalance(false)
  }

  useEffect(() => {
    loadTokenBalance()
  }, [account, chainId, selectedToken])

  const genRanHex = (size: number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')

  const onTransferERC20Token = async () => {
    try {
      setLoading(true)

      if (account && selectedToken && connector && networkInfo && bridgeContract) {
        const decimal = selectedToken ? selectedToken.decimals : 18
        const value = toWei(tokenAmount, decimal)

        // @ts-ignore
        const { torus } = connector
        const senderKey = CLPublicKey.fromHex(account)
        const casperService = new CasperServiceByJsonRPC(torus?.provider as SafeEventEmitterProvider)
        const contractHash = selectedToken.address
        const contractHashAsByteArray = decodeBase16(contractHash)
        const id = genRanHex(64).toLowerCase()
        const fee = await contractSimpleGetter(networkInfo.rpcURL, contractHash, ['swap_fee'])

        const deploy = DeployUtil.makeDeploy(
          new DeployUtil.DeployParams(senderKey, networkInfo?.key ?? 'casper-test', 1, 1800000),
          DeployUtil.ExecutableDeployItem.newStoredContractByHash(
            contractHashAsByteArray,
            'request_bridge_back',
            RuntimeArgs.fromMap({
              amount: CLValueBuilder.u256(toPlainString(value)),
              fee: CLValueBuilder.u256(fee),
              to_chainid: CLValueBuilder.u256(targetNetwork ? targetNetwork.chainId.toString() : '42'),
              receiver_address: CLValueBuilder.string(receipient),
              id: CLValueBuilder.string(id),
            }),
          ),
          DeployUtil.standardPayment(400000000),
        )

        const deployRes = await casperService.deploy(deploy)

        if (deployRes) {
          toast.success(
            <ToastMessage
              color="success"
              headerText="Success!"
              bodyText="Please wait a few minutes to see ERC20 token in your wallet"
            />,
            {
              toastId: 'onTransferToken',
            },
          )

          setTokenAmount(0)
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
              isLoading={isLoading || isLoadingBalance}
              isDisabled={tokenAmount <= 0 || tokenAmount > tokenBalance}
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
