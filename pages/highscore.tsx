import Link from "next/link";
import type { NextPage } from "next";
import { useStytchUser } from "@stytch/nextjs";
import Button from "@components/common/Button";
import GameControl from "@components/GameControl";
import Layout from "@components/Layout";
import { Recipes } from "@lib/recipeData";
import LoginMethodCard from "@components/Authentication/LoginMethodCard";

const Highscore: NextPage = () => {
  const { user } = useStytchUser();

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
              <tr className="bg-gray-200">
                <td className="border px-4 py-2 text-center">Mark</td>
                <td className="border px-4 py-2 text-center">10</td>
              </tr>
              <tr className="bg-gray-100">
                <td className="border px-4 py-2 text-center">Mark</td>
                <td className="border px-4 py-2 text-center">10</td>
              </tr>
              <tr className="bg-gray-200">
                <td className="border px-4 py-2 text-center">Mark</td>
                <td className="border px-4 py-2 text-center">10</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="relative bg-slate-200 mt-8 rounded-xl px-10 py-4">
          {user ? (
            <div>{JSON.stringify(user)}</div>
          ) : (
            <>
              <div className="flex mt-6 just-around flex-wrap">
                {Object.values(Recipes).map((recipe) => (
                  <LoginMethodCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
              No user
            </>
          )}
          <Link href="/game">
            <Button>New Game</Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Highscore;
