import styled from 'styled-components'
import GlobalStyle from './theme/global'
import Header from './components/Header'
import Footer from './components/Footer'
import '@elastic/eui/dist/eui_theme_light.css'

const PageContainer = styled.div`
  min-height: calc(100vh - 160px);
`

const App = (): JSX.Element => {
  return (
    <>
      <GlobalStyle />
      <Header />
      <PageContainer />
      <Footer />
    </>
  )
}

export default App
