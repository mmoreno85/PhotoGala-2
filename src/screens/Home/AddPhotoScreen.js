import React, { Component } from 'react';
import { View, Text, Image, TouchableHighlight, FlatList, SafeAreaView, Alert } from 'react-native';

import AppHeader from '../../components/AppHeader.js';
import AppCamera from '../../components/AppCamera.js';

import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location'
import { Camera } from 'expo-camera';

import FlickrAPI from "../../scripts/flickr_api";

import {styles} from '../../styles/styles.js';

class AddPhotoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        params: props.route.params,
        showCamera: true,
    };
  }

  componentDidMount() {
    this.setState({refreshing: true, isLoading: true,});
    if(this.state.params == null || !this.state.params.flickrAuthenticated)
    {
      Alert.alert("You must first authenticate with Flickr.");
      //console.log('AddPhotoScreen: componentDidMount', "Flickr NOT Authenticated");
      this.props.navigation.navigate('FlickrAuth');
    }
    else {
      //console.log('AddPhotoScreen: componentDidMount', "Flickr is Authenticated");
    }
  }

  //Listen for changes to component
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.route.params !== this.props.route.params) {
      if(this.props.route.params.flickrAuthenticated) {
        this.setState({params: this.props.route.params, showCamera: true});
        //console.log('AddPhotoScreen: componentDidUpdate', "Flickr is Authenticated", this.props.route.params);
      }
      else {
        //console.log('AddPhotoScreen: componentDidUpdate', "Flickr NOT Authenticated", this.state.params);
        this.props.navigation.navigate('FlickrAuth');
      }
    }
  }

  //Function which toggles camera off.
  onCloseCamera = () => {
    this.setState({ showCamera: false });
    this.props.navigation.navigate("Home");
  };

  //Function which check's camera permissions and toggles camera on.
  _takePhoto = async () => {
    const {status} = await Camera.requestPermissionsAsync()
    if(status === 'granted'){
      this.setState({showCamera: true});
      } else{
       this.setState({showCamera: false});
     }
 }

  render() {
    return (
      <View style={styles.container}>
      {this.state.showCamera
        ?
        <AppCamera
          closeCamera={this.onCloseCamera}
          params={this.props.route.params}
          nav={this.props.navigation}
        />
        :
        <View>
          <AppHeader nav={this.props} />
          <Text style={styles.photoHeaderText}> '{this.state.params.album_title}'</Text>
          <Text style={styles.addPhotoButton} onPress={ () => this._takePhoto()}> Add Photo </Text>
        </View>
      }
    </View>
    );
  }
}

export default AddPhotoScreen;
