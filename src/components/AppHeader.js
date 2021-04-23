import React, { Component } from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import { Header, Button } from 'react-native-elements';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';



import { styles } from '../styles/styles.js';

class MyHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state={appTitle:"Photo Gala"};
  }

render() {
    return (
      <View>
        <Header
        leftComponent={{ icon: 'menu', color: '#fff', onPress: () => this.props.nav.navigation.toggleDrawer() }}
        centerComponent={{ text: this.state.appTitle, style: { fontSize: 20, color: '#fff' } }}
        rightComponent={{ icon: 'home', color: '#fff', onPress: () => this.props.nav.navigation.navigate('Home') }}
        />
      </View>
    )
  }

}
export default MyHeader;
