import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { getStatusBarHeight, isIphoneX } from 'react-native-iphone-x-helper';
import { ImagePropTypes } from 'deprecated-react-native-prop-types';

import DefaultNotificationBody from './DefaultNotificationBody';

const styles = StyleSheet.create({
  notification: {
    position: 'absolute',
    width: '100%',
  },
});

class Notification extends Component {
  constructor() {
    super();

    this.heightOffset = isIphoneX() ? getStatusBarHeight() : (Platform.OS === 'android' && Platform.Version >= 35) ? StatusBar.currentHeight : 0;

    this.show = this.show.bind(this);
    this.showNotification = this.showNotification.bind(this);
    this.closeNotification = this.closeNotification.bind(this);

    this.state = {
      animatedValue: new Animated.Value(0),
      isOpen: false,
    };
  }

  show(
    { title, message, onPress, icon, vibrate, additionalProps } = {
      title: '',
      message: '',
      onPress: null,
      icon: null,
      vibrate: true,
      additionalProps: {},
    },
  ) {
    const { closeInterval } = this.props;
    const { isOpen } = this.state;

    // Clear any currently showing notification timeouts so the new one doesn't get prematurely
    // closed
    clearTimeout(this.currentNotificationInterval);

    const showNotificationWithStateChanges = () => {
      this.setState(
        {
          isOpen: true,
          title,
          message,
          onPress,
          icon,
          vibrate,
          additionalProps,
        },
        () => this.showNotification(() => {
          this.currentNotificationInterval = setTimeout(() => {
            this.setState(
              {
                isOpen: false,
                title: '',
                message: '',
                onPress: null,
                icon: null,
                vibrate: true,
                additionalProps,
              },
              this.closeNotification,
            );
          }, closeInterval);
        }),
      );
    };

    if (isOpen) {
      this.setState({ isOpen: false }, () => {
        this.closeNotification(showNotificationWithStateChanges);
      });
    } else {
      showNotificationWithStateChanges();
    }
  }

  showNotification(done) {
    const {
      onShowing,
      onShown
    } = this.props;
    onShowing(this.state.additionalProps);
    Animated.timing(this.state.animatedValue, {
      toValue: 1,
      duration: this.props.openCloseDuration,
      useNativeDriver: true,
    }).start(() => {
      done();
      onShown(this.state.additionalProps);
    });
  }

  closeNotification(done) {
    const {
      onClosing,
      onClosed
    } = this.props;
    onClosing(this.state.additionalProps);
    Animated.timing(this.state.animatedValue, {
      toValue: 0,
      duration: this.props.openCloseDuration,
      useNativeDriver: true,
    }).start(() => {
      done && done();
      onClosed(this.state.additionalProps);
    });
  }

  render() {
    const {
      height: baseHeight,
      topOffset,
      backgroundColour,
      iconApp,
      notificationBodyComponent: NotificationBody,
    } = this.props;

    const { animatedValue, title, message, onPress, isOpen, icon, vibrate } = this.state;

    const height = baseHeight + this.heightOffset;

    return (
      <Animated.View
        style={[
          styles.notification,
          { height, backgroundColor: backgroundColour },
          {
            transform: [
              {
                translateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-height + topOffset, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={{ paddingTop: this.heightOffset }}>
          <NotificationBody
            title={title}
            message={message}
            onPress={onPress}
            isOpen={isOpen}
            iconApp={iconApp}
            icon={icon}
            vibrate={vibrate}
            onClose={() => {
              //clear timeout
              clearTimeout(this.currentNotificationInterval);
              this.setState({ isOpen: false }, this.closeNotification);
            }}
            additionalProps={this.state.additionalProps}
          />
        </View>
      </Animated.View>
    );
  }
}

Notification.propTypes = {
  closeInterval: PropTypes.number,
  openCloseDuration: PropTypes.number,
  height: PropTypes.number,
  topOffset: PropTypes.number,
  backgroundColour: PropTypes.string,
  notificationBodyComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  iconApp: ImagePropTypes.source,
  onShowing: PropTypes.func,
  onShown: PropTypes.func,
  onClosing: PropTypes.func,
  onClosed: PropTypes.func
};

Notification.defaultProps = {
  closeInterval: 4000,
  openCloseDuration: 200,
  height: 80,
  topOffset: 0,
  backgroundColour: 'white',
  notificationBodyComponent: DefaultNotificationBody,
  iconApp: null,
  onShowing: (additionalProps) => {},
  onShown: (additionalProps) => {},
  onClosing: (additionalProps) => {},
  onClosed: (additionalProps) => {},
};

export default Notification;
