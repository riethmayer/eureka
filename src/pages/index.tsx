import Button, { ButtonType } from "@components/common/button";
import EurekaLogo from "@components/eureka-logo";
import Link from "next/link";
import { useRouter } from "next/router";

const IndexPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center py-12 items-center">
      <EurekaLogo variant="large" />
      <h1 className="text-center py-4 text-yellow-50">
        Eureka, a mahjong style solitair game.
      </h1>
      <div className="flex flex-row align-middle">
        <Link href="/game">
          <Button
            variant={ButtonType.play}
            handler={() => router.replace("/game")}
          >
            Start
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default IndexPage;
