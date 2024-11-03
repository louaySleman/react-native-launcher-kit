import React from 'react';
import {View, Image, Text} from 'react-native';
import {AppDetailProps} from './types';
import {styles} from './styles';

const AppDetail: React.FC<AppDetailProps> = ({app}) => (
  <View
    style={[
      styles.container,
      {backgroundColor: `${app.accentColor}8f` || '#f6d5d5'},
    ]}>
    <Image style={styles.image} source={{uri: app.icon}} />
    <Text style={styles.label}>Name: {app.label}</Text>
    <Text style={styles.packageName}>BundleID: {app.packageName}</Text>
  </View>
);

export default AppDetail;
