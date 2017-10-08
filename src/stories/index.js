import React from 'react';

import { storiesOf } from '@storybook/react';
import configureStore from '../configureStore'
import { MemoryRouter } from 'react-router-dom'

import { Button, Welcome } from '@storybook/react/demo';
import GameOver from '../components/GameOver/GameOver'
import GamePaused from '../components/GamePaused/GamePaused'
import GameRunning from '../GameRunning/GameRunning'
import Tile from '../components/Tile/Tile'
import Turtle from '../components/Turtle/Turtle'

const store = configureStore()

import App from '../App'
storiesOf('Game states', module)
  .addDecorator(story =>
    (<MemoryRouter initialEntries={['/']}>
      {story()}
    </MemoryRouter>)
  ).add('Start screen', () => <App />)
  .add('GAME OVER', () => <GameOver />)
  .add('PAUSED', () => <GamePaused />)
  .add('RUNNING', () => <GameRunning timeLeft={123} store={store}/>)

storiesOf('Tiles', module)
  .add('characters', () =>
    <div>
      <Tile token="A" />
      <Tile token="B" />
      <Tile token="C" />
      <Tile token="D" />
      <Tile token="E" />
      <Tile token="F" />
      <Tile token="G" />
      <Tile token="H" />
      <Tile token="I" />
      <Tile token="J" />
      <Tile token="K" />
      <Tile token="L" />
      <Tile token="M" />
      <Tile token="N" />
      <Tile token="O" />
      <Tile token="P" />
      <Tile token="Q" />
      <Tile token="R" />
      <Tile token="S" />
      <Tile token="T" />
      <Tile token="U" />
      <Tile token="V" />
      <Tile token="W" />
      <Tile token="X" />
      <Tile token="Y" />
      <Tile token="Z" />
    </div>
  ).add('active characters', () =>
    <div>
      <Tile token="A" />
      <Tile active token="B" />
      <Tile token="C" />
      <Tile token="D" />
      <Tile token="E" />
      <Tile token="F" />
      <Tile token="G" />
      <Tile token="H" />
      <Tile token="I" />
      <Tile active token="J" />
      <Tile active token="K" />
      <Tile token="L" />
      <Tile token="M" />
      <Tile token="N" />
      <Tile token="O" />
      <Tile token="P" />
      <Tile token="Q" />
      <Tile token="R" />
      <Tile token="S" />
      <Tile token="T" />
      <Tile token="U" />
      <Tile token="V" />
      <Tile token="W" />
      <Tile token="X" />
      <Tile token="Y" />
      <Tile token="Z" />
    </div>
  ).add('numbers', () =>
    <div>
      <Tile token="0" />
      <Tile token="1" />
      <Tile token="2" />
      <Tile token="3" />
      <Tile token="4" />
      <Tile token="5" />
      <Tile token="6" />
      <Tile token="7" />
      <Tile token="8" />
      <Tile token="9" />
    </div>
  ).add('active numbers', () =>
    <div>
      <Tile token="0" />
      <Tile active token="1" />
      <Tile token="2" />
      <Tile token="3" />
      <Tile token="4" />
      <Tile active token="5" />
      <Tile active token="6" />
      <Tile token="7" />
      <Tile token="8" />
      <Tile token="9" />
    </div>
  )
storiesOf('Turtle', module)
  .add('normal', () =>
    <Turtle store={store} />
  )
