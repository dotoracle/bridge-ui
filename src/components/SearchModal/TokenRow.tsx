import { useEffect, useRef, useState, useContext } from 'react'
import { EuiExpression, EuiButtonIcon, EuiIcon, EuiLoadingContent } from '@elastic/eui'
import styled from 'styled-components/macro'
import Token from '../../type/Token'
import UnknownSVG from '../../assets/images/unknown.svg'
import { useActiveWeb3React, useIsUserAddedToken, useNetworkInfo, useTokenBalanceCallback } from '../../hooks'
import { formatNumber } from '../../utils'
import BridgeAppContext from 'context/BridgeAppContext'
import Web3 from 'web3'

const Row = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) minmax(0px, 72px);
  gap: 16px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 5px 15px;
  min-height: 56px;
  cursor: pointer;

  &:hover {
    background-color: #2c2f36;
  }

  &.disabled {
    opacity: 0.3;

    .token-name-wrap {
      cursor: initial;
    }
  }
`
const TokenLogo = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 100%;
`
const TokenName = styled.span`
  display: block;
  margin-top: 10px;
  font-size: 12px;
  line-height: 1.2;
  color: #6c7284;

  a {
    text-decoration: underline;
    color: #6c7284;

    &:hover {
      color: #fff;
    }
  }
`
const Balance = styled(EuiExpression)`
  text-align: right;
`
const RemoveButton = styled(EuiButtonIcon)`
  position: absolute;
  top: -2px;
  right: -5px;
  background-color: transparent !important;

  svg {
    width: 12px;
    height: 12px;
  }
`

interface ITokenRow {
  token: Token
  isSelected: boolean
  onSelect: () => void
  onRemoveCustomToken: () => void
}

function TokenRow(props: ITokenRow): JSX.Element {
  const { token, isSelected, onSelect, onRemoveCustomToken } = props
  const { sourceNetwork, ledgerAddress } = useContext(BridgeAppContext)
  const { account: web3Account, chainId: web3ChainId, library: web3Library } = useActiveWeb3React()

  const account = ledgerAddress !== '' ? ledgerAddress : web3Account
  const chainId = ledgerAddress !== '' ? sourceNetwork?.chainId : web3ChainId

  const networkInfo = useNetworkInfo(chainId)
  const library = ledgerAddress !== '' ? new Web3.providers.HttpProvider(networkInfo?.rpcURL ?? '') : web3Library

  const isAdded = useIsUserAddedToken(token)
  const currentNetwork = useNetworkInfo(chainId)

  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const [tokenBalance, setTokenBalance] = useState(0)
  const tokenBalanceCallback = useTokenBalanceCallback(token.address, token.decimals, account, library, 0, networkInfo)

  const componentMounted = useRef(true)

  const loadTokenBalance = async () => {
    setIsLoadingBalance(true)
    const _tokenBalance = await tokenBalanceCallback()
    setTokenBalance(_tokenBalance)
    setIsLoadingBalance(false)
  }

  useEffect(() => {
    if (componentMounted.current) {
      loadTokenBalance()
    }

    return () => {
      componentMounted.current = false
    }
  }, [account, chainId])

  const handleRemoveCustomToken = () => {
    let _tokens = [] as Token[]
    const data = localStorage.getItem(`tokens_${account}_${chainId}`)

    if (data) {
      _tokens = JSON.parse(data) as Token[]
    }

    if (token) {
      const _newTokens = _tokens.filter(t => t.address !== token.address)
      localStorage.setItem(`tokens_${account}_${chainId}`, JSON.stringify(_newTokens))
    }
  }

  return (
    <Row className={isSelected ? 'disabled' : ''} onClick={() => (isSelected ? null : onSelect())}>
      <TokenLogo src={token.logoURI ? token.logoURI : UnknownSVG} alt={token.name} />
      <div className="token-name-wrap">
        <p>{token.symbol}</p>
        {isAdded ? (
          <TokenName>
            <span>Added by user • </span>
            {currentNetwork ? (
              <a
                href={`${currentNetwork.explorer}/address/${token.address}`}
                target="_blank"
                rel="noopener nofollow noreferrer"
              >
                {token.name} <EuiIcon size="s" type="popout" />
              </a>
            ) : (
              <span>{token.name}</span>
            )}
          </TokenName>
        ) : (
          <TokenName>{token.name}</TokenName>
        )}
      </div>
      {tokenBalance >= 0 ? (
        <>
          {isLoadingBalance ? (
            <EuiLoadingContent lines={1} />
          ) : (
            <Balance description={formatNumber(tokenBalance)} textWrap="truncate" color="subdued" />
          )}
        </>
      ) : (
        <Balance description="" />
      )}
      {isAdded && (
        <RemoveButton
          aria-label="Remove Token"
          iconType="cross"
          color="danger"
          onClick={() => {
            handleRemoveCustomToken()
            onRemoveCustomToken()
          }}
        />
      )}
    </Row>
  )
}

export default TokenRow
