import Link from "next/link";
import type { NextPage } from "next";
import { useStytchUser } from "@stytch/nextjs";
import Button, { ButtonType } from "@components/common/Button";
import Layout from "@components/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type Score = {
  name: string;
  score: number;
  id: number;
};

const Highscore: NextPage = () => {
  const { user } = useStytchUser();
  const [highscores, setHighscores] = useState<Score[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetch("/api/highscore")
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setHighscores(data);
        })
        .catch((err) => {
          console.log(err);
          setHighscores([]);
        });
    } else {
      router.push("/");
    }
  }, [user]);

  return (
    <Layout title="Highscore">
      <div className="flex mt-8 flex-col justify-top h-screen w-screen items-center">
        <div className="w-[50%] rounded-xl border-8 border-red-300">
          <h1 className="text-xl text-white bg-purple-700 w-full text-center font-extrabold py-2">
            Highscore
          </h1>
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-yellow-200 font-black text-blue-700 uppercase">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {highscores.map((score, index) => (
                <tr
                  key={score.id}
                  className={index % 2 ? `bg-gray-200` : `bg-gray-100`}
                >
                  <td className="border px-4 py-2 text-center">{score.name}</td>
                  <td className="border px-4 py-2 text-center">
                    {score.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="relative bg-slate-200 mt-8 rounded-xl px-10 py-4">
          <Link href="/game">
            <a>
              <Button variant={ButtonType.play}>Start New Game</Button>
            </a>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Highscore;
