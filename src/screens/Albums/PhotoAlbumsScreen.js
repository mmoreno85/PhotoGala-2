import React, { Component } from 'react';
import { View, Text, Image, TouchableHighlight, FlatList, SafeAreaView } from 'react-native';

import AppHeader from '../../components/AppHeader.js';
import FlickrAPI from "../../scripts/flickr_api";

import {styles} from '../../styles/styles.js';

class PhotoAlbumsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  componentDidMount() {
    this.setState({refreshing: true, isLoading: true,});
    FlickrAPI.fetchPhotoAlbums().then(photosets => {
      //console.log(photosets);
      this.setState({ data: photosets.photosets.photoset });
    });
}
  render() {
    return (
      <View style={styles.container}>
        <AppHeader nav={this.props} />
        <Text style={styles.photoHeaderText}>Photo Albums</Text>
        <SafeAreaView>
          <FlatList
            data={this.state.data}
            renderItem={({item}) =>
              <View style={{flexDirection: 'column', padding: 10, alignItems: 'stretch'}}>
                <TouchableHighlight onPress={() => this.props.navigation.navigate('PhotoAlbum', {album_id: item.id, album_title: item.title._content, secret:item.secret, server: item.server, farm: item.farm, owner: item.owner})}>
                  <View>
                    <Text style={{paddingRight: 20}}>Album Title: {item.title._content}</Text>
                      <Text>View Album </Text>
                    <Text>------------------------------------------------------------</Text>
                  </View>
                </TouchableHighlight>

              </View>
            }
            keyExtractor={item => item.id}
          />
        </SafeAreaView>
      </View>
    );
  }
}

export default PhotoAlbumsScreen;
