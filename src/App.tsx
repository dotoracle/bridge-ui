import styled from 'styled-components'
import GlobalStyle from './theme/global'
import Web3ReactManager from './components/Web3ReactManager'
import Header from './components/Header'
import Footer from './components/Footer'
import TokenSelect from './components/TokenSelect'
import PageBackgroundPNG from './assets/images/page-bg.png'
import '@elastic/eui/dist/eui_theme_dark.css'
import './assets/fonts/stylesheet.css'

const PageContainer = styled.div`
  min-height: calc(100vh - 160px);
  background-image: url(${PageBackgroundPNG});
  background-size: cover;
  background-attachment: fixed;
  padding-top: 3rem;
  padding-bottom: 3rem;
`
const SubHeading = styled.h2`
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5rem;
  color: #fff;

  @media (min-width: 768px) {
    font-size: 28px;
  }
`
const TitleWrapper = styled.div`
  position: relative;
`
const Title = styled.h1`
  position: relative;
  z-index: 2;
  margin-top: 1.5rem;
  line-height: 1.5;
  text-align: center;
  font-family: MarketSans, sans-serif;
  font-size: 36px;
  text-transform: uppercase;
  color: #fff;

  @media (min-width: 768px) {
    font-size: 50px;
  }

  @media (min-width: 992px) {
    font-size: 70px;
  }

  @media (min-width: 1200px) {
    font-size: 90px;
  }
`
const TitleShadow = styled.span`
  position: absolute;
  top: 0;
  left: 50%;
  margin-top: 2px;
  margin-left: 2px;
  transform: translate(-50%);
  z-index: 1;
  width: 100%;
  line-height: 1.5;
  text-align: center;
  font-family: MarketSans, sans-serif;
  font-size: 36px;
  text-transform: uppercase;
  color: transparent;
  -webkit-text-stroke-width: 2px;
  -webkit-text-stroke-color: #ff9100;

  @media (min-width: 768px) {
    font-size: 50px;
    margin-top: 3px;
    margin-left: 3px;
  }

  @media (min-width: 992px) {
    font-size: 70px;
  }

  @media (min-width: 1200px) {
    font-size: 90px;
  }
`
const SwapDiv = styled.div`
  margin: 3rem auto 0;
  border-radius: 40px;
  padding: 2rem;
  width: 100%;
  max-width: 50rem;
  background-color: #0f0f1e;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.3);
`
const App = (): JSX.Element => {
  return (
    <Web3ReactManager>
      <>
        <GlobalStyle />
        <Header />
        <PageContainer>
          <SubHeading>Dot Oracle</SubHeading>
          <TitleWrapper>
            <Title>Cross-chain bridge</Title>
            <TitleShadow>Cross-chain bridge</TitleShadow>
          </TitleWrapper>
          <SwapDiv>
            <TokenSelect />
          </SwapDiv>
        </PageContainer>
        <Footer />
      </>
    </Web3ReactManager>
  )
}

export default App
