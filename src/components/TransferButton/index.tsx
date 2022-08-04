import { useState, useContext, useEffect } from 'react'
import { toast } from 'react-toastify'
import { EuiConfirmModal } from '@elastic/eui'
import BridgeAppContext from 'context/BridgeAppContext'
import ToastMessage from '../ToastMessage'
import WalletModal from '../WalletModal'
import { useActiveWeb3React, useBridgeAddress, useBridgeContract, useNetworkInfo, useTokenBalanceCallback } from 'hooks'
import { NetworkLogo, StyledButton, TokenAmount } from './styled'
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
import { toPlainString, toWei } from 'utils'
import { CasperSignerConnector } from '@dotoracle/web3-react-caspersigner-connector'
import { isAddress } from 'web3-utils'
import UnknownSVG from 'assets/images/unknown.svg'
import { NATIVE_TOKEN_ADDERSS } from '../../constants'
import Web3 from 'web3'

interface TransferButtonProps {
  receipient: string
  onRefresh: () => void
}

function TransferButton(props: TransferButtonProps): JSX.Element {
  const { receipient, onRefresh } = props
  const { selectedToken, sourceNetwork, targetNetwork, tokenAmount, setTokenAmount, ledgerAddress } =
    useContext(BridgeAppContext)
  const { account: web3Account, chainId: web3ChainId, library: web3Library, connector } = useActiveWeb3React()
  const [isValidAddress, setIsValidAddress] = useState(false)

  const account = ledgerAddress !== '' ? ledgerAddress : web3Account
  const chainId = ledgerAddress !== '' ? sourceNetwork?.chainId : web3ChainId

  const networkInfo = useNetworkInfo(chainId)
  const library = ledgerAddress !== '' ? new Web3.providers.HttpProvider(networkInfo?.rpcURL ?? '') : web3Library

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
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const bridgeAddress = useBridgeAddress(chainId)
  const bridgeContract = useBridgeContract(bridgeAddress)

  const originNetwork = useNetworkInfo(selectedToken?.originChainId)

  const loadTokenBalance = async () => {
    setIsLoadingBalance(true)
    const _tokenBalance = await tokenBalanceCallback()
    setTokenBalance(_tokenBalance)
    setIsLoadingBalance(false)
  }

  useEffect(() => {
    loadTokenBalance()
    setIsValidAddress(isAddress(receipient))
  }, [account, chainId, selectedToken, receipient])

  const genRanHex = (size: number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')

  const onTransferERC20Token = async () => {
    try {
      setLoading(true)

      if (account && selectedToken && connector && networkInfo && bridgeContract) {
        const decimal = selectedToken ? selectedToken.decimals : 18
        const value = toWei(tokenAmount, decimal)
        const senderKey = CLPublicKey.fromHex(account)
        const deployParams = new DeployUtil.DeployParams(senderKey, networkInfo?.key ?? 'casper-test', 1, 1800000)
        const contractHash = selectedToken.address
        const contractHashAsByteArray = decodeBase16(contractHash)
        const id = genRanHex(64).toLowerCase()
        const fee = await contractSimpleGetter(networkInfo.rpcURL, contractHash, ['swap_fee'])
        let deployRes

        const deploy = DeployUtil.makeDeploy(
          deployParams,
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

        if (connector instanceof CasperSignerConnector) {
          const json = DeployUtil.deployToJson(deploy)
          const casperClient = new CasperClient(networkInfo.rpcURL)

          // Sign transcation using casper-signer.
          const signature = await window.casperlabsHelper.sign(json, account, account)
          const deployObject = DeployUtil.deployFromJson(signature)

          if (deployObject.val instanceof DeployUtil.Deploy) {
            deployRes = await casperClient.putDeploy(deployObject.val)
          }
        } else {
          // @ts-ignore
          const { torus } = connector
          const casperService = new CasperServiceByJsonRPC(torus?.provider as SafeEventEmitterProvider)
          deployRes = await casperService.deploy(deploy)
        }

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

          loadTokenBalance()
          setTokenAmount(0)
        } else {
          toast.error(<ToastMessage color="danger" headerText="Error!" bodyText="Invalid signature" />, {
            toastId: 'onTransferToken',
          })
          setLoading(false)
        }

        onRefresh()
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

  const onOpenConfirmModal = () => {
    setLoading(true)

    if (
      selectedToken &&
      originNetwork &&
      targetNetwork &&
      selectedToken.originContractAddress == NATIVE_TOKEN_ADDERSS &&
      originNetwork.chainId != targetNetwork.chainId
    ) {
      setShowConfirmModal(true)
    } else {
      onTransferERC20Token()
    }
  }

  const onCancelTransfer = () => {
    setShowConfirmModal(false)
    setLoading(false)
  }

  return (
    <>
      {account ? (
        <>
          {selectedToken ? (
            <StyledButton
              fill
              isLoading={isLoading || isLoadingBalance}
              isDisabled={tokenAmount <= 0 || tokenAmount > tokenBalance || !isValidAddress}
              onClick={onOpenConfirmModal}
            >
              {isValidAddress
                ? tokenAmount > 0 && tokenAmount <= tokenBalance
                  ? `Transfer ${selectedToken.symbol} to bridge`
                  : 'Insufficient balance'
                : 'Invalid receipient address'}
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
      {showConfirmModal &&
        selectedToken &&
        tokenAmount > 0 &&
        originNetwork &&
        sourceNetwork &&
        targetNetwork &&
        selectedToken.originContractAddress == NATIVE_TOKEN_ADDERSS &&
        originNetwork.chainId != targetNetwork.chainId && (
          <EuiConfirmModal
            title="Note!"
            onCancel={onCancelTransfer}
            onConfirm={onTransferERC20Token}
            cancelButtonText="No, don't do it"
            confirmButtonText="Yes, do it"
          >
            <>
              <p style={{ lineHeight: 2 }}>
                You are transfering{' '}
                <TokenAmount>
                  {tokenAmount} {selectedToken.symbol}
                </TokenAmount>{' '}
                from{' '}
                <strong>
                  <NetworkLogo src={sourceNetwork.logoURI ? sourceNetwork.logoURI : UnknownSVG}></NetworkLogo>
                  {sourceNetwork.name}
                </strong>{' '}
                to{' '}
                <strong>
                  <NetworkLogo src={targetNetwork.logoURI ? targetNetwork.logoURI : UnknownSVG}></NetworkLogo>
                  {targetNetwork.name}
                </strong>
                .
                <br />
                This token was deployed originally on
                <strong>
                  <NetworkLogo src={originNetwork.logoURI ? originNetwork.logoURI : UnknownSVG}></NetworkLogo>
                  {originNetwork.name}
                </strong>
                , you will receive DotOracle Wrapped {originNetwork.nativeCurrency.symbol} on
                <strong>
                  <NetworkLogo src={targetNetwork.logoURI ? targetNetwork.logoURI : UnknownSVG}></NetworkLogo>
                  {targetNetwork.name}
                </strong>
                . Do you want to continue?
              </p>
            </>
          </EuiConfirmModal>
        )}
    </>
  )
}

export default TransferButton
