import React from "react";

const HighScore = highScores => (
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
      {Object.keys(highScores).forEach((key, index) => {
        console.log(highScores);
        console.log(key);
        console.log(index);
        const { score, person } = highScores[key];
        return (
          <tr key={key}>
            <td>{index}</td>
            <td>{score}</td>
            <td>{person}</td>
          </tr>
        );
      })}

      <tr>
        <td>2nd</td>
        <td>20012</td>
        <td>Chuck Norris</td>
      </tr>
      <tr>
        <td>3rd</td>
        <td>20001</td>
        <td>Chuck Norris</td>
      </tr>
      <tr>
        <td>4th</td>
        <td>2013</td>
        <td>Sigrid S.</td>
      </tr>
    </tbody>
  </table>
);

export default HighScore;
