import React, { PureComponent } from "react";
import { Text, View, StyleSheet } from "react-native";
import Colors from "./common/Colors";
const returnTrue = () => true;

export default class GroupSectionList extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.lastSelectedIndex = null;
    this.state = { text: "", isShow: false, active: 0 };
  }

  render() {
    return (
      <View pointerEvents="box-none" style={styles.topView}>
        {this.state.isShow ? (
          <View style={styles.modelView}>
            <View style={styles.viewShow}>
              <Text style={styles.textShow}>{this.state.text}</Text>
            </View>
          </View>
        ) : null}
        <View
          style={styles.container}
          ref="view"
          onStartShouldSetResponder={returnTrue}
          onMoveShouldSetResponder={returnTrue}
          onResponderGrant={this.detectAndScrollToSection}
          onResponderMove={this.detectAndScrollToSection}
          onResponderRelease={this.resetSection}
        >
          {this._getSections()}
        </View>
      </View>
    );
  }

  _getSections = () => {
    let array = new Array();
    for (let i = 0; i < this.props.sections.length; i++) {
      const ActiveColor = this.state.active == i ? Colors.blue : Colors.text;
      array.push(
        <View
          style={styles.sectionView}
          pointerEvents="none"
          key={i}
          ref={"sectionItem" + i}
        >
          <Text style={[styles.sectionItem, { color: ActiveColor }]}>
            {this.props.sections[i]}
          </Text>
        </View>
      );
    }
    return array;
  };

  onSectionSelect(section, index, fromTouch) {
    this.props.onSectionSelect && this.props.onSectionSelect(section, index);

    if (!fromTouch) {
      this.lastSelectedIndex = null;
    }
  }

  componentWillUnmount() {
    this.measureTimer && clearTimeout(this.measureTimer);
  }

  componentDidMount() {
    // The heights are the same, so you only need to measure one here.
    const sectionItem = this.refs.sectionItem0;

    this.measureTimer = setTimeout(() => {
      sectionItem.measure((x, y, width, height, pageX, pageY) => {
        this.measure = {
          y: pageY,
          height
        };
      });
    }, 0);
  }

  detectAndScrollToSection = e => {
    var ev = e.nativeEvent.touches[0];
    // Need to change the color when the finger is pressed
    /*this.refs.view.setNativeProps({
      style: {
        backgroundColor: "rgba(0,0,0,0.3)"
      }
    });*/
    let targetY = ev.pageY;
    const { y, height } = this.measure;
    if (!y || targetY < y) {
      return;
    }
    let index = Math.floor((targetY - y) / height);
    index = Math.min(index, this.props.sections.length - 1);
    this.setState({ active: index });
    if (
      this.lastSelectedIndex !== index &&
      index < this.props.sections.length
    ) {
      this.lastSelectedIndex = index;
      this.onSectionSelect(this.props.sections[index], index, true);
      this.setState({ text: this.props.sections[index], isShow: true });
    }
  };

  resetSection = () => {
    //You need to change back when your finger is raised.
    this.refs.view.setNativeProps({
      style: {
        backgroundColor: "transparent"
      }
    });
    this.setState({ isShow: false });
    this.lastSelectedIndex = null;
    this.props.onSectionUp && this.props.onSectionUp();
  };
}

const styles = StyleSheet.create({
  topView: {
    flex: 1,
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    left: 0
  },

  modelView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    position: "absolute",
    backgroundColor: "transparent",
    right: 0,
    top: 0,
    bottom: 0,
    left: 0
  },

  viewShow: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#666",
    width: 80,
    height: 80,
    borderRadius: 3
  },

  textShow: {
    fontSize: 50,
    color: "#fff"
  },

  container: {
    position: "absolute",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    right: 0,
    top: 0,
    bottom: 0,
    paddingTop: 50,
    paddingBottom: 50,
    width: 15
  },

  sectionView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },

  sectionItem: {
    fontSize: 12,
    fontWeight: "300"
  }
});
