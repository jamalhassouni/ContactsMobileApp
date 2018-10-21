import React from "react";
import { ToastAndroid } from "react-native";
export default (Message = msg => {
  ToastAndroid.showWithGravityAndOffset(
    msg,
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM,
    25,
    50
  );
});
