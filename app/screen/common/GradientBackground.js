import { ImageBackground, StyleSheet, View } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { color as colors, normalize } from '../../helper/themeHelper';
import { THEME_COLOR } from '../../helper/constant';
const GradientBackground = (props) => {
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={THEME_COLOR}
      style={{ flex: 1 }}
    >
      {props.children}
    </LinearGradient>
  );
};
const style = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: normalize(15),
    fontWeight: 'bold',
    color: colors.blue,
  },
});
export { GradientBackground };
