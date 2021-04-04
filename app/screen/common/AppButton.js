import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import {hp, normalize, wp, color, font} from '../../helper/themeHelper';
import {shadowStyle} from '../../helper/styles';

const AppButton = props => {
  const {btnLayout, btnText} = style;
  const {onPress, title, containerStyle, disabled = false,customBtnText} = props;
  return (
    <TouchableOpacity
        activeOpacity={0.8}
      style={[btnLayout, containerStyle, {...props.style}]}
      onPress={onPress}
      disabled={disabled}>
      <Text allowFontScaling={false} style={[btnText,customBtnText]}>{title}</Text>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  btnLayout: {
    backgroundColor: color.themeBtnColor,
    width: wp(84),
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(1.5),
    ...shadowStyle,
    alignSelf: 'center',
  },
  btnText: {
    fontSize: normalize(16),
    // fontFamily: font.robotoBold,
    fontWeight:'700',
    color: color.white,
  },
});

export {AppButton};
