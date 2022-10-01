import { StytchLogin } from "@stytch/nextjs";
import {
  OAuthProviders,
  OneTapPositions,
  Products,
  StytchLoginConfig,
} from "@stytch/vanilla-js";

const LoginOrSignup = () => {
  const stytchProps: StytchLoginConfig = {
    products: [Products.oauth, Products.emailMagicLinks],
    oauthOptions: {
      providers: [
        {
          type: OAuthProviders.Google,
          one_tap: true,
          position: OneTapPositions.embedded,
        },
      ],
    },
    emailMagicLinksOptions: {
      loginRedirectURL: "/",
      signupRedirectURL: "/",
      createUserAsPending: false,
      loginExpirationMinutes: 30,
      signupExpirationMinutes: 30,
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
