import React, { Component } from "react";
import { View, StyleSheet, FlatList, Switch } from "react-native";
import { connect } from "react-redux";
import { Button, List, ListItem } from "react-native-elements";
class Options extends Component {
  constructor(props) {
    super(props);
  }
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
        <List containerStyle={styles.list}>
          <FlatList
            data={this.props.contacts}
            renderItem={this.renderOption}
            keyExtractor={(item, index) => index.toString()}
          />
        </List>
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
  }
});

const mapStateToProp = state => {
  return {
    contacts: state.contacts.data
  };
};
export default connect(mapStateToProp)(Options);
