import { useEffect } from "react";
import { useRouter } from "next/router";
import { useStytchUser, useStytch } from "@stytch/nextjs";

const OAUTH_TOKEN = "oauth";
const MAGIC_LINKS_TOKEN = "magic_links";
const TWENTY_FOUR_HOURS = 24 * 60;
export const SESSION_DURATION = TWENTY_FOUR_HOURS;

const Authenticate = () => {
  const { user, isInitialized } = useStytchUser();
  const stytch = useStytch();
  const router = useRouter();

  useEffect(() => {
    const stytch_token_type = router?.query?.stytch_token_type?.toString();
    const token = router?.query?.token?.toString();
    if (token && stytch_token_type === OAUTH_TOKEN) {
      stytch.oauth.authenticate(token, {
        session_duration_minutes: SESSION_DURATION,
      });
    } else if (token && stytch_token_type === MAGIC_LINKS_TOKEN) {
      stytch.magicLinks.authenticate(token, {
        session_duration_minutes: SESSION_DURATION,
      });
    }
  }, [router, stytch]);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    if (user) {
      router.replace("/");
    }
  }, [router, user, isInitialized]);

  return null;
};

export default Authenticate;
