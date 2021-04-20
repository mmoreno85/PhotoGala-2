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

//Method to retrieve a listing of photos from Flickr
function fetchPhotos() {
  const API_STEM = `https://www.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=${FLICKR_API_KEY}&format=json&nojsoncallback=1`;
  return fetch(API_STEM)
    .then(response => response.json())
    .then(responseJSON => {
      //console.log(responseJSON);
      return {
        photos: responseJSON.photos,
      };
    })
    .catch(error => {
      console.error(error);
    });
}

//Method to retrieve a listing of location-based photos from Flickr
function photosByLocation(lat, lon) {
  const API_STEM = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${FLICKR_API_KEY}&lat=${lat}&lon=${lon}&format=json&nojsoncallback=1`;
  return fetch(API_STEM)
    .then(response => response.json())
    .then(responseJSON => {
      return {
        photos: responseJSON.photos,
      };
    })
    .catch(error => {
      console.error(error);
    });
}

//Method to retrieve a URL for a user's photostream
function fetchPhotoStream() {
  return `https://www.flickr.com/photos/${USER_ID}/`;
}

//Method to retrieve a listing of user photos from Flickr
function fetchUserPhotos() {
  const API_STEM = `https://www.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=${FLICKR_API_KEY}&format=json&nojsoncallback=1`;
  return fetch(API_STEM)
    .then(response => response.json())
    .then(responseJSON => {
      return {
        photos: responseJSON.photos,
      };
    })
    .catch(error => {
      console.error(error);
    });
}
//Method to retrieve a listing of photo albums from Flickr
function fetchPhotoAlbums() {
  const API_STEM = `https://www.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=${FLICKR_API_KEY}&user_id=${USER_ID}&format=json&nojsoncallback=1`;
  return fetch(API_STEM)
    .then(response => response.json())
    .then(responseJSON => {
      return {
        photosets: responseJSON.photosets,
      };
    })
    .catch(error => {
      console.error(error);
    });
}
//Method to retrieve a listing of photos from Flickr photo album
function fetchPhotoAlbum(album_id) {
  const API_STEM = `https://www.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${FLICKR_API_KEY}&photoset_id=${album_id}&user_id=${USER_ID}&format=json&nojsoncallback=1`;
  return fetch(API_STEM)
    .then(response => response.json())
    .then(responseJSON => {
      return {
        photosets: responseJSON.photoset,
      };
    })
    .catch(error => {
      console.error(error);
    });
}

//Method to retrieve a single photo from Flickr
function fetchPhoto(photo_id, server_id='', secret='', farm='', owner='') {
  let photo_url='';
  if(server_id=='' || secret =='') {
    const API_STEM = `https://www.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${FLICKR_API_KEY}&photo_id=${photo_id}&format=json&nojsoncallback=1`;
    return fetch(API_STEM)
      .then(response => response.json())
      .then(responseJSON => {
        photo_url = `https://live.staticflickr.com/${responseJSON.photo.server}/${responseJSON.photo.id}_${responseJSON.photo.secret}_w.jpg`;
        return photo_url;
      })
      .catch(error => {
        console.error(error);
      });
  }
  else {
    return `https://live.staticflickr.com/${server_id}/${photo_id}_${secret}_w.jpg`;
  }

}

//Method to retrieve profile info from FLickr
function fetchProfile() {
  const API_STEM = `https://www.flickr.com/services/rest/?method=flickr.profile.getProfile&api_key=${FLICKR_API_KEY}&user_id=${USER_ID}&format=json&nojsoncallback=1`;
  return fetch(API_STEM)
    .then(response => response.json())
    .then(responseJSON => {
      return {
        profile: responseJSON.profile
      };
    })
    .catch(error => {
      console.error(error);
    });
}
//Method to upload photos to a user's photostream using signed request
uploadPhoto = async (photoURI, oauth_token, oauth_token_secret, nav) => {
  let upload_url='https://up.flickr.com/services/upload';
  let httpVerb = 'POST&';
  let oauth_nonce=uuidv4();
  let oauth_signature_method='HMAC-SHA1';
  let oauth_signature='';
  let oauth_timestamp=Date.now();
  let oauth_version='1.0';
  let filenameParts=photoURI.split('/');
  let fileName=filenameParts[filenameParts.length-1];
  let fileExtension=fileName.split('.')[1];
  let baseArguments=`oauth_consumer_key=${FLICKR_API_KEY}&oauth_nonce=${oauth_nonce}&oauth_signature_method=${oauth_signature_method}&oauth_timestamp=${oauth_timestamp}&oauth_token=${oauth_token}&oauth_version=${oauth_version}`;
  let baseStringURL=`${httpVerb}${encodeURIComponent(upload_url)}&${encodeURIComponent(baseArguments)}`;
  JSHmac(baseStringURL, `${FLICKR_API_SECRET}&${oauth_token_secret}`, CONSTANTS.HmacAlgorithms.HmacSHA1)
    .then(hash => {
      oauth_signature=Buffer.from(hash, 'hex').toString('base64');
      let upload_auth_url=`${upload_url}?${baseArguments}&oauth_signature=${oauth_signature}`;
      let data = new FormData();
      data.append('oauth_consumer_key', FLICKR_API_KEY);
      data.append('oauth_nonce', oauth_nonce);
      data.append('oauth_signature_method', oauth_signature_method);
      data.append('oauth_signature', oauth_signature);
      data.append('oauth_timestamp', oauth_timestamp);
      data.append('oauth_token', oauth_token);
      data.append('oauth_version',oauth_version );
      data.append('photo', {
        uri: photoURI,
        name: `${fileName}`,
        type: `image/${fileExtension}`,
      });
      fetch(upload_url, {
        method: 'POST',
        body: data,
      })
      .then(response => response.text())
      .then(resp => {
          parseString(resp, function (err, result) {
            let photoid='';
            photoid=result.rsp.photoid[0];
            nav.navigate('Details',{photo_id: photoid});
          });
        })
        .catch(error => {
          console.error(error);
        });
    })
    .catch(e => console.log(e));
}

//Method to retrieve profile info from FLickr
function fetchProfilePhoto() {
  const API_STEM = `https://www.flickr.com/services/rest/?method=flickr.people.getPhotos&api_key=${FLICKR_API_KEY}&user_id=${USER_ID}&format=json&nojsoncallback=1`;
  return fetch(API_STEM)
    .then(response => response.json())
    .then(responseJSON => {
      let photo_url= fetchPhoto(responseJSON.photos.photo[0].id,responseJSON.photos.photo[0].server,responseJSON.photos.photo[0].secret,responseJSON.photos.photo[0].farm,responseJSON.photos.photo[0].owner);
      return {photo_url: photo_url};
    })
    .catch(error => {
      console.error(error);
    });
}

 export default {fetchPhotos: fetchPhotos, photosByLocation: photosByLocation, fetchPhotoStream: fetchPhotoStream, fetchPhotoAlbums: fetchPhotoAlbums, fetchPhotoAlbum: fetchPhotoAlbum, fetchPhoto: fetchPhoto, fetchProfile: fetchProfile, fetchProfilePhoto: fetchProfilePhoto, uploadPhoto: uploadPhoto, fetchUserPhotos: fetchUserPhotos };
