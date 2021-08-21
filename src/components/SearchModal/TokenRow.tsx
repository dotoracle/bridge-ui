import { EuiExpression, EuiButtonIcon, EuiIcon } from '@elastic/eui'
import styled from 'styled-components'
import Token from '../../type/Token'
import UnknownSVG from '../../assets/images/unknown.svg'
import { useTokenBalance, useActiveWeb3React, useIsUserAddedToken, useNetworkInfo } from '../../hooks'
import { formatNumber } from '../../utils'

const Row = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) minmax(0px, 72px);
  gap: 16px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 5px 15px;
  height: 56px;

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
const TokenNameWrap = styled.div`
  cursor: pointer;
`
const TokenName = styled.span`
  display: block;
  margin-top: 10px;
  font-size: 12px;
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
  const { account, chainId, library } = useActiveWeb3React()
  const tokenBalance = useTokenBalance(token.address, token.decimals, account, library)
  const isAdded = useIsUserAddedToken(token)
  const currentNetwork = useNetworkInfo(chainId)

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
    <Row className={isSelected ? 'disabled' : ''}>
      <TokenLogo src={token.logoURI ? token.logoURI : UnknownSVG} alt={token.name} />
      <TokenNameWrap className="token-name-wrap" onClick={() => (isSelected ? null : onSelect())}>
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
      </TokenNameWrap>
      {tokenBalance >= 0 ? (
        <Balance description={formatNumber(tokenBalance)} textWrap="truncate" color="subdued" />
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
