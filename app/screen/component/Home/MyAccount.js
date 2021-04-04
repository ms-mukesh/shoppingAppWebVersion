import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AppButton,
  AppHeader,
  FloatingLabel,
  GradientBackground,
  LabelInputText,
  Loading,
} from '../../common';
import { useDispatch, useSelector } from 'react-redux';
import { color, hp, isANDROID, isIOS, normalize, wp } from '../../../helper/themeHelper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { editUserProfile, getMyAddresses } from '../../../redux/actions/userActions';
import { checkNamesIsEmpty } from '../../../helper/validation';
import { setUserDetails } from '../../../redux/actions/userAuth';
import { camera_icon } from '../../../assets/images';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageOnFirebase } from '../../../helper/firebaseMethods';
import { setLoaderStatus } from '../../../redux/actions/dashboardAction';

const MyAccountScreen = (props) => {
  const isLoading = useSelector((state) => state.appDefaultSettingReducer.isLoading);
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user.userDetail);
  const [isProfileImageChange, setIsUserProfileChange] = useState(false);
  useEffect(() => {
    dispatch(getMyAddresses()).then((res) => {
      if (res) {
        console.log('address-', addressDetails);
      }
    });
  }, []);
  const addressDetails = useSelector((state) => state.user.userAddress);
  const userDefaultObj = {
    companyName: '',
    companyAddress: '',

    firstName: userDetails?.firstName ?? '',
    lastName: userDetails?.lastName ?? '',
    middleName: userDetails?.middleName ?? '',
    email: userDetails?.email ?? '',
    mobile: '',
    panCardName: '',
    panNumber: '',
    gstNumber: '',
    backAccNumber: '',
    ifscCode: '',
    brandName: '',
    alterNatePhoneNumber: '',
    bankName: '',
    bankAccName: '',
    state: '',
    city: '',
    pincode: '',
    street: '',
    landmark: '',
    profileImage: userDetails?.image ?? '',
  };
  const [gender, setGender] = useState(userDetails?.gender === 'MALE' ? true : false);

  const [User, setUser] = useState({ ...userDefaultObj });
  const [currentAddressIndex, setCurrentAddressIndex] = useState(0);
  const renderNameFloatingTextInput = (
    lable,
    value,
    key,
    extraLabel = null,
    keyType = null,
    isMultiLine = false
  ) => {
    return (
      <View
        style={{
          flex: 1,
          borderBottomWidth: 1,
          borderBottomColor: color.gray,
          marginHorizontal: wp(0.5),
        }}
      >
        {isMultiLine ? (
          <LabelInputText
            multiline={true}
            numberOfLines={4}
            inputStyle={style.floatingInputStyle}
            style={[style.floatingStyle]}
            label={lable + '  '}
            editable={true}
            value={value}
            keyboardType={keyType !== null ? keyType : 'default'}
            returnKeyType={'done'}
            autoCapitalize="characters"
            extraLabel={extraLabel}
            onChangeText={(text) => {
              setUser({ ...User, [key]: isIOS ? text.toUpperCase() : text });
            }}
          />
        ) : (
          <FloatingLabel
            numberOfLines={1}
            inputStyle={style.floatingInputStyle}
            style={[style.floatingStyle]}
            label={lable + '  '}
            editable={true}
            value={value}
            autoCapitalize="characters"
            extraLabel={extraLabel}
            keyboardType={keyType !== null ? keyType : 'default'}
            returnKeyType={'done'}
            onChangeText={(text) => {
              setUser({ ...User, [key]: isIOS ? text.toUpperCase() : text });
            }}
            // onFocus={()=>{
            //     if(isPressable){
            //         Keyboard.dismiss()
            //         _setValuesForAutoCompelete(value, key, lable);
            //     }
            // }}
          />
        )}
      </View>
    );
  };
  const renderRadioButton = (title, firstValue, secondValue) => {
    return (
      <View style={[style.alignRow, { flex: 1, marginTop: hp(1) }]}>
        <Text
          style={{
            marginLeft: wp(2),
            fontSize: normalize(15),
            alignSelf: 'center',
            color: color.black,
          }}
        >
          {title}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableWithoutFeedback
            onPress={() => {
              setGender(true);
            }}
          >
            <View style={[style.radioButtonOutterCircle, { marginLeft: wp(2) }]}>
              {gender && <View style={style.radioButtonInnerCircle} />}
            </View>
          </TouchableWithoutFeedback>
          <Text style={{ marginLeft: wp(2), fontSize: normalize(12), color: color.black }}>
            {firstValue}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableWithoutFeedback
            onPress={() => {
              setGender(false);
            }}
          >
            <View style={[style.radioButtonOutterCircle, { marginLeft: wp(4) }]}>
              {!gender && <View style={style.radioButtonInnerCircle} />}
            </View>
          </TouchableWithoutFeedback>

          <Text style={{ marginLeft: wp(2), fontSize: normalize(12), color: color.black }}>
            {secondValue}
          </Text>
        </View>
      </View>
    );
  };
  const updateProfile = () => {
    if (checkNamesIsEmpty(User.firstName)) {
      alert('please enter First name');
      return;
    } else if (checkNamesIsEmpty(User.lastName)) {
      alert('please enter Last name');
      return;
    } else if (checkNamesIsEmpty(User.email)) {
      alert('please enter correct email address');
      return;
    } else if (User.profileImage === '') {
      alert('please select your profile image');
      return;
    } else {
      let obj = {
        inputFirstName: User?.firstName,
        inputLastName: User?.lastName,
        inputPhoneNumber: 7874391229,
        inputEmail: User?.email,
        inputGender: gender ? 'MALE' : 'FEMALE',
        inputImage: User?.profileImage,
      };
      if (isProfileImageChange) {
        dispatch(setLoaderStatus(true));
      }
      uploadImageOnFirebase(isProfileImageChange ? User?.profileImage : '').then((imageUrl) => {
        if (imageUrl) {
          obj = { ...obj, inputImage: imageUrl };
        }

        dispatch(editUserProfile(obj)).then(async (res) => {
          if (res) {
            AsyncStorage.getItem('userLoginDetail').then(async (res) => {
              if (res) {
                let userReduxObj = JSON.parse(res);
                userReduxObj = {
                  ...userReduxObj,
                  firstName: User?.firstName,
                  lastName: User?.lastName,
                  middleName: User?.middleName,
                  email: User?.email,
                  gender: gender ? 'MALE' : 'FEMALE',
                  image: imageUrl ? imageUrl : User?.profileImage,
                };
                await AsyncStorage.removeItem('userLoginDetail');
                await AsyncStorage.setItem('userLoginDetail', JSON.stringify(userReduxObj));
                dispatch(setUserDetails(userReduxObj));
                setUser({ ...userDefaultObj });
                props.navigation.goBack();
              }
            });
          }
        });
      });
    }
  };
  const _RenderUserAddress = (item, index) => {
    return (
      <View>
        <View style={{ padding: hp(1), flexDirection: 'row' }}>
          <View style={{ flex: 4 }}>
            <Text style={style.textStyle}>{item?.street}</Text>
            <Text style={style.textStyle}>{item?.landmark}</Text>
            <Text style={style.textStyle}>{item?.city + ',' + item?.state}</Text>
            <Text style={style.textStyle}>{item?.pincode}</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                setCurrentAddressIndex(index);
              }}
            >
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: hp(3),
                  width: hp(3),
                  borderRadius: hp(1.5),
                  borderWidth: hp(0.1),
                }}
              >
                {index === currentAddressIndex && (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: hp(2),
                      width: hp(2),
                      borderRadius: hp(1),
                      backgroundColor: color.themeBtnColor,
                    }}
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ height: hp(0.08), marginTop: hp(1), backgroundColor: 'gray' }} />
      </View>
    );
  };

  const openImagePicker = async (key) => {
    console.log('result--');
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: isANDROID ? false : true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        User[key] = result.uri;
        await setUser({ ...User, profileImage: result.uri });
        setIsUserProfileChange(true);
      } else {
        console.log('called--');
      }
    } catch (e) {
      console.log(e);
    }
  };
  const renderUserDetailForm = () => {
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: hp(1) }}
        enableAutomaticScroll={isIOS}
        scrollEnabled={true}
        extraScrollHeight={hp(-1)}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => {
              openImagePicker('profileImage');
            }}
          >
            <View style={{ height:hp(20),width:hp(20),borderRadius:hp(10), alignSelf: 'center' }}>
              {User.profileImage === '' ? (
                <View
                  style={[
                    style.profileImageStyle,
                    {
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(109,109,109,0.24)',
                    },
                  ]}
                >
                  <Image source={camera_icon} style={{ height: hp(5), width: hp(5) }} />
                </View>
              ) : (
                <Image
                  style={style.profileImageStyle}
                  resizeMode={'contain'}
                  source={{ uri: User?.profileImage }}
                />
              )}
            </View>
          </TouchableOpacity>
          <View style={[style.groupView]}>
            <View style={[style.innerView]}>
              <View
                style={{
                  ...style.iconContainer,
                  marginBottom: 0,
                  borderBottomWidth: 1,
                  borderBottomColor: color.gray,
                  paddingVertical: hp(1),
                }}
              >
                {/*<EvilIconsIcon name={'user'} size={hp(3.3)} color={color.blue} />*/}
              </View>
              {renderNameFloatingTextInput('FIRST NAME', User.firstName, 'firstName', true)}
            </View>

            <View style={[style.innerView]}>
              <View
                style={{
                  ...style.iconContainer,
                  marginBottom: 0,
                  borderBottomWidth: 1,
                  borderBottomColor: color.gray,
                  paddingVertical: hp(1),
                }}
              >
                {/*<EvilIconsIcon name={'user'} size={hp(3.3)} color={color.blue} />*/}
              </View>
              {renderNameFloatingTextInput('LAST NAME', User.lastName, 'lastName', true)}
            </View>
            <View style={[style.innerView]}>
              <View
                style={{
                  ...style.iconContainer,
                  marginBottom: 0,
                  borderBottomWidth: 1,
                  borderBottomColor: color.gray,
                  paddingVertical: hp(1),
                }}
              >
                {/*<EvilIconsIcon name={'user'} size={hp(3.3)} color={color.blue} />*/}
              </View>
              {renderNameFloatingTextInput('EMAIL', User.email, 'email', true)}
            </View>
            {/*<View style={[style.innerView]}>*/}
            {/*    <View*/}
            {/*        style={{*/}
            {/*            ...style.iconContainer,*/}
            {/*            marginBottom: 0,*/}
            {/*            borderBottomWidth: 1,*/}
            {/*            borderBottomColor: color.gray,*/}
            {/*            paddingVertical: hp(1),*/}
            {/*        }}>*/}
            {/*        /!*<EvilIconsIcon name={'user'} size={hp(3.3)} color={color.blue} />*!/*/}
            {/*    </View>*/}
            {/*    {renderNameFloatingTextInput(*/}
            {/*        'PASSWORD',*/}
            {/*        User.password,*/}
            {/*        'email',*/}
            {/*        true*/}
            {/*    )}*/}
            {/*</View>*/}
            {/*<View style={[style.innerView]}>*/}
            {/*    <View*/}
            {/*        style={{*/}
            {/*            ...style.iconContainer,*/}
            {/*            marginBottom: 0,*/}
            {/*            borderBottomWidth: 1,*/}
            {/*            borderBottomColor: color.gray,*/}
            {/*            paddingVertical: hp(1),*/}
            {/*        }}>*/}
            {/*        /!*<EvilIconsIcon name={'user'} size={hp(3.3)} color={color.blue} />*!/*/}
            {/*    </View>*/}
            {/*    {renderNameFloatingTextInput(*/}
            {/*        'NEW PASSWORD',*/}
            {/*        User.newPwd,*/}
            {/*        'newPwd',*/}
            {/*        true*/}
            {/*    )}*/}
            {/*</View>*/}
            {/*<View style={[style.innerView]}>*/}
            {/*    <View*/}
            {/*        style={{*/}
            {/*            ...style.iconContainer,*/}
            {/*            marginBottom: 0,*/}
            {/*            borderBottomWidth: 1,*/}
            {/*            borderBottomColor: color.gray,*/}
            {/*            paddingVertical: hp(1),*/}
            {/*        }}>*/}
            {/*        /!*<EvilIconsIcon name={'user'} size={hp(3.3)} color={color.blue} />*!/*/}
            {/*    </View>*/}
            {/*    {renderNameFloatingTextInput(*/}
            {/*        'CONFIRM PASSWORD',*/}
            {/*        User.cNewPwd,*/}
            {/*        'cNewPwd',*/}
            {/*        true*/}
            {/*    )}*/}
            {/*</View>*/}
            <View style={[style.innerView]}>
              <View
                style={{
                  ...style.iconContainer,
                  marginBottom: 0,
                  borderBottomWidth: 1,
                  borderBottomColor: color.gray,
                  paddingVertical: hp(1),
                }}
              >
                {/*<EvilIconsIcon name={'user'} size={hp(3.3)} color={color.blue} />*/}
              </View>
              {renderRadioButton('GENDER', 'MALE', 'FEMALE')}
            </View>
          </View>

          <AppButton
            onPress={() => {
              updateProfile();
            }}
            title={'SAVE'}
            containerStyle={{ marginTop: hp(2),width:wp(35) }}
          />
          <View style={{ height: hp(8) }} />
        </View>
      </KeyboardAwareScrollView>
    );
  };
  return (
    <GradientBackground>
      <AppHeader title={'My Account'} onMenuPress={() => props.navigation.openDrawer()} />
      {renderUserDetailForm()}
      {isLoading && <Loading isLoading={isLoading} />}
    </GradientBackground>
  );
};
const style = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageStyle: {
    height: hp(20),
    width: hp(20),
    borderRadius: hp(10),
  },
  textStyle: {
    // fontFamily: font.robotoRegular,
    color: color.blue,
    fontSize: normalize(13),
  },
  radioButton: {
    marginHorizontal: wp(2),
  },
  innerView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: hp(0.5),
    borderBottomColor: color.gray,
  },
  noteTextStyle: {
    fontSize: normalize(10),
    color: 'red',
    textAlign: 'center',
  },
  alignRow: {
    flexDirection: 'row',
  },
  editProfileView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArraow: {
    position: 'absolute',
    top: isANDROID ? 5 : 30,
    zIndex: 10,
    margin: hp(1),
    paddingHorizontal: wp(1),
  },
  groupView: {
    backgroundColor: color.creamDarkGray,
    padding: wp(2),
    borderRadius: wp(5),
  },
  iconContainer: {
    marginBottom: isANDROID ? hp(1.5) : hp(1.2),
    marginHorizontal: wp(1),
  },
  floatingStyle: {},
  floatingInputStyle: {
    borderWidth: 0,
    fontSize: normalize(12),
    // fontFamily: font.robotoRegular,
    height: isANDROID ? hp(6) : hp(5),
    marginTop: isANDROID ? hp(3) : hp(2),
  },
  floatingAddressInputStyle: {
    borderWidth: 0,
    fontSize: normalize(12),
    // fontFamily: font.robotoRegular,
    color: color.black,
    justifyContent: 'center',
    padding: hp(1),
    maxHeight: 200,
    marginHorizontal: wp(1),
  },
  floatingLableStyle: {
    // fontFamily: font.robotoRegular,
  },
  trustFactorRow: { flexDirection: 'row', alignItems: 'center', marginTop: hp(1) },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    marginVertical: hp(0.5),
    borderBottomColor: color.gray,
    marginHorizontal: wp(1),
    flex: 1,
  },
  fontStyle: {
    color: color.blue,
    fontSize: normalize(17),
    // fontFamily: font.robotoBold,
    textAlign: 'center',
    // marginTop: hp(8),
  },
  subfontStyle: {
    fontSize: normalize(14),
    // fontFamily: font.robotoBold,
    textAlign: 'center',
    marginLeft: wp(1),
    color: color.blue,
    marginTop: wp(2),
  },
  validationStart: { position: 'absolute', color: 'red', marginLeft: wp(16), marginTop: hp(0.5) },
  radioButtonOutterCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(2.4),
    width: hp(2.4),
    borderRadius: hp(1.2),
    borderWidth: hp(0.2),
  },
  radioButtonInnerCircle: {
    height: hp(1),
    width: hp(1),
    borderRadius: hp(0.5),
    backgroundColor: color.lightPink,
  },
});
export default MyAccountScreen;
