import React, { Component } from 'react';
import { View, Text, Image, TouchableHighlight, FlatList, SafeAreaView, ActivityIndicator, Switch } from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

import AppHeader from '../../components/AppHeader.js';
import FlickrAPI from "../../scripts/flickr_api";

import {styles} from '../../styles/styles.js';

class PhotosScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      params: props.route.params,
      isLoading:true,
      locationSearch: true,
     };
  }
  async componentDidMount() {
    this.fetchPhotosByLocation();
    //this.setState({refreshing: true, isLoading: true,});
  //  FlickrAPI.fetchPhotos().then(photos => {
    //  this.setState({ data: photos.photos.photo });
  //  });
}
 toggleLocationSwitch(){
   if (this.state.locationSearch){
     this.fetchAllPhotos();
   }
   else{
     this.fetchPhotosByLocation();
   }
 }
 fetchPhotosByLocation = async ()=> {
   this.setState({locationSearch: true, isLoading: true,});
   let {status} = await Permissions.askAsync(Permissions.LOCATION);
   if (status !=='granted'){
     this.setState({
       errorMessage:'Permission to access location was denied',
       locationSearch:false
     });
     this.fetchAllPhotos();
     return;
    }
    let location = await Location.getCurrentPositionAsync({});
    this.setState({location});
    FlickrAPI.photosByLocation(location.coords.latitude,
    location.coords.longitude).then(photos => {
      //console.log(photos);
      this.setState({data: photos.photos.photo,isLoading: false});
    });
 };
 fetchAllPhotos(){
   this.setState({locationSearch: false, isLoading: true});
   FlickrAPI.fetchPhotos().then(photos=>{
     //console.log(photos);
     this.setState({isLoading: false, data: photos.photos.photo});
   });
 }
  render() {
    return (
      <View style={styles.container}>
        <AppHeader nav={this.props} />
        <View style={{flexDirection:'row-reverse'}}>
        <Switch
          onValueChange={this.toggleLocationSwitch.bind(this)}
          value ={this.state.locationSearch}
          />
          </View>
          <View style={{flexDirection: 'row'}}>
          <Text style={styles.photoHeaderText}>Photo Listing</Text>
          <MaterialIcons name={this.state.locationSearch ? 'location-on': 'location-off'} size = {30} color={this.state.locationSearch ? 'green': 'grey'}/>
        </View>
        {
          this.state.isLoading ?
        <View>
        <ActivityIndicator size="small" color="red"/>
        </View>
        :
        <SafeAreaView>
          <FlatList
            data={this.state.data}
            renderItem={({item}) =>
              <View style={{flexDirection: 'column', padding: 10, alignItems: 'stretch'}}>
                <TouchableHighlight onPress={() => this.props.navigation.navigate('Details', {photo_id: item.id, secret:item.secret, server: item.server, farm: item.farm, owner: item.owner})}>
                  <View>
                    <Text style={{paddingRight: 20}}>{item.title}</Text>
                      <Text>View Photo</Text>
                    <Text>------------------------------------------------------------</Text>
                  </View>
                </TouchableHighlight>

              </View>
            }
            keyExtractor={item => item.id}
          />
        </SafeAreaView>

      }
  </View>
    );
  }
}
export default PhotosScreen;
