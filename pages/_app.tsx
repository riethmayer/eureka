import { AppProps } from 'next/app';
import { store } from '@store/store';
import '../styles/turtle.css'
import '../styles/tile.css'
import { Provider, useStore } from 'react-redux';
import { useEffect } from 'react';
 
const App = ({
  Component, pageProps
}: AppProps) => {
  console.log("rendering app")
  const dispatch = store.dispatch;
  const getState = store.getState;

  useEffect(() => {
    console.log("store changed")
  }, [store])

  useEffect(() => {
    console.log("dispatch changed")
  }, [dispatch])

  useEffect(() => {
    console.log("state changed")
  }, [getState])

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default App;