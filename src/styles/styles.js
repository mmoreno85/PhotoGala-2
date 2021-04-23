import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  imageContainer: {
    flex: 1, alignItems: 'center'
  },
  headerText: {
    fontSize: 24
  },
  photoHeaderText: {
    fontSize: 24, textAlign: 'center'
  },
  imageContainer: {
    alignItems: 'center'
  },
  imageCaption: {
    color: 'blue', fontSize: 16, textAlign: 'center'
  },
  menuHeading: {
    fontSize: 24, padding: 16
  },
  mainMenu: {
    flex: 1, flexDirection: 'column'
  },
  menuItems: {
    fontSize: 16, padding: 25
  },
  drawerContainer: {
    paddingTop: 50,
  },
  drawerHeaderView: {
    borderStyle: 'solid',
    borderBottomWidth: 2,
    paddingBottom: 10,
  },
  drawerHeaderText: {
    fontSize: 24,
  },
  drawerMenuItem: {
    padding: 20, fontSize: 18
  },
  settingsHeaderView: {
    paddingBottom: 10,
  },
  settingsHeaderText: {
    fontSize: 24,
  },
  settingsItem: {
    paddingBottom: 10,
  },
  settingsText: {
    fontSize: 16,
  },
  albumOptions: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: 'blue',
  },
  addPhotoButton: {
    fontSize: 16,
    color: "brown",
  }
});

export { styles }
