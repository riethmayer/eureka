import { AppProps } from "next/app";
import { store } from "@store/store";
import { Provider } from "react-redux";
import { StytchProvider } from "@stytch/nextjs";
import { createStytchUIClient } from "@stytch/nextjs/ui";

import "../styles/global.css";

const stytch = createStytchUIClient(
  process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN || ""
);

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <StytchProvider stytch={stytch}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </StytchProvider>
  );
};

export default App;
