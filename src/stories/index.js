import React from 'react';

import { storiesOf } from '@storybook/react';

import { Button, Welcome } from '@storybook/react/demo';
import GameOver from '../components/GameOver/GameOver'
import GamePaused from '../components/GamePaused/GamePaused'
import GameRunning from '../components/GameRunning/GameRunning'
import { MemoryRouter } from 'react-router-dom'

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
