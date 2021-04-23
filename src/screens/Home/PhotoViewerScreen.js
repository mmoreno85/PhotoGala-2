import React, { Component } from 'react';
import {StyleSheet, Text, View, Button, Image, TouchableHighlight} from 'react-native';

import {styles} from '../../styles/styles.js';

import FlickrAPI from "../../scripts/flickr_api";

class PhotoViewerScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        params: props.route.params,
    };
  };

  componentDidMount() {
    this.setState({refreshing: true, isLoading: true,});
    let url=FlickrAPI.fetchPhoto(this.state.params.photo_id, this.state.params.server, this.state.params.secret, this.state.params.farm, this.state.params.owner);
    this.setState({ photo_url: url });
}

  render() {
    return (
      <View style={styles.imageContainer}>
        <Text style={styles.photoHeaderText} > Photo Viewer </Text>
        <TouchableHighlight onPress={() => this.props.navigation.navigate('Details', {photo_id: this.state.params.photo_id, server_id: this.state.params.server, farm: this.state.params.farm, url: this.state.photo_url})}>
          <View>
            <Image
              source={{uri: this.state.photo_url}}
              style = {{ width: 200, height: 200 }}
            />
            <Text style={styles.imageCaption} > Press for Image Details </Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
}
export default PhotoViewerScreen;
