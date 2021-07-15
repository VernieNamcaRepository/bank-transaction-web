import React, { Component } from 'react';
import Transaction from './components/Transaction';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Transaction />
      </div>
    )
  }
}

export default App;