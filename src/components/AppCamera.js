import React, { Component } from "react";

import { StyleSheet, Text, View, TextInput, Image, ImageBackground, TouchableOpacity, Button, Platform, Alert, Dimensions} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';

import FlickrAPI from "../scripts/flickr_api";

import { cameraStyle } from '../styles/cameraStyles.js';

const { width: winWidth, height: winHeight } = Dimensions.get('window');

class AppCamera extends Component {
    constructor(props) {
      super(props);
      this.camera = null;
      this.state = {
        params: props.params,
        hasCameraPermission: null,
        cameraType: Camera.Constants.Type.back,
        photoPreview: false,
        showCamera: false,
      };
    }
    async componentDidMount() {
        const camera = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: camera.status });
    };

    //Check if user returned with NULL Flickr Auth
    async componentDidUpdate() {
      if(!this.props.params)
        this.props.nav.navigate('FlickrAuth');
    };

    //Toggles camera front to back
    _toggleCameraType() {
      if (this.state.cameraType === Camera.Constants.Type.back)
        this.setState({cameraType: Camera.Constants.Type.front});
      else
        this.setState({cameraType: Camera.Constants.Type.back});
    }


    //Takes and saves photo into onPictureSaved
    _takePhoto= async () => {
      if (this.state.hasCameraPermission === null) {
      }
      else if (this.state.hasCameraPermission === false) {
      }
      else {
        if (this.camera) {
          const cameraSize= await this.camera.getAvailablePictureSizesAsync('4:3');
          this.camera.takePictureAsync({
            base64: true,
            skipProcessing: true,
            exif: true,
            pictureSize: cameraSize[2],
            onPictureSaved: this.onPictureSaved,
          });
        }
      }
    }

    //Processing after photo saved
    onPictureSaved = async (photo) => {
      this.setState({
          photoURI: photo.uri,
          photoBase64: photo,
          photoPreview: true
      });
    }

    //Call FlickrAPI to upload
    _uploadFlickr = () => {
      if(!this.props.params) {
        //console.log("_uploadFlickr" , "Flicker NOT Authenticated", this.props);
        this.setState({photoPreview: false})
        this.props.nav.navigate("Home");
      }
      else {
        FlickrAPI.uploadPhoto(this.state.photoURI, this.props.params.oauth_token, this.props.params.oauth_token_secret, this.props.nav);
      }
    }

    render() {
        const { hasCameraPermission } = this.state;
        if (hasCameraPermission === null) {
            return <View><Text>No Camera Permissions</Text></View>;
        } else if (hasCameraPermission === false) {
            return <Text>Access to camera has been denied.</Text>;
        }
        return (
            <View>
            {this.state.photoPreview
              ?
              <View style={cameraStyle.photoPreview}>
                  <Image
                    source={ this.state.photoBase64 }
                    style={{ width: winWidth, height: winHeight }}
                  />
                <View style={cameraStyle.toolbar}>
                      <Icon name='md-arrow-undo' size={50} color="#ccc" style={cameraStyle.cameraIcon} onPress={ () => this.setState({photoPreview: false})} />
                  <Icon name='md-checkmark-circle-sharp' size={50} color="#ccc" style={cameraStyle.cameraIcon} onPress={ () => this._uploadFlickr() } />
                  <Icon name='close-sharp' size={50} color="#ccc" onPress={this.props.closeCamera} style={cameraStyle.cameraIcon} />
                </View>
              </View>
              :
              <View style={cameraStyle.cameraWindow}>
                <Camera
                    style={cameraStyle.preview}
                    ref={camera => this.camera = camera}
                    type={this.state.cameraType}
                >
                </Camera>
                <View style={cameraStyle.toolbar}>
                  <Icon name='camera-reverse' size={50} color="#ccc" style={cameraStyle.cameraIcon} onPress={ () => this._toggleCameraType()} />
                  <Icon name='radio-button-off' size={50} color="#ccc" style={cameraStyle.cameraIcon} onPress={ () => this._takePhoto() } />
                  <Icon name='close-sharp' size={50} color="#ccc" onPress={() => this.props.nav.navigate('Home')} style={cameraStyle.cameraIcon} />
                </View>
              </View>
            }
            </View>
        );
    };
};
export default AppCamera;
