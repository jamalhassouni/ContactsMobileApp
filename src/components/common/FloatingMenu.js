import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
const FloatingMenu =  props  => {
  return (
    <TouchableOpacity style={styles.buttonStyle} onPress={props.onPress}>
      <Icon
        name={props.icon || 'plus'}
        size={props.size || 30}
        color={props.color || '#82b54a'}
      />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  buttonStyle: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    position: "absolute",
    bottom: 10,
    right: 10,
    height: 70,
    backgroundColor: "#fff",
    borderRadius: 100,
    zIndex: 1,
  }
});

export { FloatingMenu };
