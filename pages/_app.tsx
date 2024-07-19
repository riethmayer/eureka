import { AppProps } from "next/app";
import { store } from "@store/store";
import { Provider } from "react-redux";

import "../styles/global.css";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default App;
