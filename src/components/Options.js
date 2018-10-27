import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  AsyncStorage,
  Alert
} from "react-native";
import { connect } from "react-redux";
import { Button, List, ListItem } from "react-native-elements";
import { Input } from "./common";
class Options extends Component {
  constructor(props) {
    super(props);
    this.state = {
      getValue: "",
      textInputData: ""
    };
  }
  setValueLocally = () => {
    AsyncStorage.setItem("Key_27", this.state.textInputData);

    Alert.alert("Value Stored Successfully.");
  };
  getValueLocally = () => {
    AsyncStorage.getItem("Key_27").then(value =>
      this.setState({ getValue: value })
    );
  };
  componentDidMount() {
    this.props.navigation.setParams({
      user: `Options 1 `
    });
  }
  renderOption = () => {
    return (
      <ListItem
        onPress={() => console.log("cliked")}
        switchButton
        hideChevron
        trackColor={"#00BCD4"}
        title={"jamal"}
        subtitle={"hassouni"}
        switched={false}
        onSwitch={value => {
          console.log("switched", value);
        }}
        containerStyle={{ borderBottomWidth: 0 }}
      />
    );
  };

  render() {
    return (
      <View style={styles.mainConatinerStyle}>
        <List containerStyle={styles.list}>{this.renderOption()}</List>
        <View style={styles.MainContainer}>
          <Input
            placeholder="Enter Some Text here"
            onChangeText={data => this.setState({ textInputData: data })}
            underlineColorAndroid="transparent"
            style={styles.TextInputStyle}
          />

          <TouchableOpacity
            onPress={this.setValueLocally}
            activeOpacity={0.7}
            style={styles.button}
          >
            <Text style={styles.buttonText}> SAVE VALUE LOCALLY </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.getValueLocally}
            activeOpacity={0.7}
            style={styles.button}
          >
            <Text style={styles.buttonText}> GET VALUE LOCALLY SAVED </Text>
          </TouchableOpacity>

          <Text style={styles.text}> {this.state.getValue} </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainConatinerStyle: {
    flex: 1
  },
  list: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    marginTop: 0
  },
  MainContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    margin: 10
  },

  TextInputStyle: {
    textAlign: "center",
    height: 40,
    width: "100%",
    borderWidth: 1,
    borderColor: "#028b53",
    borderRadius: 10
  },

  button: {
    width: "100%",
    height: 40,
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 7,
    marginTop: 10
  },

  buttonText: {
    color: "#fff",
    textAlign: "center"
  },

  text: {
    fontSize: 20,
    textAlign: "center"
  }
});

const mapStateToProp = state => {
  return {
    contacts: state.contacts.data
  };
};
export default connect(mapStateToProp)(Options);
