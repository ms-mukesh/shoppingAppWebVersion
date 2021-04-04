import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';

import { useSelector } from 'react-redux';
import {
  AppButton,
  AppHeader,
  FloatingLabel,
  GradientBackground,
  LabelInputText,
  Loading,
} from '../../common';
import { PaymentTypeCheckBox } from '../../common/PaymentTypeCheckBox';
import { useDispatch } from 'react-redux';
import {
  getMyShopDetails,
  requestForAddingStore,
  requestForEditStore,
  updateStoreMinorInformation,
} from '../../../redux/actions/storeAction';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {color, hp, isANDROID, IsAndroidOS, isIOS, IsIOSOS, normalize, wp} from '../../../helper/themeHelper';
import * as ImagePicker from 'expo-image-picker';
import { checkNamesIsEmpty, validateEmail } from '../../../helper/validation';
import { setLoaderStatus } from '../../../redux/actions/dashboardAction';
import { uploadImageOnFirebase } from '../../../helper/firebaseMethods';
import { CommonActions } from '@react-navigation/native';

const ShopDetailEditScreen = (props) => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.appDefaultSettingReducer.isLoading);
  const [User, setUser] = useState({});
  const [isWholeSeller, setIsWholeSeller] = useState(true);
  const [isEditable, setIsEditable] = useState(true);
  const [isPanImageChange, setIsPanImageChange] = useState(false);
  const [isProfileImageChange, setIsProfileImageChange] = useState(false);
  const [isGstImageChange, setGstImageChange] = useState(false);
  const [isChequeImageChange, setChequeImageChange] = useState(false);
  const [requestNotMaded, setIsRequestNotMaded] = useState(false);
  const [checkBoxArr, setCheckboxArr] = useState([]);
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
              isEditable && setIsWholeSeller(true);
            }}
          >
            <View style={[style.radioButtonOutterCircle, { marginLeft: wp(2) }]}>
              {isWholeSeller && <View style={style.radioButtonInnerCircle} />}
            </View>
          </TouchableWithoutFeedback>
          <Text style={{ marginLeft: wp(2), fontSize: normalize(12), color: color.black }}>
            {firstValue}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableWithoutFeedback
            onPress={() => {
              isEditable && setIsWholeSeller(false);
            }}
          >
            <View style={[style.radioButtonOutterCircle, { marginLeft: wp(4) }]}>
              {!isWholeSeller && <View style={style.radioButtonInnerCircle} />}
            </View>
          </TouchableWithoutFeedback>

          <Text style={{ marginLeft: wp(2), fontSize: normalize(12), color: color.black }}>
            {secondValue}
          </Text>
        </View>
      </View>
    );
  };
  const openImagePicker = async (key) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: isANDROID ? false : true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      User[key] = result.uri;
      await setUser({ ...User, [key]: result.uri });
      if (key === 'panCardImage') {
        setIsPanImageChange(true);
      } else if (key === 'storeImage') {
        setIsProfileImageChange(true);
      } else if (key === 'gstCardImage') {
        setGstImageChange(true);
      } else if (key === 'cancelChequeImage') {
        setChequeImageChange(true);
      }
    }
  };

  const saveShopToDb = () => {
    if (User.storeImage === '') {
      alert('please select store Image');
      return;
    } else if (checkNamesIsEmpty(User.street)) {
      alert('please enter company address street');
      return;
    } else if (checkNamesIsEmpty(User.landmark)) {
      alert('please enter company address landmark');
      return;
    } else if (checkNamesIsEmpty(User.state)) {
      alert('please enter company address state');
      return;
    } else if (checkNamesIsEmpty(User.city)) {
      alert('please enter company address city');
      return;
    } else if (checkNamesIsEmpty(User.pincode)) {
      alert('please enter company address pincode');
      return;
    } else if (checkNamesIsEmpty(User.firstName)) {
      alert('please enter Your name');
      return;
    } else if (!validateEmail(User.email)) {
      alert('please enter correct email address');
      return;
    } else if (checkNamesIsEmpty(User.mobile) || User.mobile.length !== 10 || isNaN(User?.mobile)) {
      alert('please enter mobile number');
      return;
    } else if (
      checkNamesIsEmpty(User.alterNatePhoneNumber) ||
      User.alterNatePhoneNumber.length !== 10 ||
      isNaN(User?.alterNatePhoneNumber)
    ) {
      alert('please enter alter nate phone number');
      return;
    } else if (checkBoxArr.length === 0) {
      alert('please select atleast single mode of payment');
      return;
    } else if (
      checkBoxArr.length > 0 &&
      checkBoxArr.includes(1) &&
      (User?.upi === '' || typeof User?.upi === 'undefined')
    ) {
      alert('please enter your Buisness UPI id');
      return;
    } else {
      let saveRequestObj = {
        inputStoreImage: User?.storeImage,
        inputCompanyEmail: User?.email,
        inputContactNumber: User?.mobile,
        inputAlternatePhoneNumber: User?.alterNatePhoneNumber,
        inputCity: User?.city,
        inputState: User?.state,
        inputPincode: User?.pincode,
        inputStreet: User?.street,
        inputLandmark: User?.landmark,
        inputContactName: User?.firstName?.trim(),
        inputPaymentMode: checkBoxArr.join(),
        inputUpiId:
          checkBoxArr.length > 0 && checkBoxArr.includes(1) && typeof User?.upi !== 'undefined'
            ? User?.upi
            : '',
      };

      dispatch(setLoaderStatus(true));
      uploadImageOnFirebase(isProfileImageChange ? User?.storeImage : '').then((storeImageUrl) => {
        if (storeImageUrl) {
          saveRequestObj = { ...saveRequestObj, inputStoreImage: storeImageUrl };
        }
        dispatch(updateStoreMinorInformation(saveRequestObj)).then((res) => {
          if (res) {
            props.navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Dashboard', params: { setfromLogin: true } }],
                })
            );
            alert('Your Changes is Saved succefully!')

          } else {
            dispatch(setLoaderStatus(false));
            alert('failed to Save your changes...please try again');
          }
        });
      });
    }
  };

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
            style={[style.floatingStyle, { width: wp(80) }]}
            label={lable + '  '}
            editable={isEditable}
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
            style={[style.floatingStyle, { width: wp(80) }]}
            label={lable + '  '}
            editable={isEditable}
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
  useEffect(() => {
    dispatch(getMyShopDetails()).then(async (res) => {
      if (res !== null) {
        await setIsRequestNotMaded(true);
        await setUser({
          ...User,
          companyAddress: '',
          firstName: res?.contactName ?? '',
          email: res?.companyEmail ?? '',
          mobile: res?.contactNumber?.toString() ?? '',
          alterNatePhoneNumber: res?.alternatePhoneNumber?.toString() ?? '',
          state: res?.address?.state ?? '',
          city: res?.address?.city ?? '',
          pincode: res?.address?.pincode?.toString() ?? '',
          street: res?.address?.street ?? '',
          landmark: res?.address?.state ?? '',
          storeImage: res?.storeImage ?? '',
          type: res?.paymentMode?.items,
          upi: res?.upi ?? '',
        });
        console.log('res--', res);
        let tempArray = [];
        if (res?.paymentMode?.items?.length > 0) {
          res?.paymentMode?.items.map((item) => {
            tempArray.push(parseInt(item?.mode));
          });
          User.type = [...tempArray];
          await setCheckboxArr([...tempArray]);
        }
      }
    });
  }, []);

  const shopDataForm = () => {
    const { center, profileImageStyle } = style;
    return (
      <GradientBackground>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: hp(1) }}
          enableAutomaticScroll={isIOS}
          scrollEnabled={true}
          extraScrollHeight={hp(-1)}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={() => {
              isEditable && openImagePicker('storeImage');
            }}
          >
            <View style={{ height:hp(30),width:wp(30),alignSelf:'center', ...center }}>
              {User.storeImage === '' ? (
                <View
                  style={[
                    profileImageStyle,
                    {
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(109,109,109,0.24)',
                    },
                  ]}
                >
                  <Image
                    source={require('../../../assets/images/camera.png')}
                    style={{ height: hp(5), width: hp(5) }}
                  />
                </View>
              ) : (
                <Image
                  style={profileImageStyle}
                  resizeMode={'cover'}
                  source={{ uri: User?.storeImage }}
                />
              )}
            </View>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
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
                {renderNameFloatingTextInput(
                  'ADDRESS STREET',
                  User.street,
                  'street',
                  true,
                  null,
                  false
                )}
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
                {renderNameFloatingTextInput(
                  'ADDRESS LANDMARK',
                  User.landmark,
                  'landmark',
                  true,
                  null,
                  false
                )}
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
                {renderNameFloatingTextInput('STATE', User.state, 'state', true)}
                {renderNameFloatingTextInput('CITY', User.city, 'city', true)}
                {renderNameFloatingTextInput('PIN CODE', User.pincode, 'pincode', true)}
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
                {renderNameFloatingTextInput('NAME', User.firstName, 'firstName', true)}
                {renderNameFloatingTextInput('EMAIL', User.email, 'email', true)}
                {renderNameFloatingTextInput(
                    'MOBILE NUMBER',
                    User.mobile,
                    'mobile',
                    true,
                    'numeric'
                )}
                {renderNameFloatingTextInput(
                    'ALTERNATIVE PHONE NUMBER',
                    User.alterNatePhoneNumber,
                    'alterNatePhoneNumber',
                    true,
                    'numeric'
                )}
              </View>

              {/*<View style={[style.innerView]}>*/}
              {/*  <View*/}
              {/*    style={{*/}
              {/*      ...style.iconContainer,*/}
              {/*      marginBottom: 0,*/}
              {/*      borderBottomWidth: 1,*/}
              {/*      borderBottomColor: color.gray,*/}
              {/*      paddingVertical: hp(1),*/}
              {/*    }}*/}
              {/*  >*/}
              {/*    /!*<EvilIconsIcon name={'user'} size={hp(3.3)} color={color.blue} />*!/*/}
              {/*  </View>*/}
              {/*  {renderNameFloatingTextInput('EMAIL', User.email, 'email', true)}*/}
              {/*</View>*/}
              {/*<View style={[style.innerView]}>*/}
              {/*  <View*/}
              {/*    style={{*/}
              {/*      ...style.iconContainer,*/}
              {/*      marginBottom: 0,*/}
              {/*      borderBottomWidth: 1,*/}
              {/*      borderBottomColor: color.gray,*/}
              {/*      paddingVertical: hp(1),*/}
              {/*    }}*/}
              {/*  >*/}
              {/*    /!*<EvilIconsIcon name={'user'} size={hp(3.3)} color={color.blue} />*!/*/}
              {/*  </View>*/}
              {/*  {renderNameFloatingTextInput(*/}
              {/*    'MOBILE NUMBER',*/}
              {/*    User.mobile,*/}
              {/*    'mobile',*/}
              {/*    true,*/}
              {/*    'numeric'*/}
              {/*  )}*/}
              {/*</View>*/}
              {/*<View style={[style.innerView]}>*/}
              {/*  <View*/}
              {/*    style={{*/}
              {/*      ...style.iconContainer,*/}
              {/*      marginBottom: 0,*/}
              {/*      borderBottomWidth: 1,*/}
              {/*      borderBottomColor: color.gray,*/}
              {/*      paddingVertical: hp(1),*/}
              {/*    }}*/}
              {/*  >*/}
              {/*    /!*<EvilIconsIcon name={'user'} size={hp(3.3)} color={color.blue} />*!/*/}
              {/*  </View>*/}
              {/*  {renderNameFloatingTextInput(*/}
              {/*    'ALTERNATIVE PHONE NUMBER',*/}
              {/*    User.alterNatePhoneNumber,*/}
              {/*    'alterNatePhoneNumber',*/}
              {/*    true,*/}
              {/*    'numeric'*/}
              {/*  )}*/}
              {/*</View>*/}
            </View>

            {/*<View style={[style.groupView,{marginTop:hp(2)}]}>*/}
            {/*    <View style={[style.innerView]}>*/}
            {/*        <View*/}
            {/*            style={{*/}
            {/*                ...style.iconContainer,*/}
            {/*                marginBottom: 0,*/}
            {/*                borderBottomWidth: 1,*/}
            {/*                borderBottomColor: color.gray,*/}
            {/*                paddingVertical: hp(1),*/}
            {/*            }}>*/}
            {/*            /!*<EvilIconsIcon name={'user'} size={hp(3.3)} color={color.blue} />*!/*/}
            {/*        </View>*/}
            {/*        {renderNameFloatingTextInput(*/}
            {/*            'PAN CARD NAME',*/}
            {/*            User.panCardName,*/}
            {/*            'panCardName',*/}
            {/*            true*/}
            {/*        )}*/}
            {/*    </View>*/}
            {/*    <View style={[style.innerView]}>*/}
            {/*        <View*/}
            {/*            style={{*/}
            {/*                ...style.iconContainer,*/}
            {/*                marginBottom: 0,*/}
            {/*                borderBottomWidth: 1,*/}
            {/*                borderBottomColor: color.gray,*/}
            {/*                paddingVertical: hp(1),*/}
            {/*            }}>*/}
            {/*            /!*<EvilIconsIcon name={'user'} size={hp(3.3)} color={color.blue} />*!/*/}
            {/*        </View>*/}
            {/*        {renderNameFloatingTextInput(*/}
            {/*            'PAN NUMBER',*/}
            {/*            User.panNumber,*/}
            {/*            'panNumber',*/}
            {/*            true,*/}
            {/*        )}*/}
            {/*        {renderNameFloatingTextInput(*/}
            {/*            'GST NUMBER',*/}
            {/*            User.gstNumber,*/}
            {/*            'gstNumber',*/}
            {/*            true,*/}
            {/*        )}*/}
            {/*    </View>*/}
            {/*    <View style={[style.innerView]}>*/}
            {/*        <View*/}
            {/*            style={{*/}
            {/*                ...style.iconContainer,*/}
            {/*                marginBottom: 0,*/}
            {/*                borderBottomWidth: 1,*/}
            {/*                borderBottomColor: color.gray,*/}
            {/*                paddingVertical: hp(1),*/}
            {/*            }}>*/}
            {/*            /!*<EvilIconsIcon name={'user'} size={hp(3.3)} color={color.blue} />*!/*/}
            {/*        </View>*/}
            {/*        {renderNameFloatingTextInput(*/}
            {/*            'BANK ACCOUNT NUMBER',*/}
            {/*            User.backAccNumber,*/}
            {/*            'backAccNumber',*/}
            {/*            true*/}
            {/*        )}*/}
            {/*    </View>*/}
            {/*    <View style={[style.innerView]}>*/}
            {/*        <View*/}
            {/*            style={{*/}
            {/*                ...style.iconContainer,*/}
            {/*                marginBottom: 0,*/}
            {/*                borderBottomWidth: 1,*/}
            {/*                borderBottomColor: color.gray,*/}
            {/*                paddingVertical: hp(1),*/}
            {/*            }}>*/}
            {/*            /!*<EvilIconsIcon name={'user'} size={hp(3.3)} color={color.blue} />*!/*/}
            {/*        </View>*/}
            {/*        {renderNameFloatingTextInput(*/}
            {/*            'IFSC CODE',*/}
            {/*            User.ifscCode,*/}
            {/*            'ifscCode',*/}
            {/*            true*/}
            {/*        )}*/}
            {/*    </View>*/}
            {/*    <View style={[style.innerView]}>*/}
            {/*        <View*/}
            {/*            style={{*/}
            {/*                ...style.iconContainer,*/}
            {/*                marginBottom: 0,*/}
            {/*                borderBottomWidth: 1,*/}
            {/*                borderBottomColor: color.gray,*/}
            {/*                paddingVertical: hp(1),*/}
            {/*            }}>*/}
            {/*            /!*<EvilIconsIcon name={'user'} size={hp(3.3)} color={color.blue} />*!/*/}
            {/*        </View>*/}
            {/*        {renderNameFloatingTextInput(*/}
            {/*            'BANK NAME',*/}
            {/*            User.bankName,*/}
            {/*            'bankName',*/}
            {/*            true*/}
            {/*        )}*/}
            {/*    </View>*/}
            {/*    <View style={[style.innerView]}>*/}
            {/*        <View*/}
            {/*            style={{*/}
            {/*                ...style.iconContainer,*/}
            {/*                marginBottom: 0,*/}
            {/*                borderBottomWidth: 1,*/}
            {/*                borderBottomColor: color.gray,*/}
            {/*                paddingVertical: hp(1),*/}
            {/*            }}>*/}
            {/*            /!*<EvilIconsIcon name={'user'} size={hp(3.3)} color={color.blue} />*!/*/}
            {/*        </View>*/}
            {/*        {renderNameFloatingTextInput(*/}
            {/*            'BANK ACCOUNT NAME',*/}
            {/*            User.bankAccName,*/}
            {/*            'bankAccName',*/}
            {/*            true*/}
            {/*        )}*/}
            {/*    </View>*/}
            {/*</View>*/}

            {/*<View style={[style.groupView,{marginTop:hp(2)}]}>*/}
            {/*    <View style={[style.innerView]}>*/}
            {/*        <View*/}
            {/*            style={{*/}
            {/*                ...style.iconContainer,*/}
            {/*                marginBottom: 0,*/}
            {/*                borderBottomWidth: 1,*/}
            {/*                borderBottomColor: color.gray,*/}
            {/*                paddingVertical: hp(1),*/}
            {/*            }}>*/}
            {/*            /!*<EvilIconsIcon name={'user'} size={hp(3.3)} color={color.blue} />*!/*/}
            {/*        </View>*/}
            {/*        {renderNameFloatingTextInput(*/}
            {/*            'BRAND NAME',*/}
            {/*            User.brandName,*/}
            {/*            'brandName',*/}
            {/*            true*/}
            {/*        )}*/}
            {/*    </View>*/}

            {/*    /!*<View style={[style.innerView]}>*!/*/}
            {/*    /!*    <View*!/*/}
            {/*    /!*        style={{*!/*/}
            {/*    /!*            ...style.iconContainer,*!/*/}
            {/*    /!*            marginBottom: 0,*!/*/}
            {/*    /!*            borderBottomWidth: 1,*!/*/}
            {/*    /!*            borderBottomColor: color.gray,*!/*/}
            {/*    /!*            paddingVertical: hp(1),*!/*/}
            {/*    /!*        }}>*!/*/}
            {/*    /!*        /!*<EvilIconsIcon name={'user'} size={hp(3.3)} color={color.blue} />*!/*!/*/}
            {/*    /!*    </View>*!/*/}
            {/*    /!*    {renderRadioButton(*!/*/}
            {/*    /!*        'TYPE',*!/*/}
            {/*    /!*        'WHOLESALER',*!/*/}
            {/*    /!*        'MANUFATURER',*!/*/}
            {/*    /!*    )}*!/*/}
            {/*    /!*</View>*!/*/}

            {/*</View>*/}

            <View style={[style.groupView, { marginTop: hp(2) }]}>
              <Text
                style={{
                  fontSize: normalize(15),
                  textAlign: 'center',
                  color: color.themeBtnColor,
                  fontWeight: '700',
                }}
              >
                My Acceptable Payment Mode
              </Text>
              <PaymentTypeCheckBox
                selectedData={checkBoxArr}
                toggleCheckbox={(id) => {
                  if (checkBoxArr.includes(id)) {
                    let index = checkBoxArr.findIndex((x) => x === id);
                    checkBoxArr.splice(index, 1);
                  } else {
                    checkBoxArr.push(id);
                  }
                  setCheckboxArr([...checkBoxArr]);
                  setUser({ ...User, type: checkBoxArr });
                  console.log(checkBoxArr);
                }}
              />
            </View>
            {checkBoxArr.includes(1) && (
              <View style={[style.groupView, { marginTop: hp(2) }]}>
                <Text
                  style={{
                    fontSize: normalize(15),
                    textAlign: 'center',
                    color: color.themeBtnColor,
                    fontWeight: '700',
                  }}
                >
                  MY Buisness UPI Id
                </Text>
                {renderNameFloatingTextInput('UPI ID', User?.upi, 'upi', true, null, false)}
                <Text
                  style={{
                    fontSize: normalize(12),
                    fontWeight: '500',
                    color: 'red',
                    marginTop: hp(1),
                  }}
                >
                  NOTE:- Please make sure that you have entered UPI id is your business UPI Id,we
                  are not direct or in directly responsible for your payment failure
                </Text>
              </View>
            )}

            <AppButton
              onPress={() => {
                saveShopToDb();
              }}
              title={'EDIT'}
              containerStyle={{ marginTop: hp(2), backgroundColor: color.themeBtnColor,width:wp(30) }}
            />
            <Text style={{ marginTop: hp(1), fontSize: normalize(12) }}>
              Note:These are not your complete details,These are only the details which you can edit
              at your level.To check your complete details please check My Shop Request page from
              Drawer menu.Thank You
            </Text>
            <View style={{ height: hp(5) }} />
          </View>
        </KeyboardAwareScrollView>
      </GradientBackground>
    );
  };
  const shopDataFormForWebInDevice = () => {
    const { center, profileImageStyle } = style;
    return (
        <GradientBackground>
          <KeyboardAwareScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ padding: hp(1) }}
              enableAutomaticScroll={isIOS}
              scrollEnabled={true}
              extraScrollHeight={hp(-1)}
              showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity
                onPress={() => {
                  isEditable && openImagePicker('storeImage');
                }}
            >
              <View style={{ flex: 1, ...center }}>
                {User.storeImage === '' ? (
                    <View
                        style={[
                          profileImageStyle,
                          {
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(109,109,109,0.24)',
                          },
                        ]}
                    >
                      <Image
                          source={require('../../../assets/images/camera.png')}
                          style={{ height: hp(5), width: hp(5) }}
                      />
                    </View>
                ) : (
                    <Image
                        style={profileImageStyle}
                        resizeMode={'cover'}
                        source={{ uri: User?.storeImage }}
                    />
                )}
              </View>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
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
                  {renderNameFloatingTextInput(
                      'ADDRESS STREET',
                      User.street,
                      'street',
                      true,
                      null,
                      false
                  )}
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
                  {renderNameFloatingTextInput(
                      'ADDRESS LANDMARK',
                      User.landmark,
                      'landmark',
                      true,
                      null,
                      false
                  )}
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
                  {renderNameFloatingTextInput('STATE', User.state, 'state', true)}
                  {renderNameFloatingTextInput('CITY', User.city, 'city', true)}
                  {renderNameFloatingTextInput('PIN CODE', User.pincode, 'pincode', true)}
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
                  {renderNameFloatingTextInput('NAME', User.firstName, 'firstName', true)}
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
                  {renderNameFloatingTextInput(
                      'MOBILE NUMBER',
                      User.mobile,
                      'mobile',
                      true,
                      'numeric'
                  )}
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
                  {renderNameFloatingTextInput(
                      'ALTERNATIVE PHONE NUMBER',
                      User.alterNatePhoneNumber,
                      'alterNatePhoneNumber',
                      true,
                      'numeric'
                  )}
                </View>
              </View>

              {/*<View style={[style.groupView,{marginTop:hp(2)}]}>*/}
              {/*    <View style={[style.innerView]}>*/}
              {/*        <View*/}
              {/*            style={{*/}
              {/*                ...style.iconContainer,*/}
              {/*                marginBottom: 0,*/}
              {/*                borderBottomWidth: 1,*/}
              {/*                borderBottomColor: color.gray,*/}
              {/*                paddingVertical: hp(1),*/}
              {/*            }}>*/}
              {/*            /!*<EvilIconsIcon name={'user'} size={hp(3.3)} color={color.blue} />*!/*/}
              {/*        </View>*/}
              {/*        {renderNameFloatingTextInput(*/}
              {/*            'PAN CARD NAME',*/}
              {/*            User.panCardName,*/}
              {/*            'panCardName',*/}
              {/*            true*/}
              {/*        )}*/}
              {/*    </View>*/}
              {/*    <View style={[style.innerView]}>*/}
              {/*        <View*/}
              {/*            style={{*/}
              {/*                ...style.iconContainer,*/}
              {/*                marginBottom: 0,*/}
              {/*                borderBottomWidth: 1,*/}
              {/*                borderBottomColor: color.gray,*/}
              {/*                paddingVertical: hp(1),*/}
              {/*            }}>*/}
              {/*            /!*<EvilIconsIcon name={'user'} size={hp(3.3)} color={color.blue} />*!/*/}
              {/*        </View>*/}
              {/*        {renderNameFloatingTextInput(*/}
              {/*            'PAN NUMBER',*/}
              {/*            User.panNumber,*/}
              {/*            'panNumber',*/}
              {/*            true,*/}
              {/*        )}*/}
              {/*        {renderNameFloatingTextInput(*/}
              {/*            'GST NUMBER',*/}
              {/*            User.gstNumber,*/}
              {/*            'gstNumber',*/}
              {/*            true,*/}
              {/*        )}*/}
              {/*    </View>*/}
              {/*    <View style={[style.innerView]}>*/}
              {/*        <View*/}
              {/*            style={{*/}
              {/*                ...style.iconContainer,*/}
              {/*                marginBottom: 0,*/}
              {/*                borderBottomWidth: 1,*/}
              {/*                borderBottomColor: color.gray,*/}
              {/*                paddingVertical: hp(1),*/}
              {/*            }}>*/}
              {/*            /!*<EvilIconsIcon name={'user'} size={hp(3.3)} color={color.blue} />*!/*/}
              {/*        </View>*/}
              {/*        {renderNameFloatingTextInput(*/}
              {/*            'BANK ACCOUNT NUMBER',*/}
              {/*            User.backAccNumber,*/}
              {/*            'backAccNumber',*/}
              {/*            true*/}
              {/*        )}*/}
              {/*    </View>*/}
              {/*    <View style={[style.innerView]}>*/}
              {/*        <View*/}
              {/*            style={{*/}
              {/*                ...style.iconContainer,*/}
              {/*                marginBottom: 0,*/}
              {/*                borderBottomWidth: 1,*/}
              {/*                borderBottomColor: color.gray,*/}
              {/*                paddingVertical: hp(1),*/}
              {/*            }}>*/}
              {/*            /!*<EvilIconsIcon name={'user'} size={hp(3.3)} color={color.blue} />*!/*/}
              {/*        </View>*/}
              {/*        {renderNameFloatingTextInput(*/}
              {/*            'IFSC CODE',*/}
              {/*            User.ifscCode,*/}
              {/*            'ifscCode',*/}
              {/*            true*/}
              {/*        )}*/}
              {/*    </View>*/}
              {/*    <View style={[style.innerView]}>*/}
              {/*        <View*/}
              {/*            style={{*/}
              {/*                ...style.iconContainer,*/}
              {/*                marginBottom: 0,*/}
              {/*                borderBottomWidth: 1,*/}
              {/*                borderBottomColor: color.gray,*/}
              {/*                paddingVertical: hp(1),*/}
              {/*            }}>*/}
              {/*            /!*<EvilIconsIcon name={'user'} size={hp(3.3)} color={color.blue} />*!/*/}
              {/*        </View>*/}
              {/*        {renderNameFloatingTextInput(*/}
              {/*            'BANK NAME',*/}
              {/*            User.bankName,*/}
              {/*            'bankName',*/}
              {/*            true*/}
              {/*        )}*/}
              {/*    </View>*/}
              {/*    <View style={[style.innerView]}>*/}
              {/*        <View*/}
              {/*            style={{*/}
              {/*                ...style.iconContainer,*/}
              {/*                marginBottom: 0,*/}
              {/*                borderBottomWidth: 1,*/}
              {/*                borderBottomColor: color.gray,*/}
              {/*                paddingVertical: hp(1),*/}
              {/*            }}>*/}
              {/*            /!*<EvilIconsIcon name={'user'} size={hp(3.3)} color={color.blue} />*!/*/}
              {/*        </View>*/}
              {/*        {renderNameFloatingTextInput(*/}
              {/*            'BANK ACCOUNT NAME',*/}
              {/*            User.bankAccName,*/}
              {/*            'bankAccName',*/}
              {/*            true*/}
              {/*        )}*/}
              {/*    </View>*/}
              {/*</View>*/}

              {/*<View style={[style.groupView,{marginTop:hp(2)}]}>*/}
              {/*    <View style={[style.innerView]}>*/}
              {/*        <View*/}
              {/*            style={{*/}
              {/*                ...style.iconContainer,*/}
              {/*                marginBottom: 0,*/}
              {/*                borderBottomWidth: 1,*/}
              {/*                borderBottomColor: color.gray,*/}
              {/*                paddingVertical: hp(1),*/}
              {/*            }}>*/}
              {/*            /!*<EvilIconsIcon name={'user'} size={hp(3.3)} color={color.blue} />*!/*/}
              {/*        </View>*/}
              {/*        {renderNameFloatingTextInput(*/}
              {/*            'BRAND NAME',*/}
              {/*            User.brandName,*/}
              {/*            'brandName',*/}
              {/*            true*/}
              {/*        )}*/}
              {/*    </View>*/}

              {/*    /!*<View style={[style.innerView]}>*!/*/}
              {/*    /!*    <View*!/*/}
              {/*    /!*        style={{*!/*/}
              {/*    /!*            ...style.iconContainer,*!/*/}
              {/*    /!*            marginBottom: 0,*!/*/}
              {/*    /!*            borderBottomWidth: 1,*!/*/}
              {/*    /!*            borderBottomColor: color.gray,*!/*/}
              {/*    /!*            paddingVertical: hp(1),*!/*/}
              {/*    /!*        }}>*!/*/}
              {/*    /!*        /!*<EvilIconsIcon name={'user'} size={hp(3.3)} color={color.blue} />*!/*!/*/}
              {/*    /!*    </View>*!/*/}
              {/*    /!*    {renderRadioButton(*!/*/}
              {/*    /!*        'TYPE',*!/*/}
              {/*    /!*        'WHOLESALER',*!/*/}
              {/*    /!*        'MANUFATURER',*!/*/}
              {/*    /!*    )}*!/*/}
              {/*    /!*</View>*!/*/}

              {/*</View>*/}

              <View style={[style.groupView, { marginTop: hp(2) }]}>
                <Text
                    style={{
                      fontSize: normalize(15),
                      textAlign: 'center',
                      color: color.themeBtnColor,
                      fontWeight: '700',
                    }}
                >
                  My Acceptable Payment Mode
                </Text>
                <PaymentTypeCheckBox
                    selectedData={checkBoxArr}
                    toggleCheckbox={(id) => {
                      if (checkBoxArr.includes(id)) {
                        let index = checkBoxArr.findIndex((x) => x === id);
                        checkBoxArr.splice(index, 1);
                      } else {
                        checkBoxArr.push(id);
                      }
                      setCheckboxArr([...checkBoxArr]);
                      setUser({ ...User, type: checkBoxArr });
                      console.log(checkBoxArr);
                    }}
                />
              </View>
              {checkBoxArr.includes(1) && (
                  <View style={[style.groupView, { marginTop: hp(2) }]}>
                    <Text
                        style={{
                          fontSize: normalize(15),
                          textAlign: 'center',
                          color: color.themeBtnColor,
                          fontWeight: '700',
                        }}
                    >
                      MY Buisness UPI Id
                    </Text>
                    {renderNameFloatingTextInput('UPI ID', User?.upi, 'upi', true, null, false)}
                    <Text
                        style={{
                          fontSize: normalize(12),
                          fontWeight: '500',
                          color: 'red',
                          marginTop: hp(1),
                        }}
                    >
                      NOTE:- Please make sure that you have entered UPI id is your business UPI Id,we
                      are not direct or in directly responsible for your payment failure
                    </Text>
                  </View>
              )}

              <AppButton
                  onPress={() => {
                    saveShopToDb();
                  }}
                  title={'EDIT'}
                  containerStyle={{ marginTop: hp(2), backgroundColor: color.themeBtnColor }}
              />
              <Text style={{ marginTop: hp(1), fontSize: normalize(12) }}>
                Note:These are not your complete details,These are only the details which you can edit
                at your level.To check your complete details please check My Shop Request page from
                Drawer menu.Thank You
              </Text>
              <View style={{ height: hp(5) }} />
            </View>
          </KeyboardAwareScrollView>
        </GradientBackground>
    );
  };
  return (
    <GradientBackground>
      <AppHeader title={'Edit Your Details'} onMenuPress={() => props.navigation.openDrawer()} />
      {requestNotMaded ? (
        (IsAndroidOS || IsIOSOS)?shopDataFormForWebInDevice():shopDataForm()
      ) : (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Text>Not any shop request is their</Text>
        </View>
      )}
      {isLoading && <Loading isLoading={isLoading} />}
    </GradientBackground>
  );
};
const style = StyleSheet.create({
  imgView: {
    height: hp(15),
    width: wp(92),
    borderRadius: hp(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageStyle: {
    height: wp(10),
    width: wp(10),
    borderRadius: wp(5),
    alignSelf:'center'
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
  imgText: { fontSize: normalize(11), fontWeight: '700' },
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

export default ShopDetailEditScreen;
