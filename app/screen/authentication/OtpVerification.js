import React, { useCallback, useEffect, useState } from 'react';
import { CommonActions } from '@react-navigation/native';

import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { memberLogin } from '../../redux/actions/userAuth';
import user_logo from '../../assets/images/user_icon.png';
import password_img from '../../assets/images/padlock.png';
import CloseButton from '../common/ClearButton';
import CheckImage from '../../assets/images/check.png';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  AppState,
  Modal,
  Image,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import AsyncStorage from '@react-native-community/async-storage';

import { color, font, hp, isANDROID, isIOS, isWEB, normalize, wp } from '../../helper/themeHelper';
import {
  AppButton,
  Background,
  FloatingLabel,
  InitialHeader,
  InitialView,
  Loading,
  CustomText,
  GradientBackground,
  GoBackHeader,
} from '../common';
// import OTPInputView from '@twotalltotems/react-native-otp-input';
import CodeInput from 'react-native-confirmation-code-input';

// import {Image} from "react-native-web";
import DefaultMaleIcon from '../../assets/images/user_male.png';
import { back_arrow_icon } from '../../assets/images';

const OtpVerificationScreen = (props) => {
  const {
    iconContainer,
    floatingStyle,
    floatingInputStyle,
    textInputContainer,
    checkBoxView,
  } = style;
  const { otp = null, phoneNumber = null } = props.route.params;
  const [checkBoxState, setCheckBoxState] = useState(0);
  const temp = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.appDefaultSettingReducer.isLoading);
  const [userdata, setUserData] = useState({
    mobile: temp,
    password: '',
    dob: '',
    dobForState: '',
    token: '',
    name: '',
    fromLogin: false,
    memberId: 0,
    deviceId: '',
    email: '',
  });
  const [isValidUserName, setUsernameState] = useState(true);
  const [isValidPwd, setIsValidPwd] = useState(true);
  const clearInputForMobile_ID = () => {
    setUserData({ ...userdata, email: '' });
  };
  const clearInputForPassword = () => {
    setUserData({ ...userdata, password: '' });
  };
  useEffect(() => {
    alert(otp)
    if (!isWEB) {
      AsyncStorage.getItem('userLoginDetail').then((res) => {
        if (res) {
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Drawer' }],
            })
          );
        }
      });
      AsyncStorage.getItem('rememberMeData').then((res) => {
        if (res) {
          var obj = JSON.parse(res);
          setUserData({ ...userdata, email: obj.email });
          setCheckBoxState(1);
        }
      });
    }
  }, []);
  const checkForValidOtp = (otpNumber) => {
    if (otp !== null && phoneNumber !== null) {
      if (parseInt(otpNumber) === parseInt(otp)) {
        props.navigation.replace('SetNewPassword', { phoneNumber: phoneNumber });
      } else {
        alert('OTP not matched...please try again');
      }
    }
    Keyboard.dismiss();
    // props.navigation.replace('SetNewPassword', {memberId: memberId});
    // props.navigation.replace('SetNewPassword');
    // if (responseOtp.indexOf(otpNumber) < 0) {
    //     alert('Invalid OTP');
    //     // props.navigation.replace('ResetPassword', {memberId: memberId});
    //     setOtp([]);
    // } else {
    //     // tempResponseOtp = [];
    //     setOtp([]);
    //     props.navigation.replace('SetNewPassword', {memberId: memberId});
    // }
  };
  const renderLoginView = () => {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: hp(40), alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              height: hp(15),
              width: hp(15),
              borderRadius: hp(7.5),
              backgroundColor: '#9e4756',
            }}
          />
        </View>
        <View style={{ height: hp(70) }}>
          <View style={{ paddingLeft: wp(10), paddingRight: wp(10) }}>
            {/*<OTPInputView*/}
            {/*  style={{ width: '80%', height: hp(1) }}*/}
            {/*  pinCount={6}*/}
            {/*  autoFocusOnLoad={true}*/}
            {/*  codeInputFieldStyle={style.underlineStyleBase}*/}
            {/*  codeInputHighlightStyle={style.underlineStyleHighLighted}*/}
            {/*  onCodeFilled={(code) => {*/}
            {/*    setTimeout(() => {*/}
            {/*      checkForValidOtp(code);*/}
            {/*    }, 500);*/}
            {/*  }}*/}
            {/*  // placeholderCharacter={''}*/}
            {/*  placeholderTextColor={color.black}*/}
            {/*/>*/}
            {isIOS ? (
             <View/>
            ) : (
              <CodeInput
                compareWithCode={'123456'}
                activeColor="rgba(85, 120, 196, 1)"
                inactiveColor={'black'}
                autoFocus={true}
                ignoreCase={true}
                inputPosition="center"
                codeLength={6}
                className={'border-b'}
                size={50}
                containerStyle={{ marginTop: hp(-5) }}
                onFulfill={(isValid, code) => {
                  setTimeout(() => {
                    checkForValidOtp(code);
                  }, 500);
                }}
              />
            )}

            {/*<AppButton*/}
            {/*  title={'Verify' + ' '}*/}
            {/*  onPress={() => {*/}
            {/*    // if (checkBoxState && !isWEB) {*/}
            {/*    //     AsyncStorage.setItem('rememberMeData', JSON.stringify(userdata));*/}
            {/*    // } else {*/}
            {/*    //     if(!isWEB){*/}
            {/*    //         AsyncStorage.getItem('rememberMeData').then(res => {*/}
            {/*    //             if (res) {*/}
            {/*    //                 AsyncStorage.removeItem('rememberMeData');*/}
            {/*    //             }*/}
            {/*    //         });*/}
            {/*    //     }*/}
            {/*    //*/}
            {/*    // }*/}
            {/*    // dispatch(memberLogin(userdata)).then((res)=>{if(res){*/}
            {/*    //     props.navigation.dispatch(*/}
            {/*    //         CommonActions.reset({*/}
            {/*    //             index: 0,*/}
            {/*    //             routes: [{name: 'Drawer'}],*/}
            {/*    //         })*/}
            {/*    //     );*/}
            {/*    // }})*/}
            {/*  }}*/}
            {/*  containerStyle={{ marginTop: isANDROID ? hp(7) : hp(5), width: wp(50) }}*/}
            {/*/>*/}
          </View>
        </View>
      </View>
    );
  };
  const renderLoginViewForWeb = () => {
    return (
      <View style={{ height: hp(100), width: wp(100) }}>
        <View style={{ height: hp(40), alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              height: hp(15),
              width: hp(15),
              borderRadius: hp(7.5),
              backgroundColor: '#9e4756',
            }}
          />
        </View>
        <View style={{ height: hp(60) }}>
          <View style={{ paddingLeft: wp(10), paddingRight: wp(10) }}>
            <View>
              <View
                style={[
                  textInputContainer,
                  { borderBottomColor: isValidUserName ? color.gray : color.red },
                ]}
              >
                <View style={iconContainer}>
                  <Image style={{ height: hp(2.5), width: hp(2.5) }} source={user_logo} />
                </View>

                <View style={{ flex: 1 }}>
                  <FloatingLabel
                    inputStyle={floatingInputStyle}
                    style={floatingStyle}
                    value={userdata.email}
                    returnKeyType={'done'}
                    onBlur={() => {
                      if (userdata.mobile.length === 0) {
                        setUsernameState(false);
                      } else {
                        setUsernameState(true);
                      }
                    }}
                    onChangeText={(text) => {
                      setUserData({ ...userdata, email: text });
                    }}
                    label={'Mobile Number' + ' '}
                  />
                </View>
                {userdata.email.length > 0 && (
                  <CloseButton
                    crossIconOpacity={1}
                    padding={5}
                    clearData={clearInputForMobile_ID}
                  />
                )}
              </View>
            </View>
            <View style={{ marginTop: hp(2) }}>
              <View
                style={[
                  textInputContainer,
                  { borderBottomColor: isValidPwd ? color.gray : color.red },
                ]}
              >
                <View style={iconContainer}>
                  <Image style={{ height: hp(2.5), width: hp(2.5) }} source={password_img} />
                </View>

                <View style={{ flex: 1 }}>
                  <FloatingLabel
                    inputStyle={floatingInputStyle}
                    style={floatingStyle}
                    value={userdata.password}
                    returnKeyType={'done'}
                    secureTextEntry={true}
                    onBlur={() => {
                      if (userdata.password.length === 0) {
                        setIsValidPwd(false);
                      } else {
                        setIsValidPwd(true);
                      }
                    }}
                    onChangeText={(text) => {
                      setUserData({ ...userdata, password: text });
                    }}
                    label={'Password' + ' '}
                  />
                </View>
                {userdata.password.length > 0 && (
                  <CloseButton crossIconOpacity={1} padding={5} clearData={clearInputForPassword} />
                )}
              </View>
            </View>
            <View
              style={{
                marginTop: hp(1),
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => (checkBoxState === 0 ? setCheckBoxState(1) : setCheckBoxState(0))}
              >
                <View style={checkBoxView}>
                  {checkBoxState === 1 && (
                    <Image source={CheckImage} style={{ height: hp(1.7), width: hp(1.7) }} />
                  )}
                </View>
              </TouchableWithoutFeedback>
              <View>
                <CustomText style={{ marginLeft: hp(1) }}>{'Remember Me' + ' '}</CustomText>
              </View>
            </View>
            <AppButton
              title={'Login' + ' '}
              onPress={() => {
                // if (checkBoxState && !isWEB) {
                //     AsyncStorage.setItem('rememberMeData', JSON.stringify(userdata));
                // } else {
                //     if(!isWEB){
                //         AsyncStorage.getItem('rememberMeData').then(res => {
                //             if (res) {
                //                 AsyncStorage.removeItem('rememberMeData');
                //             }
                //         });
                //     }
                //
                // }
                // dispatch(memberLogin(userdata)).then((res)=>{if(res){
                //     props.navigation.dispatch(
                //         CommonActions.reset({
                //             index: 0,
                //             routes: [{name: 'Drawer'}],
                //         })
                //     );
                // }})
              }}
              containerStyle={{ marginTop: hp(5), width: wp(50) }}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {isLoading && <Loading isLoading={isLoading} />}
      <GoBackHeader title={''} onMenuPress={() => props.navigation.goBack()} />
      <KeyboardAwareScrollView
        style={{ backgroundColor: 'white' }}
        contentContainerStyle={{ zIndex: 1 }}
        keyboardShouldPersistTaps="handled"
        keyboardVerticalOffset={isANDROID ? -hp(35) : -hp(10)}
        behavior={'position'}
        enabled
      >
        <GradientBackground>
          {/*{isWEB?renderLoginViewForWeb():renderLoginView()}*/}
          {renderLoginView()}
        </GradientBackground>
      </KeyboardAwareScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  titleText: {
    fontSize: normalize(18),
    color: color.blue,
    // fontFamily: font.robotoRegular,
    alignSelf: 'center',
  },
  initialLogoStyle: {
    height: hp(35),
    width: hp(35),
  },
  loginLogoStyle: {
    marginTop: hp(0),
    marginBottom: hp(5),
    height: hp(25),
    width: hp(25),
  },
  inputWrapper: {
    height: hp(4),
    flexDirection: 'row',
    justifyContent: 'center',
  },
  otpTextInputStyle: {
    height: wp(10),
    width: wp(10),
    borderColor: color.blue,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(1.5),
    fontSize: normalize(16),
    textAlign: 'center',
  },
  iconContainer: {
    marginBottom: isANDROID ? hp(1.5) : hp(1.2),
    marginHorizontal: wp(2),
  },
  floatingStyle: {
    color: 'red',
    fontSize: normalize(20),
  },
  floatingInputStyle: {
    borderWidth: 0,
    fontSize: normalize(14),
    // fontFamily: font.robotoRegular,
    height: isANDROID ? hp(6) : hp(5),
    marginTop: isANDROID ? hp(3) : hp(2),
  },
  floatingLableStyle: {
    // fontFamily: font.robotoRegular,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    marginVertical: hp(0.5),
  },
  checkBoxView: {
    height: hp(2),
    width: hp(2),
    borderWidth: hp(0.05),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossButton: {
    alignSelf: 'flex-end',
    padding: hp(2),
    marginTop: hp(3),
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    color: 'black',
  },
  underlineStyleHighLighted: {
    borderColor: color.themeBtnColor,
  },
});

export default OtpVerificationScreen;
