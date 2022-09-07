import { AppProps } from 'next/app';
import { store } from '@store/store';
import '../styles/turtle.css'
import '../styles/tile.css'
import { Provider } from 'react-redux';

const App = ({
  Component, pageProps
}: AppProps) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default App;
