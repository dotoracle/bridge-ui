import AppBoxWrap from '../../components/AppBox'
import { TitleWrapper, Title, TitleShadow, SubHeading } from 'styled'

function Home(): JSX.Element {
  return (
    <>
      <SubHeading>Dot Oracle</SubHeading>
      <TitleWrapper>
        <Title>Cross-chain bridge</Title>
        <TitleShadow>Cross-chain bridge</TitleShadow>
      </TitleWrapper>
      <AppBoxWrap />
    </>
  )
}

export default Home
