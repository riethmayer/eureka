import Link from "next/link";
import type { GetServerSideProps } from "next";
import Button, { ButtonType } from "@components/common/button";
import Layout from "@components/layout";
import { getHighScores } from "@api/highscore";

type Score = {
  id: number;
  name: string;
  score: number;
  level: number;
};

type Props = {
  highscores: Array<Score>;
  children?: React.ReactNode;
};

const HighscorePage = ({ highscores }: Props) => {
  return (
    <Layout title="Highscore">
      <div className="flex mt-8 flex-col justify-top h-screen w-screen items-center">
        <div className="w-[50%] rounded-xl border-8 border-red-300">
          <h1 className="text-5xl text-white bg-purple-700 w-full text-center font-extrabold py-2">
            Highscore
          </h1>
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-yellow-200 font-black text-blue-700 uppercase">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Score</th>
                <th className="px-4 py-2">Level</th>
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
                  <td className="border px-4 py-2 text-center">
                    {score.level}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="relative bg-slate-200 mt-8 rounded-xl px-10 py-4">
          <Link href="/game">
            <Button variant={ButtonType.play}>Start New</Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const highscores = await getHighScores();
  return { props: { highscores } };
};

export default HighscorePage;
