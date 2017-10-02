import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1><Link to="/">Eureka</Link></h1>
        <Link to="/game">Start a new game</Link>
      </div>
    );
  }
}

export default App
