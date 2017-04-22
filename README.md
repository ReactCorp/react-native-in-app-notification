# react-native-in-app-notification [![npm version](https://badge.fury.io/js/react-native-in-app-notification.svg)](https://badge.fury.io/js/react-native-in-app-notification)

> :bell: Customisable in-app notification component for React Native

## Contents
1. [Install](#install)
2. [Props](#props)
3. [Usage](#usage)
4. [Example](#example)

## Install
```bash
yarn add react-native-in-app-notification
```
OR
```bash
npm install react-native-in-app-notification --save
```

## Props
| Prop Name                 | Prop Description                                    | Data Type              | Required    | Default                     |
|---------------------------|-----------------------------------------------------|------------------------|-------------|-----------------------------|
| closeInterval             | How long the notification stays visible             | Number                 | No          | `4000`                      |
| openCloseDuration         | The length of the open / close animation            | Number                 | No          | `200`                       |
| height                    | The height of the Notification component            | Number                 | No          | `80`                        |
| backgroundColour          | The background colour of the Notification component | String                 | No          | `white`                     |
| notificationBodyComponent | **See below about NotificationBody**                | React Node or Function | Recommended | `./DefaultNotificationBody` |

### NotificationBody
The notification body is what is rendered inside the main Notification component and gives you the ability to customise how the notification looks. You can use the default notification body component in `./DefaultNotificationBody.js` as inspiration and guidance.

Your `notificationBodyComponent` component is given four props:

| Prop Name | Prop Description                                 | Data Type |
|-----------|--------------------------------------------------|-----------|
| title     | The title passed to `NotificationRef.show`       | String    |
| message   | The message passed to `NotificationRef.show`     | String    |
| onPress   | The callback passed to `NotificationRef.show`    | Function  |
| onClose   | A function to close the Notification prematurely | Function  |  

## Usage
Adding `react-native-in-app-notification` is simple; just import the component and add it to the bottom of your component tree. Then create a ref to the component using `ref={(ref) => { this.notification = ref; }}` as a prop.

When you want to show the notification, just call `.show` on the ref you made earlier. `.show` can take three arguments: `title`, `message` and `onPress` all of which are optional - but you should probably include at least one of `title` or `message`! `onPress` doesn't need to be used for passive notifications and you can use `onClose` in your `NotificationBody` component to allow your users to close the notification.

## Example
```javascript
import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import Notification from 'react-native-in-app-notification';

class MyApp extends Component {
  render() {
    <View>
      <Text>This is my app</Text>
      <TouchableHighlight
        onPress={this.notification && this.notification.show(
          'You pressed it!',
          'The notification has been triggered',
          () => Alert.alert('Alert', 'You clicked the notification!'),
        )}
      >
        <Text>Click me to trigger a notification</Text>
      </TouchableHighlight>
      <Notification ref={(ref) => { this.notification = ref; }} />
    </View>
  }
}
```