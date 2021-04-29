import React, { useEffect, useState } from 'react';
import { CommonActions } from '@react-navigation/native';

import { useDispatch, useSelector } from 'react-redux';
import { addFCMTokenToDb, memberLogin, setUserDetails } from '../../redux/actions/userAuth';
import user_logo from '../../assets/images/user_icon.png';
import password_img from '../../assets/images/padlock.png';
import CloseButton from '../common/ClearButton';
import CheckImage from '../../assets/images/check.png';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  getDeviceToken,
  listenerForNotification,
  requestPermissionForNotification,
} from '../../helper/notificationHelper';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,

  Image,
  Linking, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import AsyncStorage from '@react-native-community/async-storage';
import * as Device from 'expo-device';
import { color, hp, isANDROID, isWEB, normalize, wp } from '../../helper/themeHelper';
import { AppButton, FloatingLabel, Loading, CustomText, GradientBackground } from '../common';
import HTML from 'react-native-render-html';

import { setLoaderStatus } from '../../redux/actions/dashboardAction';
import {getCustomerOrder, getMyAddresses} from "../../redux/actions/userActions";
import {getRecentItemList} from "../../redux/actions/homeScreenActions";
import {TextInput} from "react-native-web";

const LoginScreen = (props) => {
  const {
    iconContainer,
    floatingStyle,
    floatingInputStyle,
    textInputContainer,
    checkBoxView,
  } = style;
  const [checkBoxState, setCheckBoxState] = useState(0);
  const { fromPopUp = false,productId = null } = props.route.params;
  console.log("props from login page",props)
  // console.log("name---",fromPopUp)
  const htmlContent = `
   <html>  
<head>  
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">  
<title>Insert title here</title>  
<script type="text/javascript">
function test2(){
    var di = document.getElementById("di");
    di.innerHTML = "app have not installed";
}
function newOpen(){//184 064 323 438
    var di = document.getElementById("di");
    di.innerHTML = "app have installed";
    var ifc = document.getElementById("ifc");
    ifc.innerHTML = "<iframe src='mukesh://shoppingapp' onload='test2()'></iframe>";
    return false;
}
</script>
</head>  
<body>  
 <a href="#" onclick="return newOpen()">local3</a><br/> 
<div id="di"></div> 
 <div style="display:none;" id="ifc"></div>
</body>  
</html>
`;

  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.appDefaultSettingReducer.isLoading);
  const [userdata, setUserData] = useState({
    mobile: '',
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
    setUserData({ ...userdata, mobile: '' });
  };
  const clearInputForPassword = () => {
    setUserData({ ...userdata, password: '' });
  };
  const navigate = (url) => {
    // E
    console.log('reached here!');
    const { navigate } = props.navigation;
    const route = url.replace(/.*?:\/\//g, '');
    // alert(route);
    // const id = route.match(/\/([^\/]+)\/?$/)[1];
    // const routeName = route.split('/')[0];

    //604eff5c15f30c00048bb782
    // if (routeName === 'productdetail') {

    navigate('authentication', {
      // productDetails: res,
      productId: '604eff5c15f30c00048bb782',
      productImage: null,
      price: 0,
      productName: null,
      // productName: res?.name,
    });
    // }
  };
  const handleOpenURL = (event) => {
    navigate(event.url);
  };
  // useEffect(() => {
  //   if (Device.osName === 'Android')
  //     Linking.getInitialURL().then((url) => {
  //       Linking.openURL(
  //         'intent://shoppingapp/#Intent;scheme=mukesh;package=com.shoppingproject;S.content=WebContent;end'
  //       );
  //     });
  // }, []);

  useEffect(() => {

    console.log("os--",Device.osName)



    dispatch(setLoaderStatus(false));
      AsyncStorage.getItem('userLoginDetail').then(async (res) => {
        if (res) {
          dispatch(setUserDetails(JSON.parse(res)));
          dispatch(getCustomerOrder()).then((res) => {});
          dispatch(getMyAddresses()).then((res) => {});
          dispatch(getRecentItemList()).then((res) => {
            if (res) {
            }
          });

          if (productId !== null) {
            props.navigation.navigate('ProductDetail', {
              productId: productId,
              productImage: null,
              price: 0,
              productName: '',
              isFromShareLink: true,
              // productName: res?.name,
            });
          } else {
            props.navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Dashboard' }],
                })
            );
          }
        }
      });
      AsyncStorage.getItem('rememberMeData').then((res) => {
        if (res) {
          var obj = JSON.parse(res);
          setUserData({ ...userdata, mobile: obj.mobile });
          setCheckBoxState(1);
        }
      });

  }, []);
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
          <View style={{ paddingLeft: wp(30), paddingRight: wp(30) }}>
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
                    value={userdata.mobile}
                    returnKeyType={'done'}
                    placeholder={"Mobile Number"}
                    onBlur={() => {
                      if (userdata.mobile.length === 0) {
                        setUsernameState(false);
                      } else {
                        setUsernameState(true);
                      }
                    }}
                    onChangeText={(text) => {
                      setUserData({ ...userdata, mobile: text });
                    }}
                    label={'Mobile Number' + ' '}
                    keyboardType={'phone-pad'}
                  />
                </View>
                {userdata.mobile.length > 0 && (
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
                    placeholder={"Password"}
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
                if (checkBoxState) {
                  AsyncStorage.setItem('rememberMeData', JSON.stringify(userdata));
                } else {
                  if (isWEB) {
                    AsyncStorage.getItem('rememberMeData').then((res) => {
                      if (res) {
                        AsyncStorage.removeItem('rememberMeData');
                      }
                    });
                  }
                }
                if (
                  userdata?.mobile === '' ||
                  userdata?.mobile?.length !== 10 ||
                  userdata?.mobile === null ||
                  isNaN(userdata?.mobile)
                ) {
                  alert('please enter a correct mobile number');
                  return;
                } else if (
                  userdata?.password === '' ||
                  userdata?.password?.length === 0 ||
                  userdata?.password === null
                ) {
                  alert('please enter password');
                  return;
                }

                dispatch(memberLogin(userdata, props.navigation)).then(async (res) => {
                  if (res) {
                    dispatch(getCustomerOrder()).then((res) => {});
                    dispatch(getMyAddresses()).then((res) => {});
                    dispatch(getRecentItemList()).then((res) => {
                      if (res) {
                      }
                    });
                    if (productId !== null) {
                      props.navigation.navigate('ProductDetail', {
                        productId: productId,
                        productImage: null,
                        price: 0,
                        productName: '',
                        isFromShareLink: true,
                        // productName: res?.name,
                      });
                    } else {
                      props.navigation.dispatch(
                          CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'Dashboard' }],
                          })
                      );
                    }

                    // props.navigation.dispatch(
                    //     CommonActions.reset({
                    //       index: 0,
                    //       routes: [{ name: 'Dashboard' }],
                    //     })
                    // );
                  }
                });
              }}
              containerStyle={{ marginTop: hp(5), width: wp(20) }}
            />

            <Text style={{ textAlign: 'center', marginTop: hp(2) }}>
              Don't have an account?{' '}
              <Text
                onPress={() => {
                  props.navigation.navigate('SignUp', { forResetPasswordFlag: false });
                }}
                style={{ fontWeight: '700', color: '#e54951' }}
              >
                SIGNUP
              </Text>
            </Text>
            <Text style={{ textAlign: 'center', marginTop: hp(2) }}>
              forget password?{' '}
              <Text
                onPress={() => {
                  props.navigation.navigate('SignUp', { forResetPasswordFlag: true });
                }}
                style={{ fontWeight: '700', color: '#3d8eb8' }}
              >
                click here
              </Text>
            </Text>
          </View>
        </View>
      </View>
    );
  };


  return (
    <View style={{ flex: 1 }}>
      {isLoading && <Loading isLoading={isLoading} />}
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
          {/*{isWEB && <HTML html={htmlContent} imagesMaxWidth={wp(100)} />}*/}
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
    color: color.black,
    fontSize: normalize(15),
  },
  floatingInputStyle: {
    borderWidth: 0,
    fontSize: normalize(12),
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
});

export default LoginScreen;
