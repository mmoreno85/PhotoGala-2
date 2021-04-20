import React, { Component } from 'react';
import {StyleSheet, Text, View, Button, Image, Alert, Linking} from 'react-native';

import { WebView } from 'react-native-webview';

import AppHeader from '../../components/AppHeader.js';

import FlickrAPI from "../../scripts/flickr_api";
import FlickrAuth from "../../scripts/flickr_auth";
import api_key from "../../scripts/secret/api_keys.js"; //Store API Keys separately

//Hashing imports
import { JSHash, JSHmac, CONSTANTS } from 'react-native-hash';
import { Buffer } from 'buffer';
import { v4 as uuidv4 } from 'uuid';

import {styles} from '../../styles/styles.js';

const FLICKR_API_KEY = api_key.flickr_api_key; //Grab key from secret/api_keys.js
const FLICKR_API_SECRET = api_key.flickr_secret; //Grab key from secret/api_keys.js
const FLICKR_API_URL = api_key.flickr_auth_url; //Grab key from secret/api_keys.js

const USER_ID=api_key.flickr_userid; //Replace with Your User ID in Flickr API

const flickrAuth =new FlickrAuth();

const jsCode = `
function getMainText() {
  let mainText=document.getElementById('Main').getElementsByTagName("span")[0].innerHTML;
  window.ReactNativeWebView.postMessage(JSON.stringify({"message":mainText}));
}
document.getElementById("Main").getElementsByTagName("span")[0].addEventListener("load", getMainText());
`;
class FlickrAuthScreen extends React.Component {

  constructor() {
    super();
    this.state = {}

  };

  async componentDidMount() {
      this.setState({oauth_token: flickrAuth.getOAuthToken(), oauth_token_secret: flickrAuth.getOAuthTokenSecret(), oauth_url: flickrAuth.getOAuthUrl()});
      this.focusListener=this.props.navigation.addListener('focus', ()=> {
        flickrAuth.requestFlickrToken(); //Reauthenticate on focus. Will become obsolete when we persist tokens.
      });
  }

    getMessage(eventData) {
      let obj = JSON.parse(eventData);
      let oauth_verifier=obj.message;
      //flickrAuth.authenticateFlickrToken(flickrAuth.getOAuthToken(), flickrAuth.getOAuthTokenSecret(), oauth_verifier, this.props.navigation);
      let access_url='https://www.flickr.com/services/oauth/access_token';
      let httpVerb = 'GET&';
      let oauth_nonce=uuidv4();
      let oauth_signature_method='HMAC-SHA1';
      let oauth_signature='';
      let oauth_timestamp=Date.now();
      let oauth_version='1.0';
      let baseArguments=`oauth_consumer_key=${FLICKR_API_KEY}&oauth_nonce=${oauth_nonce}&oauth_signature_method=${oauth_signature_method}&oauth_timestamp=${oauth_timestamp}&oauth_token=${this.state.oauth_token}&oauth_verifier=${oauth_verifier}&oauth_version=${oauth_version}`;
      let baseStringURL=`${httpVerb}${encodeURIComponent(access_url)}&${encodeURIComponent(baseArguments)}`;
      JSHmac(baseStringURL, `${FLICKR_API_SECRET}&${this.state.oauth_token_secret}`, CONSTANTS.HmacAlgorithms.HmacSHA1)
        .then(hash => {
          oauth_signature=encodeURIComponent(Buffer.from(hash, 'hex').toString('base64'));
          let request_auth_url=`${access_url}?${baseArguments}&oauth_signature=${oauth_signature}`;
          fetch(request_auth_url)
          .then(response => response.text())
          .then(resp => {
              //Parse out oauth_token and oauth_token_secret
              let oauth_token=resp.split("&")[1].split("=")[1];
              let oauth_token_secret=resp.split("&")[2].split("=")[1];
              this.setState({oauth_token: oauth_token,oauth_token_secret:oauth_token_secret });
              this.props.navigation.navigate('AddPhoto', {flickrAuthenticated: true, oauth_token:oauth_token, oauth_token_secret: oauth_token_secret });
            })
            .catch(error => {
              console.error(error);
            });
        })
        .catch(e => console.log(e));
    }

  render() {
    return (
      <View style={styles.container}>
        <AppHeader nav={this.props} />
        <WebView
          ref={ref => (this.webview = ref)}
          source={{ uri: this.state.oauth_url }}
          style={{ marginTop: 20 }}
          onMessage={(event)=> this.getMessage(event.nativeEvent.data)}
          injectedJavaScript={jsCode}
        />
      </View>
    )
  }
}
export default FlickrAuthScreen;
