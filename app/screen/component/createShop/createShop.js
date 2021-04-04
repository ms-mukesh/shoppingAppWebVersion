import React, { useState, useEffect } from 'react';
import { CommonActions } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  AppButton,
  AppHeader,
  FloatingLabel,
  GradientBackground,
  LabelInputText,
  Loading,
  PaymentTypeCheckBox,
} from '../../common';
import {color, hp, isANDROID, IsAndroidOS, isIOS, IsIOSOS, normalize, wp} from '../../../helper/themeHelper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { checkNamesIsEmpty, isNumeric, validateEmail } from '../../../helper/validation';
import { useDispatch, useSelector } from 'react-redux';
import { getMyShopDetails, requestForAddingStore } from '../../../redux/actions/storeAction';
import { back_arrow_icon } from '../../../assets/images';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageOnFirebase } from '../../../helper/firebaseMethods';
import { setLoaderStatus } from '../../../redux/actions/dashboardAction';
const userDefaultObj = {
  companyName: '',
  companyAddress: '',
  firstName: '',
  lastName: '',
  middleName: '',
  email: '',
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
  panCardImage: '',
  gstCardImage: '',
  cancelChequeImage: '',
  storeImage: '',
  upiId: '',
};

const CreateShopScreen = (props) => {
  const [User, setUser] = useState({ ...userDefaultObj });
  const [isWholeSeller, setIsWholeSeller] = useState(true);
  const cartDetails = useSelector((state) => state.productReducer.myCart);
  const isLoading = useSelector((state) => state.appDefaultSettingReducer.isLoading);
  const dispatch = useDispatch();
  const [requestNotMaded, setIsRequestNotMaded] = useState(false);
  const [checkBoxArr, setCheckboxArr] = useState([]);
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
    } else if (checkNamesIsEmpty(User.middleName)) {
      alert('please enter Middle name');
      return;
    } else if (checkNamesIsEmpty(User.lastName)) {
      alert('please enter Last name');
      return;
    } else if (!validateEmail(User.email)) {
      alert('please enter correct email address');
      return;
    } else if (checkNamesIsEmpty(User.mobile) || isNaN(User.mobile) || User.mobile.length !== 10) {
      alert('please enter mobile number');
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
    } else if (checkBoxArr.length > 0 && checkBoxArr.includes(1) && User?.upiId === '') {
      alert('please enter your Buisness UPI id');
      return;
    } else {
      let saveRequestObj = {
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
        inputPanCard: '',
        inputGstCard: '',
        inputCancelCheck: '',
        inputPanName: User.panCardName,
        inputPanNumber: User.panNumber,
        inputStreet: User.street,
        inputlandmark: User.landmark,
        inputContactName: User.firstName + ' ' + User.middleName + ' ' + User.lastName,
        inputPaymentMode: checkBoxArr.join(),
      };
      if (checkBoxArr.includes(1)) {
        saveRequestObj = { ...saveRequestObj, inputUpiId: User?.upiId };
      }
      dispatch(setLoaderStatus(true));
      uploadImageOnFirebase(User?.storeImage).then((storeImageUrl) => {
        if (storeImageUrl) {
          saveRequestObj = { ...saveRequestObj, inputStoreImage: storeImageUrl };
          uploadImageOnFirebase(User?.panCardImage).then((panCardImageUrl) => {
            if (panCardImageUrl) {
              saveRequestObj = { ...saveRequestObj, inputPanCard: panCardImageUrl };
              uploadImageOnFirebase(User?.gstCardImage).then((gstCardImageUrl) => {
                if (gstCardImageUrl) {
                  saveRequestObj = { ...saveRequestObj, inputGstCard: gstCardImageUrl };
                  uploadImageOnFirebase(User?.cancelChequeImage).then((cancelChequeImage) => {
                    if (cancelChequeImage) {
                      saveRequestObj = { ...saveRequestObj, inputCancelCheck: cancelChequeImage };
                      dispatch(requestForAddingStore(saveRequestObj)).then((res) => {
                        if (res) {
                          Alert.alert('', 'Your store request is added succefully!' + ' ', [
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
                    } else {
                      dispatch(setLoaderStatus(false));
                      alert('Fail to add your request due to cancel cheque image uplaod failure');
                    }
                  });
                } else {
                  dispatch(setLoaderStatus(false));
                  alert('Fail to add your request due to GST card image uplaod failure');
                }
              });
            } else {
              dispatch(setLoaderStatus(false));
              alert('Fail to add your request due to pan card image uplaod failure');
            }
          });
        } else {
          dispatch(setLoaderStatus(false));
          alert('Fail to add your request due to store image uplaod failure');
        }
      });
    }
  };
  useEffect(() => {
    dispatch(getMyShopDetails()).then(async (res) => {
      if (res !== null) {
        await setIsRequestNotMaded(true);
      }
    });
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
              setIsWholeSeller(true);
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
              setIsWholeSeller(false);
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
  const createShopForm = () => {
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
              openImagePicker('storeImage');
            }}
          >
            <View style={{ height:hp(20),width:hp(20),borderRadius:hp(10), alignSelf: 'center' }}>
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
                  resizeMode={'contain'}
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
                {renderNameFloatingTextInput('FIRST NAME', User.firstName, 'firstName', true)}
                {renderNameFloatingTextInput('MIDDLE NAME', User.middleName, 'middleName', true)}
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
                  {renderNameFloatingTextInput('IFSC CODE', User.ifscCode, 'ifscCode', true)}
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
              <TouchableOpacity
                  activeOpacity={0.8}
                onPress={() => {
                  openImagePicker('panCardImage');
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
                    <Text style={style.imgText}>ADD PAN CARD IMAGE</Text>
                  )}
                  {console.log(User.panCardImage + 'hello')}
                </View>
              </TouchableOpacity>
            </View>

            <View style={[style.groupView, { marginTop: hp(2) }]}>
              <TouchableOpacity
                  activeOpacity={0.8}
                onPress={() => {
                  openImagePicker('gstCardImage');
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
                    <Text style={style.imgText}>ADD GST CARD IMAGE</Text>
                  )}
                  {console.log(User.panCardImage + 'hello')}
                </View>
              </TouchableOpacity>
            </View>

            <View style={[style.groupView, { marginTop: hp(2) }]}>
              <TouchableOpacity
                  activeOpacity={0.8}
                onPress={() => {
                  openImagePicker('cancelChequeImage');
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
                    <Text style={style.imgText}>ADD CANCEL CHEQUE IMAGE</Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
            <View style={[style.groupView, { marginTop: hp(2) }]}>
              <Text
                style={{
                  fontSize: normalize(12),
                  textAlign: 'center',
                  color: color.themeBtnColor,
                  fontWeight: '700',
                }}
              >
                MY ACCEPTABLE PAYMENT MODE
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
                  Your Buisness UPI Id
                </Text>
                {renderNameFloatingTextInput('UPI ID', User.upiId, 'upiId', true)}
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
              title={'SUBMIT PROPOSAL'}
              containerStyle={{ marginTop: hp(2),width:wp(35) }}
            />
            <View style={{ height: hp(8) }} />
          </View>
        </KeyboardAwareScrollView>
      </GradientBackground>
    );
  };
  const createShopFormForMobileDevice = () => {
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
                  openImagePicker('storeImage');
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
                  {renderNameFloatingTextInput('FIRST NAME', User.firstName, 'firstName', true)}
                  {renderNameFloatingTextInput('MIDDLE NAME', User.middleName, 'middleName', true)}
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
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      openImagePicker('panCardImage');
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
                        <Text style={style.imgText}>ADD PAN CARD IMAGE</Text>
                    )}
                    {console.log(User.panCardImage + 'hello')}
                  </View>
                </TouchableOpacity>
              </View>

              <View style={[style.groupView, { marginTop: hp(2) }]}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      openImagePicker('gstCardImage');
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
                        <Text style={style.imgText}>ADD GST CARD IMAGE</Text>
                    )}
                    {console.log(User.panCardImage + 'hello')}
                  </View>
                </TouchableOpacity>
              </View>

              <View style={[style.groupView, { marginTop: hp(2) }]}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      openImagePicker('cancelChequeImage');
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
                        <Text style={style.imgText}>ADD CANCEL CHEQUE IMAGE</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
              <View style={[style.groupView, { marginTop: hp(2) }]}>
                <Text
                    style={{
                      fontSize: normalize(12),
                      textAlign: 'center',
                      color: color.themeBtnColor,
                      fontWeight: '700',
                    }}
                >
                  MY ACCEPTABLE PAYMENT MODE
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
                      Your Buisness UPI Id
                    </Text>
                    {renderNameFloatingTextInput('UPI ID', User.upiId, 'upiId', true)}
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
                  title={'SUBMIT PROPOSAL'}
                  containerStyle={{ marginTop: hp(2) }}
              />
              <View style={{ height: hp(8) }} />
            </View>
          </KeyboardAwareScrollView>
        </GradientBackground>
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
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        title={'Create your own shop'}
        onMenuPress={() => {
          props.navigation.openDrawer();
        }}
        cartItemCount={cartDetails.length}
        onCartIconPress={() => {
          props.navigation.navigate('CartDetail');
        }}
      />

      {!requestNotMaded ? (
          (IsAndroidOS || IsIOSOS)?createShopFormForMobileDevice(): createShopForm()
      ) : (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Text>Your Shop request is already Their</Text>
        </View>
      )}
      {isLoading && <Loading isLoading={isLoading} />}
    </View>
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
    fontSize: normalize(10),
    // fontFamily: font.robotoRegular,
    height: isANDROID ? hp(6) : hp(5),
    marginTop: isANDROID ? hp(3) : hp(2),
  },
  floatingAddressInputStyle: {
    borderWidth: 0,
    fontSize: normalize(10),
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

export default CreateShopScreen;
