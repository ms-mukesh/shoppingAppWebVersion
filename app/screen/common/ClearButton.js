import React, {useCallback, useEffect, useState} from 'react';

import {color, hp, wp} from '../../helper/themeHelper';
import {TouchableWithoutFeedback,Image} from 'react-native';
import closeIcon from '../../assets/images/close.png'
import {cross_black_icon} from "../../assets/images";

const CloseButton = props => {
  const {clearData, crossIconOpacity, padding} = props;
  return (
    <TouchableWithoutFeedback style={{justifyContent: 'center'}} onPress={clearData}>
      <Image
          source={cross_black_icon}
        style={{marginBottom:hp(1),height:hp(1.5),width:hp(1.5), opacity: crossIconOpacity}}
      />
    </TouchableWithoutFeedback>
  );
};
export default CloseButton;
