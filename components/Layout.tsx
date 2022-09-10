import { ReactNode } from 'react'
import { createGlobalStyle } from 'styled-components'
import Head from 'next/head'

type Props = {
  children?: ReactNode
  title?: string
}

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Rubik', sans-serif;
  }
  
  .tile-text {
    font-family: 'Rubik', sans-serif;
    font-weight: 900;
    font-size: 3ex;
  }
`
const Layout = ({ children, title = 'Eureka' }: Props) => (
  <>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <GlobalStyle />
    {children}
  </>
)

export default Layout