import React from 'react';
import ReactDOM from 'react-dom';
import Root from "./components/Root"
import configureStore from './configureStore'
import registerServiceWorker from './registerServiceWorker';

const store = configureStore()

ReactDOM.render(
  <Root store={store} />,
  document.getElementById('root')
)
registerServiceWorker();
