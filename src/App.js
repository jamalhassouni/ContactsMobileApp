import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import  {createStore} from 'redux';
import  {Provider} from 'react-redux';
import  reducer from './reducer';

import Routes from "./RootNavigator";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
        <Provider store={createStore(reducer)}>
        <Routes />
        </Provider>
    );
  }
}


export default App;
