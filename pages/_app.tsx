import { AppProps } from 'next/app';
import { wrapper } from "@store/store";

import '../styles/turtle.css'
import '../styles/tile.css'

const App = ({
  Component, pageProps
}: AppProps) => {
  return (
    <Component {...pageProps} />
  );
}

export default wrapper.withRedux(App);
