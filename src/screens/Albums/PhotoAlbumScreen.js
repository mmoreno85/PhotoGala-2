import React, { Component } from 'react';
import { View, Text, Image, TouchableHighlight, FlatList, SafeAreaView } from 'react-native';

import AppHeader from '../../components/AppHeader.js';
import AppCamera from '../../components/AppCamera.js';

import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location'
import { Camera } from 'expo-camera';

import FlickrAPI from "../../scripts/flickr_api";

import {styles} from '../../styles/styles.js';

class PhotoAlbumScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        params: props.route.params,
        showCamera: false,
    };
  }
  componentDidMount() {
    this.setState({refreshing: true, isLoading: true,});
    FlickrAPI.fetchPhotoAlbum(this.state.params.album_id).then(photosets => {
      //console.log(photosets.photosets.photo);
      this.setState({ data: photosets.photosets.photo });
    });
  }

  //Function which toggles camera off.
  onCloseCamera = () => {
    this.setState({ showCamera: false });
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
          nav={this.props.navigation}
        />
        :
        <View>
          <AppHeader nav={this.props} />
          <Text style={styles.photoHeaderText}>Photos in '{this.state.params.album_title}'</Text>
          <SafeAreaView>
            <FlatList
              data={this.state.data}
              renderItem={({item}) =>
                <View style={{flexDirection: 'column', padding: 10, alignItems: 'stretch'}}>
                  <TouchableHighlight onPress={() => this.props.navigation.navigate('PhotoDetails', {photo_id: item.id, secret:item.secret, server: item.server, farm: item.farm, owner: item.owner})}>
                    <View>
                      <Text style={{paddingRight: 20}}>{item.title}</Text>
                        <Text>Album Photos for {item.id}</Text>
                      <Text>------------------------------------------------------------</Text>
                    </View>
                  </TouchableHighlight>

                </View>
              }
              keyExtractor={item => item.id}
            />
          </SafeAreaView>
        </View>
      }
    </View>
    );
  }
}

export default PhotoAlbumScreen;
