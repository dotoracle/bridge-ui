import GlobalStyle from './theme/global'
import Header from './components/Header'
import Footer from './components/Footer'
import '@elastic/eui/dist/eui_theme_light.css'

const App = (): JSX.Element => {
  return (
    <>
      <GlobalStyle />
      <Header />
      <Footer />
    </>
  )
}

export default App
