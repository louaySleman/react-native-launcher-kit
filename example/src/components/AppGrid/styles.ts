import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  appIconContainer: {
    margin: 10,
    backgroundColor: '#000',
    borderRadius: 20,
    width: 60,
    height: 60,
    overflow: 'hidden',
  },
  appIcon: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    padding: 0,
  },
});
