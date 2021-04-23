import React, { Component } from 'react';
import { View, Text, Image, TouchableHighlight } from 'react-native';

import AppHeader from '../../components/AppHeader.js';

import {styles} from '../../styles/styles.js';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  render() {
    return (
      <View style={styles.container}>
        <AppHeader nav={this.props} />
        <Text style={styles.menuHeading} > Home Screen </Text>
        <View style={styles.mainMenu}>
          <TouchableHighlight onPress={() => this.props.navigation.navigate('PhotoStream')}>
            <Text style={styles.menuItems} > Photo Stream </Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.props.navigation.navigate('Albums')}>
            <Text style={styles.menuItems} > Photo Albums </Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.props.navigation.navigate('Photos')}>
            <Text style={styles.menuItems} > Flickr Photo Gala </Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

export default HomeScreen;
