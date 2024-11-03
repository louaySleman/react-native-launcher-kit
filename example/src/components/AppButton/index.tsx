import React from 'react';
import {Pressable, Text} from 'react-native';
import {AppButtonProps} from './types';
import {styles} from './styles';

const AppButton: React.FC<AppButtonProps> = ({onPress, title}) => (
  <Pressable
    android_ripple={{color: '#523680FF', radius: 200}}
    style={styles.button}
    onPress={onPress}>
    <Text style={styles.text}>{title}</Text>
  </Pressable>
);

export default AppButton;
