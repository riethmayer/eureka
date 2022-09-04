import React from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"
import PropTypes from "prop-types"
import { Provider } from "react-redux"
import App from "../../App"
import Game from "../../Game/Game"

const Root = ( { store } ) => (
  <Provider store={store}>
    <Router>
      <div>
        <Route exact path="/" component={App} />
        <Route path="/game" component={Game} />
      </div>
    </Router>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.oneOfType( [
    PropTypes.func.isRequired,
    PropTypes.object.isRequired,
  ] ).isRequired,
}


export default Root
