import LoginOrSignup from "@components/Authentication/LoginOrSignup";
import Button, { ButtonType } from "@components/common/Button";
import EurekaLogo from "@components/EurekaLogo";
import { useStytch, useStytchUser } from "@stytch/nextjs";
import Link from "next/link";
import { useRouter } from "next/router";

const IndexPage = () => {
  const { user, isInitialized } = useStytchUser();
  const stytch = useStytch();
  const router = useRouter();

  const signOut = async () => {
    try {
      await stytch.session.revoke();
    } catch (error) {
      await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      router.replace("/");
    }
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
        </>
      )}

      {isInitialized && user && (
        <div className="flex flex-row align-middle">
          <Link href="/game">
            <Button
              variant={ButtonType.play}
              handler={() => router.replace("/game")}
            >
              Start
            </Button>
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
