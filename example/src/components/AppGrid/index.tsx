import React from 'react';
import {View, Pressable, Image} from 'react-native';
import {AppGridProps} from './types';
import {styles} from './styles';

const AppGrid: React.FC<AppGridProps> = ({
  apps,
  showWithAccent,
  onAppPress,
}) => (
  <View style={styles.container}>
    {apps.map(item => (
      <Pressable
        key={item.packageName}
        onPress={() => onAppPress(item.packageName)}
        style={[
          styles.appIconContainer,
          {
            backgroundColor: showWithAccent
              ? `${item.accentColor}`
              : 'transparent',
          },
        ]}>
        <Image
          style={[
            styles.appIcon,
            showWithAccent && {transform: [{scale: 0.7}]},
          ]}
          source={{uri: `${item.icon}`}}
        />
      </Pressable>
    ))}
  </View>
);

export default AppGrid;
