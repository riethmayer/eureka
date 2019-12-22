import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import HighScoreContainer from "./HighScore/HighScoreContainer";

const Wrapper = styled.div`
  text-align: center;
  margin: 0 auto;
  display: flex;
  align-content: space-around;
  align-items: center;
  flex-direction: column;
  table {
    width: 30rem;
    background-color: #efefef;
    tr:nth-child(even) {
      background-color: lightgray;
    }
    tr {
      th {
        text-align: center;
      }
      td {
        padding: 0.5rem 1rem;
        border: 1px solid #efefef;
      }
      td:first-child {
        width: 4rem;
        text-align: center;
      }
      td:nth-child(2) {
        width: 8rem;
        text-align: right;
      }
      td:last-child {
        text-align: left;
      }
    }
  }
`;
class App extends Component {
  render() {
    return (
      <Wrapper>
        <h1>Eureka</h1>
        <Link to="/game">Start a new game</Link>
        <h1>Highscore</h1>
        <HighScoreContainer />
      </Wrapper>
    );
  }
}

export default App;
