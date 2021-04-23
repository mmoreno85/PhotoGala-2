import React, { Component } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from '../screens/Home'; //Navigation stack defined in Photos/index.js
import AddPhotoScreen from '../screens/Home/AddPhotoScreen'; //Navigation stack defined in Settings/index.js
import PhotoAlbums from '../screens/Albums'; //Navigation stack defined in Settings/index.js

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home';
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
            } else if (route.name === 'Albums') {
              iconName =  'images';
              return <Ionicons name={iconName} size={size} color={color} />;
            }
            else if (route.name === 'Add') {
              iconName =  'add';
              return <Ionicons name={iconName} size={size} color={color} />;
            }


          },
        })}
        tabBarOptions={{
          activeTintColor: 'red',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Add" component={AddPhotoScreen} />
        <Tab.Screen name="Albums" component={PhotoAlbums} />
      </Tab.Navigator>
  );
}
