import React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {LoadingProps} from './types';
import {styles} from './styles';

const Loading: React.FC<LoadingProps> = ({message = 'Loading Apps...'}) => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#9261E2" />
    <Text style={styles.text}>{message}</Text>
  </View>
);

export default Loading;
