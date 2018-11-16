import React from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
  Vibration
} from "react-native";

const { width } = Dimensions.get("window");

export default class Swipeable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.resetSwipe = this.resetSwipe.bind(this);
    this.gestureDelay = -35;
    this.scrollViewEnabled = true;

    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onPanResponderMove: (evt, gestureState) => {
        // left swipe
        if (gestureState.dx > 35) {
          this.setState({ isSwipingLeft: true, isSwipingRight: false });
          this.justifyContent = "flex-start";
          this.backgroundColor = this.props.leftBackgroundcolor || "#fff";
          this.setScrollViewEnabled(false);
          let newX = gestureState.dx + this.gestureDelay;
          position.setValue({ x: newX, y: 0 });
          // right swipe
        } else if (gestureState.dx < -35) {
          this.setState({ isSwipingLeft: false, isSwipingRight: true });
          this.setScrollViewEnabled(false);
          this.justifyContent = "flex-end";
          this.backgroundColor = this.props.rightBackgroundcolor || "#fff";
          let newX = gestureState.dx + -this.gestureDelay;
          position.setValue({ x: newX, y: 0 });
        }
        Vibration.cancel()
      },
      onPanResponderRelease: (evt, gestureState) => {
        // left swipe
        if (gestureState.dx >= 100) {
          Vibration.vibrate(100);
          Animated.timing(this.state.position, {
            toValue: { x: width - 10, y: 0 },
            duration: 300
          }).start(() => {
            this.props.onLeftActionRelease(this.props.text);
            this.resetSwipe();
            this.setScrollViewEnabled(true);
          });
          // right swipe
        } else if (gestureState.dx <= -100) {
          Vibration.vibrate(100);
          Animated.timing(this.state.position, {
            toValue: { x: -width + 10, y: 0 },
            duration: 300
          }).start(() => {
            this.props.onRightActionRelease(this.props.text);
            this.resetSwipe();
            this.setScrollViewEnabled(true);
          });
        } else {
          // reset swipe to 0
          Animated.timing(this.state.position, {
            toValue: { x: 0, y: 0 },
            duration: 150
          }).start(() => {
            this.setScrollViewEnabled(true);
          });
        }
      }
    });

    this.panResponder = panResponder;
    this.state = { position, isSwipingLeft: false, isSwipingRight: false };
  }

  resetSwipe() {
    this.setState({ isSwipingLeft: false, isSwipingRight: false });
    Animated.timing(this.state.position, {
      toValue: { x: 0, y: 0 },
      duration: 150
    }).start(() => {
      this.setScrollViewEnabled(true);
    });
  }
  setScrollViewEnabled(enabled) {
    if (this.scrollViewEnabled !== enabled) {
      this.props.setScrollEnabled(enabled);
      this.scrollViewEnabled = enabled;
    }
  }
  renderSwipe = () => {
    if (this.state.isSwipingRight) {
      return (
        <View
          style={[
            styles.absoluteCell,
            { right: 0, justifyContent: "flex-end" }
          ]}
          key={this.props.index}
        >
          {this.props.rightContent}
        </View>
      );
    } else if (this.state.isSwipingLeft) {
      return (
        <View
          style={[
            styles.absoluteCell,
            { left: 0, justifyContent: "flex-start" }
          ]}
          key={this.props.index}
        >
          {this.props.leftContent}
        </View>
      );
    }
  };
  render() {
    return (
      <View
        key={this.props.index}
        style={[styles.listItem, { backgroundColor: this.backgroundColor }]}
      >
        <Animated.View
          style={[this.state.position.getLayout()]}
          {...this.panResponder.panHandlers}
        >
          {this.renderSwipe()}

          <View style={styles.innerCell}>{this.props.children}</View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    marginLeft: -100,
    marginRight: -100,
    justifyContent: "center"
  },
  absoluteCell: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 100,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 3
  },
  absoluteCellText: {
    margin: 16,
    color: "#FFF"
  },
  innerCell: {
    width: width,
    marginLeft: 100,
    backgroundColor: "#fff",
    position: "relative",
    zIndex: 1
  }
});
