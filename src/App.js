import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

import Routes from "./RootNavigator";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <Routes />;
  }
}


export default App;
