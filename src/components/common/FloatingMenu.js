import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
const FloatingMenu =  props  => {
  return (
    <TouchableOpacity style={styles.buttonStyle} onPress={props.onPress}>
      <Icon
        name={props.icon || 'plus'}
        size={props.size || 30}
        color={props.color || '#fff'}
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
    width: 60,
    position: "absolute",
    bottom: 20,
    right: 20,
    height: 60,
    backgroundColor: "#0984e3",
    borderRadius: 100,
    zIndex: 1,
  }
});

export { FloatingMenu };
