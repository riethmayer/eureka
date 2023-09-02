import { getDomainFromWindow } from "@lib/urlUtils";
import { StytchLogin } from "@stytch/nextjs";
import {
  OAuthProviders,
  OneTapPositions,
  Products,
  StytchLoginConfig,
} from "@stytch/vanilla-js";
import { SESSION_DURATION } from "pages/authenticate";

const LoginOrSignup = () => {
  const stytchProps: StytchLoginConfig = {
    products: [Products.oauth, Products.emailMagicLinks],
    oauthOptions: {
      providers: [
        {
          type: OAuthProviders.Google,
          one_tap: false,
        },
      ],
    },
    emailMagicLinksOptions: {
      loginRedirectURL: getDomainFromWindow() + "/authenticate",
      signupRedirectURL: getDomainFromWindow() + "/authenticate",
      loginExpirationMinutes: SESSION_DURATION,
      signupExpirationMinutes: SESSION_DURATION,
      createUserAsPending: false,
    },
  };

  return (
    <>
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <StytchLogin config={stytchProps} />
      </div>
    </>
  );
};

export default LoginOrSignup;
