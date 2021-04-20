import React from 'react';
import { Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import PhotoAlbumsScreen from './PhotoAlbumsScreen.js'
import PhotoAlbumScreen from './PhotoAlbumScreen.js'
import PhotoDetailsScreen from '../Home/PhotoDetailsScreen.js'

import { TouchableOpacity } from 'react-native-gesture-handler';

const Stack = createStackNavigator();

export default function Albums({ navigation }) {
    return (
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen
              name="PhotoAlbums"
              component={PhotoAlbumsScreen}
              options={{ title: 'Photo Albums' }}

          />
          <Stack.Screen
              name="PhotoAlbum"
              component={PhotoAlbumScreen}
              options={{ title: 'Photo Album' }}

          />
          <Stack.Screen
            name="PhotoDetails"
            component={PhotoDetailsScreen}
            options={{ title: 'Photo Details' }}

          />
        </Stack.Navigator>
    );
}
