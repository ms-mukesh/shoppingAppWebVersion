import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
  BackHandler,
} from 'react-native';

import { useSelector } from 'react-redux';
import {
  AppButton,
  AppHeader,
  FloatingLabel,
  GoBackHeader,
  GradientBackground,
  LabelInputText,
  Loading,
  PaymentTypeCheckBox,
} from '../../common';
import { useDispatch } from 'react-redux';
import {
  getMyShopDetails,
  requestForAddingStore,
  requestForEditStore,
} from '../../../redux/actions/storeAction';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {color, hp, isANDROID, IsAndroidOS, isIOS, IsIOSOS, normalize, wp} from '../../../helper/themeHelper';
import * as ImagePicker from 'expo-image-picker';
import { checkNamesIsEmpty, validateEmail } from '../../../helper/validation';
import { setLoaderStatus } from '../../../redux/actions/dashboardAction';
import { uploadImageOnFirebase } from '../../../helper/firebaseMethods';
import { CommonActions } from '@react-navigation/native';

const ShopOwnerRequestScreen = (props) => {
  const { fromPopUp = false } = props.route.params;
  console.log('from pop up value--', fromPopUp);
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.appDefaultSettingReducer.isLoading);
  const [myStoreDetail, setMyStoreDetail] = useState([]);
  const [User, setUser] = useState({});
  const [isWholeSeller, setIsWholeSeller] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const [isPanImageChange, setIsPanImageChange] = useState(false);
  const [isProfileImageChange, setIsProfileImageChange] = useState(false);
  const [isGstImageChange, setGstImageChange] = useState(false);
  const [isChequeImageChange, setChequeImageChange] = useState(false);
  const [requestNotMaded, setIsRequestNotMaded] = useState(false);
  const [checkBoxArr, setCheckboxArr] = useState([]);
  const handleBackPress = () => {
    if (fromPopUp) {
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        })
      );
    }
    return true;
  };
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
  }, []);
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
    } else if (checkNamesIsEmpty(User.companyName)) {
      alert('please enter company name');
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
    } else if (checkNamesIsEmpty(User.pincode) || isNaN(User?.pincode)) {
      alert('please enter company address pincode');
      return;
    } else if (checkNamesIsEmpty(User.firstName)) {
      alert('please enter First name');
      return;
    } else if (!validateEmail(User.email)) {
      alert('please enter correct email address');
      return;
    } else if (isNaN(User.mobile) || User.mobile.toString().length !== 10) {
      alert('please enter correct mobile number');
      return;
    } else if (checkNamesIsEmpty(User.panCardName)) {
      alert('please enter pan card name');
      return;
    } else if (checkNamesIsEmpty(User.panNumber)) {
      alert('please enter pan card number');
      return;
    } else if (checkNamesIsEmpty(User.gstNumber)) {
      alert('please enter gst number');
      return;
    } else if (checkNamesIsEmpty(User.backAccNumber)) {
      alert('please enter bank account number');
      return;
    } else if (checkNamesIsEmpty(User.ifscCode)) {
      alert('please enter bank ifsc Code ');
      return;
    } else if (checkNamesIsEmpty(User.bankName)) {
      alert('please enter bank name');
      return;
    } else if (checkNamesIsEmpty(User.bankAccName)) {
      alert('please enter bank name');
      return;
    } else if (checkNamesIsEmpty(User.brandName)) {
      alert('please enter brand name');
      return;
    } else if (
      checkNamesIsEmpty(User.alterNatePhoneNumber) ||
      isNaN(User.alterNatePhoneNumber) ||
      User.alterNatePhoneNumber.length !== 10
    ) {
      alert('please enter alter nate phone number');
      return;
    } else if (User.panCardImage === '') {
      alert('please add pan card Image');
      return;
    } else if (User.gstCardImage === '') {
      alert('please add GST card Image');
      return;
    } else if (User?.cancelChequeImage === '') {
      alert('please add Cancel cheque Image');
      return;
    } else if (checkBoxArr.length === 0) {
      alert('please select atleast single mode of payment');
      return;
    } else if (
      checkBoxArr.length > 0 &&
      checkBoxArr.includes(1) &&
      (User?.upiId === '' || typeof User?.upiId === 'undefined')
    ) {
      alert('please enter your Buisness UPI id');
      return;
    } else {
      let saveRequestObj = {
        inputStoreImage: User.storeImage,
        inputCompanyName: User.companyName,
        inputCompanyEmail: User.email,
        inputBrandName: User.brandName,
        inputGstNumber: User.gstNumber,
        inputContactNumber: User.mobile,
        inputAccountNumber: User.backAccNumber,
        inputAccountName: User.bankAccName,
        inputIfscCode: User.ifscCode,
        inputBankName: User.bankName,
        inputStoreType: isWholeSeller ? '1' : '0',
        inputAlternatePhoneNumber: User.alterNatePhoneNumber,
        inputCity: User.city,
        inputState: User.state,
        inputPincode: User.pincode,
        inputPanCard: User.panCardImage,
        inputGstCard: User.gstCardImage,
        inputCancelCheck: User.cancelChequeImage,
        inputPanName: User.panCardName,
        inputPanNumber: User.panNumber,
        inputStreet: User.street,
        inputlandmark: User.landmark,
        inputContactName: User.firstName + ' ' + User.middleName + ' ' + User.lastName,
        inputPaymentMode: checkBoxArr.join(),
        inputUpiId:
          checkBoxArr.length > 0 && checkBoxArr.includes(1) && typeof User?.upiId !== 'undefined'
            ? User?.upiId
            : '',
      };
      dispatch(setLoaderStatus(true));
      uploadImageOnFirebase(isProfileImageChange ? User?.storeImage : '').then((storeImageUrl) => {
        if (storeImageUrl) {
          saveRequestObj = { ...saveRequestObj, inputStoreImage: storeImageUrl };
        }
        uploadImageOnFirebase(isPanImageChange ? User?.panCardImage : '').then(
          (panCardImageUrl) => {
            if (panCardImageUrl) {
              saveRequestObj = { ...saveRequestObj, inputPanCard: panCardImageUrl };
            }
            uploadImageOnFirebase(isGstImageChange ? User?.gstCardImage : '').then(
              (gstCardImageUrl) => {
                if (panCardImageUrl) {
                  saveRequestObj = { ...saveRequestObj, inputGstCard: gstCardImageUrl };
                }
                uploadImageOnFirebase(isChequeImageChange ? User?.cancelChequeImage : '').then(
                  (cancelChequeImage) => {
                    if (cancelChequeImage) {
                      saveRequestObj = { ...saveRequestObj, inputCancelCheck: cancelChequeImage };
                    }
                    dispatch(requestForEditStore(saveRequestObj)).then((res) => {
                      if (res) {
                        Alert.alert('', 'Your request is added succefully!' + ' ', [
                          {
                            text: 'OK',
                            onPress: () => {
                              props.navigation.dispatch(
                                CommonActions.reset({
                                  index: 0,
                                  routes: [{ name: 'Dashboard', params: { setfromLogin: true } }],
                                })
                              );
                            },
                          },
                        ]);
                      } else {
                        dispatch(setLoaderStatus(false));
                        alert('failed to register your request...please try again');
                      }
                    });
                  }
                );
              }
            );
          }
        );
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

        // await setMyStoreDetail(res);
        await setUser({
          ...User,
          companyName: res?.companyName ?? '',
          companyAddress: '',
          firstName: res?.contactName ?? '',
          lastName: '',
          middleName: '',
          email: res?.companyEmail ?? '',
          mobile: res?.contactNumber?.toString() ?? '',
          panCardName: res?.panName ?? '',
          panNumber: res?.panNumber ?? '',
          gstNumber: res?.gstNumber ?? '',
          backAccNumber: res?.bankDetail?.accountNumber?.toString() ?? '',
          ifscCode: res?.bankDetail?.ifscCode ?? '',
          brandName: res?.brandName ?? '',
          alterNatePhoneNumber: res?.alternatePhoneNumber?.toString() ?? '',
          bankName: res?.bankDetail?.bankName ?? '',
          bankAccName: res?.bankDetail?.accountName ?? '',
          state: res?.address?.state ?? '',
          city: res?.address?.city ?? '',
          pincode: res?.address?.pincode?.toString() ?? '',
          street: res?.address?.street ?? '',
          landmark: res?.address?.state ?? '',
          panCardImage: res?.document?.panCard ?? '',
          gstCardImage: res?.document?.gstCard ?? '',
          cancelChequeImage: res?.document?.cancelCheck ?? '',
          storeImage: res?.storeImage ?? '',
          status: res?.isApproved ?? '',
          remark: res?.remark ?? '',
          upiId: res?.upi,
        });
        console.log('res--', res);
        setIsWholeSeller(res?.storeType === '0' ? true : false);
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
            activeOpacity={0.8}
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
                {renderNameFloatingTextInput('COMPANY NAME', User.companyName, 'companyName', true)}
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
            </View>

            <View style={[style.groupView, { marginTop: hp(2) }]}>
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
                  'PAN CARD NAME',
                  User.panCardName,
                  'panCardName',
                  true
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
                {renderNameFloatingTextInput('PAN NUMBER', User.panNumber, 'panNumber', true)}
                {renderNameFloatingTextInput('GST NUMBER', User.gstNumber, 'gstNumber', true)}
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
                  'BANK ACCOUNT NUMBER',
                  User.backAccNumber,
                  'backAccNumber',
                  true
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
                {renderNameFloatingTextInput('IFSC CODE', User.ifscCode, 'ifscCode', true)}
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
                {renderNameFloatingTextInput('BANK NAME', User.bankName, 'bankName', true)}
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
                  'BANK ACCOUNT NAME',
                  User.bankAccName,
                  'bankAccName',
                  true
                )}
              </View>
            </View>

            <View style={[style.groupView, { marginTop: hp(2) }]}>
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
                {renderNameFloatingTextInput('BRAND NAME', User.brandName, 'brandName', true)}
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
                {renderRadioButton('TYPE', 'WHOLESALER', 'MANUFATURER')}
              </View>
            </View>
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
                disable={!isEditable}
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
                {renderNameFloatingTextInput('UPI ID', User.upiId, 'upiId', true, null, false)}
              </View>
            )}

            <View style={[style.groupView, { marginTop: hp(2) }]}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  isEditable && openImagePicker('panCardImage');
                }}
              >
                <View style={style.imgView}>
                  {User?.panCardImage !== '' ? (
                    <Image
                      resizeMode={'contain'}
                      style={style.imgView}
                      source={{ uri: User.panCardImage }}
                    />
                  ) : (
                    <Text style={style.imgText}>Add Pan Card Image</Text>
                  )}
                  {console.log(User.panCardImage + 'hello')}
                </View>
              </TouchableOpacity>
            </View>

            <View style={[style.groupView, { marginTop: hp(2) }]}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  isEditable && openImagePicker('gstCardImage');
                }}
              >
                <View style={style.imgView}>
                  {User?.gstCardImage !== '' ? (
                    <Image
                      resizeMode={'contain'}
                      style={style.imgView}
                      source={{ uri: User.gstCardImage }}
                    />
                  ) : (
                    <Text style={style.imgText}>Add GST Card Image</Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            <View style={[style.groupView, { marginTop: hp(2) }]}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  isEditable && openImagePicker('cancelChequeImage');
                }}
              >
                <View style={style.imgView}>
                  {User?.cancelChequeImage !== '' ? (
                    <Image
                      resizeMode={'contain'}
                      style={style.imgView}
                      source={{ uri: User.cancelChequeImage }}
                    />
                  ) : (
                    <Text style={style.imgText}>Add Cancel Cheque Image</Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
            {User?.remark !== null && User?.remark !== '' && (
              <View style={[style.groupView, { marginTop: hp(2), padding: hp(2) }]}>
                <Text style={{ fontSize: normalize(15), fontWeight: '700' }}>REJECT REASON</Text>
                <Text style={{ fontSize: normalize(13) }}>{User?.remark}</Text>
              </View>
            )}
            <AppButton
              onPress={() => {}}
              title={
                User?.status
                  ? 'ACCEPTED'
                  : User?.remark !== '' && User?.remark !== null
                  ? 'REJECTED'
                  : 'PENDING'
              }
              containerStyle={{
                marginTop: hp(2),
                backgroundColor: User?.status
                  ? color.green
                  : User?.remark !== '' && User?.remark !== null
                  ? color.red
                  : color.yellow,
              }}
            />
            {isEditable && (
              <AppButton
                onPress={() => {
                  saveShopToDb();
                }}
                title={'ADD REQUEST AGAIN'}
                containerStyle={{ marginTop: hp(2), backgroundColor: color.themeBtnColor }}
              />
            )}
            <View style={{ height: hp(5) }} />
          </View>
        </KeyboardAwareScrollView>
      </GradientBackground>
    );
  };
  const shopDataFormForMobileDevice = () => {
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
                activeOpacity={0.8}
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
                  {renderNameFloatingTextInput('COMPANY NAME', User.companyName, 'companyName', true)}
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
              </View>

              <View style={[style.groupView, { marginTop: hp(2) }]}>
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
                      'PAN CARD NAME',
                      User.panCardName,
                      'panCardName',
                      true
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
                  {renderNameFloatingTextInput('PAN NUMBER', User.panNumber, 'panNumber', true)}
                  {renderNameFloatingTextInput('GST NUMBER', User.gstNumber, 'gstNumber', true)}
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
                      'BANK ACCOUNT NUMBER',
                      User.backAccNumber,
                      'backAccNumber',
                      true
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
                  {renderNameFloatingTextInput('IFSC CODE', User.ifscCode, 'ifscCode', true)}
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
                  {renderNameFloatingTextInput('BANK NAME', User.bankName, 'bankName', true)}
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
                      'BANK ACCOUNT NAME',
                      User.bankAccName,
                      'bankAccName',
                      true
                  )}
                </View>
              </View>

              <View style={[style.groupView, { marginTop: hp(2) }]}>
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
                  {renderNameFloatingTextInput('BRAND NAME', User.brandName, 'brandName', true)}
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
                  {renderRadioButton('TYPE', 'WHOLESALER', 'MANUFATURER')}
                </View>
              </View>
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
                    disable={!isEditable}
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
                    {renderNameFloatingTextInput('UPI ID', User.upiId, 'upiId', true, null, false)}
                  </View>
              )}

              <View style={[style.groupView, { marginTop: hp(2) }]}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      isEditable && openImagePicker('panCardImage');
                    }}
                >
                  <View style={style.imgView}>
                    {User?.panCardImage !== '' ? (
                        <Image
                            resizeMode={'contain'}
                            style={style.imgView}
                            source={{ uri: User.panCardImage }}
                        />
                    ) : (
                        <Text style={style.imgText}>Add Pan Card Image</Text>
                    )}
                    {console.log(User.panCardImage + 'hello')}
                  </View>
                </TouchableOpacity>
              </View>

              <View style={[style.groupView, { marginTop: hp(2) }]}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      isEditable && openImagePicker('gstCardImage');
                    }}
                >
                  <View style={style.imgView}>
                    {User?.gstCardImage !== '' ? (
                        <Image
                            resizeMode={'contain'}
                            style={style.imgView}
                            source={{ uri: User.gstCardImage }}
                        />
                    ) : (
                        <Text style={style.imgText}>Add GST Card Image</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>

              <View style={[style.groupView, { marginTop: hp(2) }]}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      isEditable && openImagePicker('cancelChequeImage');
                    }}
                >
                  <View style={style.imgView}>
                    {User?.cancelChequeImage !== '' ? (
                        <Image
                            resizeMode={'contain'}
                            style={style.imgView}
                            source={{ uri: User.cancelChequeImage }}
                        />
                    ) : (
                        <Text style={style.imgText}>Add Cancel Cheque Image</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
              {User?.remark !== null && User?.remark !== '' && (
                  <View style={[style.groupView, { marginTop: hp(2), padding: hp(2) }]}>
                    <Text style={{ fontSize: normalize(15), fontWeight: '700' }}>REJECT REASON</Text>
                    <Text style={{ fontSize: normalize(13) }}>{User?.remark}</Text>
                  </View>
              )}
              <AppButton
                  onPress={() => {}}
                  title={
                    User?.status
                        ? 'ACCEPTED'
                        : User?.remark !== '' && User?.remark !== null
                        ? 'REJECTED'
                        : 'PENDING'
                  }
                  containerStyle={{
                    marginTop: hp(2),
                    backgroundColor: User?.status
                        ? color.green
                        : User?.remark !== '' && User?.remark !== null
                            ? color.red
                            : color.yellow,
                  }}
              />
              {isEditable && (
                  <AppButton
                      onPress={() => {
                        saveShopToDb();
                      }}
                      title={'ADD REQUEST AGAIN'}
                      containerStyle={{ marginTop: hp(2), backgroundColor: color.themeBtnColor }}
                  />
              )}
              <View style={{ height: hp(5) }} />
            </View>
          </KeyboardAwareScrollView>
        </GradientBackground>
    );
  };
  return (
    <GradientBackground>
      {fromPopUp ? (
        <GoBackHeader
          title={'My Request Status'}
          onMenuPress={() =>
            props.navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Dashboard' }],
              })
            )
          }
        />
      ) : (
        <AppHeader
          rightTitle={requestNotMaded && User?.remark !== null && User?.remark !== '' ? 'EDIT' : ''}
          onRightTitlePress={() => {
            alert('Now you can edit your form and submit again');
            setIsEditable(true);
          }}
          title={'My Request Status'}
          onMenuPress={() => props.navigation.openDrawer()}
        />
      )}

      {requestNotMaded ? (
          (IsIOSOS || IsAndroidOS)?shopDataFormForMobileDevice(): shopDataForm()
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

export default ShopOwnerRequestScreen;
