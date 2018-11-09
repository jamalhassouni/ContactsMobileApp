import React from "react";
import { Animated } from "react-native";
import { ListItem } from "react-native-elements";

const Group = props => {
  return (
    <Animated.View key={props.index} style={props.style}>
      <ListItem
        hideChevron
        titleStyle={props.titleStyle}
        title={props.name}
        containerStyle={{ borderBottomWidth: 0 }}
      />
    </Animated.View>
  );
};
export default Group;
