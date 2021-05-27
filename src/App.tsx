import GlobalStyle from './theme/global'
import Header from './components/Header'
import '@elastic/eui/dist/eui_theme_light.css'

const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <Header />
    </>
  )
}

export default App
