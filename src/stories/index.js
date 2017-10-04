import React from 'react';

import { storiesOf } from '@storybook/react';

import { Button, Welcome } from '@storybook/react/demo';
import GameOver from '../components/GameOver/GameOver'
import GamePaused from '../components/GamePaused/GamePaused'
import GameRunning from '../components/GameRunning/GameRunning'
import { MemoryRouter } from 'react-router-dom'
import Tile from '../components/Tile/Tile'

import App from '../App'

storiesOf('Game states', module)
  .addDecorator(story =>
    (<MemoryRouter initialEntries={['/']}>
  {story()}
    </MemoryRouter>)
  ).add('Start screen', () => <App />)
  .add('GAME OVER', () => <GameOver />)
  .add('PAUSED', () => <GamePaused />)
  .add('RUNNING', () => <GameRunning timeLeft={123}/>)

storiesOf('Tiles', module)
  .add('characters', () =>
    <div>
      <Tile caption="A" color="blue" />
      <Tile caption="B" color="red" />
      <Tile caption="C" color="green" />
      <Tile caption="D" color="brown" />
      <Tile caption="E" color="purple" />
      <Tile caption="F" color="orange" />
      <Tile caption="G" color="yellow" />
      <Tile caption="H" color="aqua" />
      <Tile caption="I" color="blueviolet" />
      <Tile caption="J" color="cadetblue" />
      <Tile caption="K" color="coral" />
      <Tile caption="L" color="cornflowerblue" />
      <Tile caption="M" color="crimson" />
      <Tile caption="N" color="cyan" />
      <Tile caption="O" color="darkblue" />
      <Tile caption="P" color="darkcyan" />
      <Tile caption="Q" color="darkgreen" />
      <Tile caption="R" color="darksalmon" />
      <Tile caption="S" color="deepskyblue" />
      <Tile caption="T" color="deeppink" />
      <Tile caption="U" color="yellow" />
      <Tile caption="V" color="forestgreen" />
      <Tile caption="W" color="greenyellow" />
      <Tile caption="X" color="palevioletred" />
      <Tile caption="Y" color="darkseagreen" />
      <Tile caption="Z" color="tomato" />
    </div>
  ).add('active characters', () =>
    <div>
      <Tile caption="A" color="royalblue" />
      <Tile active caption="B" color="red" />
      <Tile caption="C" color="green" />
      <Tile caption="D" color="brown" />
      <Tile caption="E" color="purple" />
      <Tile caption="F" color="orange" />
      <Tile caption="G" color="yellow" />
      <Tile caption="H" color="aqua" />
      <Tile caption="I" color="blueviolet" />
      <Tile active caption="J" color="cadetblue" />
      <Tile active caption="K" color="coral" />
      <Tile caption="L" color="cornflowerblue" />
      <Tile caption="M" color="crimson" />
      <Tile caption="N" color="cyan" />
      <Tile caption="O" color="darkblue" />
      <Tile caption="P" color="darkcyan" />
      <Tile caption="Q" color="darkgreen" />
      <Tile caption="R" color="darksalmon" />
      <Tile caption="S" color="deepskyblue" />
      <Tile caption="T" color="deeppink" />
      <Tile caption="U" color="yellow" />
      <Tile caption="V" color="forestgreen" />
      <Tile caption="W" color="greenyellow" />
      <Tile caption="X" color="palevioletred" />
      <Tile caption="Y" color="darkseagreen" />
      <Tile caption="Z" color="tomato" />
    </div>
  ).add('numbers', () =>
    <div>
      <Tile caption="0" color="blue" />
      <Tile caption="1" color="red" />
      <Tile caption="2" color="green" />
      <Tile caption="3" color="brown" />
      <Tile caption="4" color="purple" />
      <Tile caption="5" color="orange" />
      <Tile caption="6" color="yellow" />
      <Tile caption="7" color="aqua" />
      <Tile caption="8" color="blueviolet" />
      <Tile caption="9" color="cadetblue" />
    </div>
  ).add('active numbers', () =>
    <div>
      <Tile caption="0" color="royalblue" />
      <Tile active caption="1" color="red" />
      <Tile caption="2" color="green" />
      <Tile caption="3" color="brown" />
      <Tile caption="4" color="purple" />
      <Tile active caption="5" color="orange" />
      <Tile active caption="6" color="yellow" />
      <Tile caption="7" color="aqua" />
      <Tile caption="8" color="blueviolet" />
      <Tile caption="9" color="cadetblue" />
    </div>
  )
