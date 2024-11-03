import React from 'react';
import {View, Text} from 'react-native';
import {BatteryInfoProps} from './types';
import {styles} from './styles';

const BatteryInfo: React.FC<BatteryInfoProps> = ({battery}) => (
  <View style={styles.container}>
    <Text style={styles.title}>Battery Level</Text>
    <Text style={styles.text}>{battery.level}</Text>
    <Text style={styles.title}>Is Battery charging:</Text>
    <Text style={styles.text}>{battery.isCharging ? 'true' : 'false'}</Text>
  </View>
);

export default BatteryInfo;
