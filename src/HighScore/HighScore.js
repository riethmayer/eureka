import React from "react";

const players = highscores => {
  return Object.keys(highscores).map(key => {
    const { score, player } = highscores[key];
    return { score, player, key };
  });
};

const HighScore = ({ highScores }) => (
  <table>
    <thead>
      <tr>
        <th>Rank</th>
        <th>Score</th>
        <th>Name</th>
      </tr>
    </thead>
    <tfoot>
      <tr>
        <th>Rank</th>
        <th>Score</th>
        <th>Name</th>
      </tr>
    </tfoot>
    <tbody>
      {players(highScores).map(({ key, score, player }, index) => (
        <tr key={key}>
          <td>{index}</td>
          <td>{score}</td>
          <td>{player}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default HighScore;
