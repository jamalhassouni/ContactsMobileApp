import React, { Component } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { connect } from "react-redux";
import { Button, List, ListItem } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
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
        roundAvatar
        title={"jamal"}
        subtitle={"hassouni"}
        containerStyle={{ borderBottomWidth: 0 }}
      />
    );
  };

  renderFloatingMenu = () => {
    return (
      <View style={mainConatinerStyle}>
        <Button
          onPress={() => console.log("cliked button")}
          icon={<Icon name="rocket" size={30} color="#900" />}
          title="BUTTON WITH RIGHT ICON"
        />
      </View>
    );
  };
  render() {
    return (
      <View style={styles.mainConatinerStyle}>
        <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
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
    //flexDirection: "column",
    //flex: 1
  },
  floatingMenuButtonStyle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ee6e73",
    position: "absolute",
    bottom: 10,
    right: 10
  }
});

const mapStateToProp = state => {
  return {
    contacts: state.contacts.data
  };
};
export default connect(mapStateToProp)(Options);
