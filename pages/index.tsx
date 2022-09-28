import LoginOrSignup from "@components/Authentication/LoginOrSignup";
import Button, { ButtonType } from "@components/common/Button";
import EurekaLogo from "@components/EurekaLogo";
import { useStytch, useStytchUser } from "@stytch/nextjs";
import Link from "next/link";

const IndexPage = () => {
  const { user, isInitialized } = useStytchUser();
  const stytch = useStytch();
  const signOut = async () => {
    await stytch.session.revoke();
  };
  return (
    <div className="flex flex-col justify-center py-12 items-center">
      <EurekaLogo variant="large" />
      <h1 className="text-center py-4 text-yellow-50">
        Eureka, a mahjong style solitair game.
      </h1>

      {isInitialized && !user && (
        <>
          <LoginOrSignup />
          <div className="mt-8">
            <Link href="/game">
              <a className="text-yellow-50">Or play without highscores.</a>
            </Link>
          </div>
        </>
      )}
      {isInitialized && user && (
        <div className="flex flex-row align-middle">
          <Link href="/game">
            <Button variant={ButtonType.play}>Start New Game</Button>
          </Link>
          <button className="text-yellow-50 mt-8 ml-4" onClick={signOut}>
            Or sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default IndexPage;
