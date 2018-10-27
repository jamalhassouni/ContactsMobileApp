import React, { Component } from "react";
import { View, Animated } from "react-native";
import { connect } from "react-redux";
import * as action from "../actions";
import { ListItem } from "react-native-elements";
let group = [];

class Group extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Animated.View
        key={this.props.key}
        style={this.props.style}
        onLayout=
        {event => {
          const layout = event.nativeEvent.layout;
          group.push({
            group: this.props.name,
            x: layout.x,
            y: layout.y,
            height: layout.height,
            width: layout.width
          });
          this.props.ChangeGroupPosition(group);
        }}
        >
          <ListItem
            hideChevron
            title={this.props.name}
            containerStyle={{ borderBottomWidth: 0 }}
          />
      </Animated.View>
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
