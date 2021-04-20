import React from 'react';
import { Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen.js'
import PhotosScreen from './PhotosScreen.js'
import PhotoViewerScreen from './PhotoViewerScreen.js'
import PhotoDetailsScreen from './PhotoDetailsScreen.js'
import AddPhotoScreen from './AddPhotoScreen.js'
import PhotoStreamScreen from './PhotoStreamScreen.js'
import FlickrAuthScreen from './FlickrAuthScreen.js'

const Stack = createStackNavigator();

export default function Photos({ navigation }) {
    return (
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'Home Screen' }}

          />
          <Stack.Screen
              name="PhotoStream"
              component={PhotoStreamScreen}
              options={{ title: 'PhotoStream' }}
          />
          <Stack.Screen
              name="Photos"
              component={PhotosScreen}
              options={{ title: 'Photo Listing' }}

          />
            <Stack.Screen
                name="PhotoViewer"
                component={PhotoViewerScreen}
                options={{ title: 'Photo Viewer' }}
            />
            <Stack.Screen
                name="Details"
                component={PhotoDetailsScreen}
                options={{ title: 'Photo Detail' }}
            />
            <Stack.Screen
                name="AddPhoto"
                component={AddPhotoScreen}
                options={{ title: 'Add photo' }}
            />
            <Stack.Screen
                name="FlickrAuth"
                component={FlickrAuthScreen}
                options={{ title: 'FlickrAuth' }}
            />
        </Stack.Navigator>
    );
}
