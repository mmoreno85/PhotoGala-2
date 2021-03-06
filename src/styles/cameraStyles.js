// src/styles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width: winWidth, height: winHeight } = Dimensions.get('window');

const cameraStyle = StyleSheet.create({
  container: {
  },

  cameraWindow: {
    flexDirection: 'column-reverse',
    height: winHeight,
    width: winWidth,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  preview: {
      height: winHeight,
      width: winWidth,
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
  },
  photoPreview: {
    flexDirection: 'column-reverse',
      height: winHeight,
      width: winWidth,
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
  },
  photoPreviewWindow: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  toolbar: {
    position: 'absolute',
    flexDirection: 'row',
    alignSelf: 'center',
    paddingBottom: 50,
  },
  cameraIcon: {
    padding: 25,
  },
});

export { cameraStyle }
