import React from "react";

import HighScore from "./HighScore";

const fetchHighScores = () => {
  return {
    asdfasdf: {
      player: "Chuck Norris",
      score: "1433"
    },
    asdfasdf1: {
      player: "Chuck Norris",
      score: "1432"
    },
    asdfasdf2: {
      player: "Chuck Norris",
      score: "1431"
    },
    asdfasdf3: {
      player: "Sigrid S.",
      score: "1430"
    }
  };
};

class HighScoreContainer extends React.Component {
  state = {
    highScores: {}
  };
  componentDidMount() {
    this.setState({ highScores: fetchHighScores() });
  }
  render() {
    return <HighScore highScores={this.state.highScores} />;
  }
}

export default HighScoreContainer;
