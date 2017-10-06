import React from 'react';

import { storiesOf } from '@storybook/react';

import { Button, Welcome } from '@storybook/react/demo';
import GameOver from '../components/GameOver/GameOver'
import GamePaused from '../components/GamePaused/GamePaused'
import GameRunning from '../GameRunning/GameRunning'
import { MemoryRouter } from 'react-router-dom'
import Tile from '../components/Tile/Tile'
import configureStore from '../configureStore'

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
      <Tile caption="A" />
      <Tile caption="B" />
      <Tile caption="C" />
      <Tile caption="D" />
      <Tile caption="E" />
      <Tile caption="F" />
      <Tile caption="G" />
      <Tile caption="H" />
      <Tile caption="I" />
      <Tile caption="J" />
      <Tile caption="K" />
      <Tile caption="L" />
      <Tile caption="M" />
      <Tile caption="N" />
      <Tile caption="O" />
      <Tile caption="P" />
      <Tile caption="Q" />
      <Tile caption="R" />
      <Tile caption="S" />
      <Tile caption="T" />
      <Tile caption="U" />
      <Tile caption="V" />
      <Tile caption="W" />
      <Tile caption="X" />
      <Tile caption="Y" />
      <Tile caption="Z" />
    </div>
  ).add('active characters', () =>
    <div>
      <Tile caption="A" />
      <Tile active caption="B" />
      <Tile caption="C" />
      <Tile caption="D" />
      <Tile caption="E" />
      <Tile caption="F" />
      <Tile caption="G" />
      <Tile caption="H" />
      <Tile caption="I" />
      <Tile active caption="J" />
      <Tile active caption="K" />
      <Tile caption="L" />
      <Tile caption="M" />
      <Tile caption="N" />
      <Tile caption="O" />
      <Tile caption="P" />
      <Tile caption="Q" />
      <Tile caption="R" />
      <Tile caption="S" />
      <Tile caption="T" />
      <Tile caption="U" />
      <Tile caption="V" />
      <Tile caption="W" />
      <Tile caption="X" />
      <Tile caption="Y" />
      <Tile caption="Z" />
    </div>
  ).add('numbers', () =>
    <div>
      <Tile caption="0" />
      <Tile caption="1" />
      <Tile caption="2" />
      <Tile caption="3" />
      <Tile caption="4" />
      <Tile caption="5" />
      <Tile caption="6" />
      <Tile caption="7" />
      <Tile caption="8" />
      <Tile caption="9" />
    </div>
  ).add('active numbers', () =>
    <div>
      <Tile caption="0" />
      <Tile active caption="1" />
      <Tile caption="2" />
      <Tile caption="3" />
      <Tile caption="4" />
      <Tile active caption="5" />
      <Tile active caption="6" />
      <Tile caption="7" />
      <Tile caption="8" />
      <Tile caption="9" />
    </div>
  )
