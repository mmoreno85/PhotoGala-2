import api_key from "./secret/api_keys.js"; //Store API Keys separately
import {Linking } from "react-native";
//Hashing imports
import { JSHash, JSHmac, CONSTANTS } from 'react-native-hash';
//import base64 from 'react-native-base64';
import { Buffer } from 'buffer';
import { v4 as uuidv4 } from 'uuid';

const FLICKR_API_KEY = api_key.flickr_api_key; //Grab key from secret/api_keys.js
const FLICKR_API_SECRET = api_key.flickr_secret; //Grab key from secret/api_keys.js
const FLICKR_API_URL = api_key.flickr_auth_url; //Grab key from secret/api_keys.js

const USER_ID=api_key.flickr_userid; //Replace with Your User ID in Flickr API

var parseString = require('react-native-xml2js').parseString;

export default class FlickrAuth {

  oauth_token: '';
  oauth_token_secret: '';
  oauth_url: '';

  constructor() {
    this.requestFlickrToken();
  }

  getOAuthToken(){
    return this.oauth_token;
  }
  getOAuthTokenSecret(){
    return this.oauth_token_secret;
  }
  getOAuthUrl(){
    return this.oauth_url;
  }

  //Logic for retrieving Flickr Token using OAuth v. 1
  async requestFlickrToken() {
    let request_url='https://www.flickr.com/services/oauth/request_token';
    let httpVerb = 'GET&';
    let oauth_nonce=uuidv4();
    let oauth_signature_method='HMAC-SHA1';
    let oauth_signature='';
    let oauth_timestamp=Date.now();
    let oauth_version='1.0';
    let baseArguments=`oauth_callback=oob&oauth_consumer_key=${FLICKR_API_KEY}&oauth_nonce=${oauth_nonce}&oauth_signature_method=${oauth_signature_method}&oauth_timestamp=${oauth_timestamp}&oauth_version=${oauth_version}`;
    let baseStringURL=`${httpVerb}${encodeURIComponent(request_url)}&${encodeURIComponent(baseArguments)}`;
    JSHmac(baseStringURL, `${FLICKR_API_SECRET}&`, CONSTANTS.HmacAlgorithms.HmacSHA1)
      .then(hash => {
        oauth_signature=encodeURIComponent(Buffer.from(hash, 'hex').toString('base64'));
        //this.setState({oauth_signature: oauth_signature});
        let request_token_url=`${request_url}?${baseArguments}&oauth_signature=${oauth_signature}`;
        fetch(request_token_url)
        .then(response => response.text())
        .then(resp => {
            //Parse out oauth_token and oauth_token_secret
            //console.log('requestFlickrToken resp', resp);
            this.oauth_token=resp.split("&")[1].split("=")[1];
            this.oauth_token_secret=resp.split("&")[2].split("=")[1];
            this.oauth_url = `https://www.flickr.com/services/oauth/authorize?oauth_token=${this.oauth_token}`;
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(e => console.log(e));
  }

  //Logic for authenticating Flickr token using OAuth v. 1
  //This method is incomplete and failing on resetting the token and token secret
  authenticateFlickrToken(oauth_verifier) {
    let access_url='https://www.flickr.com/services/oauth/access_token';
    let httpVerb = 'GET&';
    let oauth_nonce=uuidv4();
    let oauth_signature_method='HMAC-SHA1';
    let oauth_signature='';
    let oauth_timestamp=Date.now();
    let oauth_version='1.0';
    let baseArguments=`oauth_consumer_key=${FLICKR_API_KEY}&oauth_nonce=${oauth_nonce}&oauth_signature_method=${oauth_signature_method}&oauth_timestamp=${oauth_timestamp}&oauth_token=${this.oauth_token}&oauth_verifier=${oauth_verifier}&oauth_version=${oauth_version}`;
    let baseStringURL=`${httpVerb}${encodeURIComponent(access_url)}&${encodeURIComponent(baseArguments)}`;
    JSHmac(baseStringURL, `${FLICKR_API_SECRET}&${this.oauth_token_secret}`, CONSTANTS.HmacAlgorithms.HmacSHA1)
      .then(hash => {
        oauth_signature=encodeURIComponent(Buffer.from(hash, 'hex').toString('base64'));
        let request_auth_url=`${access_url}?${baseArguments}&oauth_signature=${oauth_signature}`;
        fetch(request_auth_url)
        .then(response => response.text())
        .then(resp => {
            //Parse out oauth_token and oauth_token_secret
            this.oauth_token=resp.split("&")[1].split("=")[1];
            this.oauth_token_secret=resp.split("&")[2].split("=")[1];
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(e => console.log(e));
  }
}
