import React, { Component } from 'react';
import {StyleSheet, Text, View, Button, Image} from 'react-native';

import AppHeader from '../../components/AppHeader.js';
import FlickrAPI from "../../scripts/flickr_api";

import { WebView } from 'react-native-webview';

import {styles} from '../../styles/styles.js';

class PhotoStreamScreen extends React.Component {

  constructor() {
    super();
    this.state = {}
  };

  componentDidMount() {
    let photoStreamURL=FlickrAPI.fetchPhotoStream();
    this.setState({user_photos_url: photoStreamURL});
  }

  render() {
    return (
      <View style={styles.container}>
        <AppHeader nav={this.props} />
        <WebView
          source={{ uri: this.state.user_photos_url }}
        />

      </View>
    )
  }
}
export default PhotoStreamScreen;
