import React, { Component } from 'react';
import { View, Text,StyleSheet } from 'react-native';

export default class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View>
        <Text> textInComponent </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({

});