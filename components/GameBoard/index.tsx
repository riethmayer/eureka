import Turtle from "@components/Turtle/Turtle";
import styled from "styled-components";

const MyBoard = styled.div`
  font-size: 1.2em;
  background-color: #333;
  width: 100%;
`;

const Main = styled.div`
  background-color: white;
  height: 35.5em;
  width: 49.5em;
  padding: 0;
  margin: 0 auto;
  padding: 20px 0 0 12px;
`;

const GameBoard = () => {
  return (
    <MyBoard>
      <Main>
        <Turtle />
      </Main>
    </MyBoard>
  );
};

export default GameBoard;
