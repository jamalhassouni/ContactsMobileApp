import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import * as action from "../actions";
import { ListItem } from "react-native-elements";
let groupRow = [];

class Group extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        key={this.props.key}
        onLayout={event => {
          const layout = event.nativeEvent.layout;
          groupRow.push({
            group: this.props.name,
            x: layout.x,
            y: layout.y,
            height: layout.height,
            width: layout.width
          });
          this.props.ChangeGroupPosition(groupRow);
        }}
      >
        <ListItem
          hideChevron
          title={this.props.name}
          containerStyle={{ borderBottomWidth: 0 }}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    contacts: state.contacts.data,
    groupPos: state.contacts.groupPos
  };
};

export default connect(
  mapStateToProps,
  action
)(Group);
