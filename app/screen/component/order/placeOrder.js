import React, { useEffect, useState } from 'react';
import { CommonActions } from '@react-navigation/native';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FloatingLabel,
  GoBackHeader,
  GradientBackground,
  ImagePreview,
  LabelInputText,
  Loading,
  rupeesIcon,
} from '../../common';
import { useDispatch, useSelector } from 'react-redux';
import { getCartItems, removeItemFromCart } from '../../../redux/actions/homeScreenActions';
import {color, hp, isANDROID, IsAndroidOS, isIOS, IsIOSOS, normalize, wp} from '../../../helper/themeHelper';
import SafeAreaView from 'react-native-safe-area-view';
import {
  addNewAddress,
  editUserProfile,
  getMyAddresses,
  placeUserOrder,
  updatePlaceOrderStatusForPayment,
  updatePlaceOrderStatusForPaymentForCart,
} from '../../../redux/actions/userActions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { checkNamesIsEmpty, sumTotalPrice, sumTotalQty } from '../../../helper/validation';
import { getStorePaymentModes } from '../../../redux/actions/storeAction';
import { camera_icon } from '../../../assets/images';
import * as ImagePicker from 'expo-image-picker';
import { setLoaderStatus } from '../../../redux/actions/dashboardAction';
import { uploadImageOnFirebase } from '../../../helper/firebaseMethods';
import { setUserDetails } from '../../../redux/actions/userAuth';
import { RAZOR_PAY_KEY } from '../../../helper/constant';
import RazorpayCheckout from 'react-native-razorpay';

const PaymentMode = [
  { name: 'COD', id: 0 },
  { name: 'Online Payment', id: 1 },
];

const PlaceOrderScreen = (props) => {
  const { cartIndex = 0 } = props.route.params;
  const userDetail = useSelector((state) => state.user.userDetail);
  const [gender, setGender] = useState(userDetail?.gender === 'MALE' ? true : false);
  const userDefaultObj = {
    firstName: userDetail?.firstName ?? '',
    lastName: userDetail?.lastName ?? '',
    middleName: userDetail?.middleName ?? '',
    email: userDetail?.email ?? '',
    profileImage: userDetail?.image ?? '',
  };
  const [User, setUser] = useState({ ...userDefaultObj });
  const shopCartDetails = useSelector((state) => state.productReducer.myCart);
  const [cartDetails, setCartDetails] = useState(shopCartDetails[cartIndex]);
  const [editProfileFlag, setEditProfileFlag] = useState(false);
  console.log(cartDetails);
  const [currentAddressIndex, setCurrentAddressIndex] = useState(0);
  const [currentPaymentIndex, setCurrentPaymentIndex] = useState(0);
  const [shopPaymentModes, setShopPaymentMode] = useState([]);
  const isLoading = useSelector((state) => state.appDefaultSettingReducer.isLoading);
  const addressDetails = useSelector((state) => state.user.userAddress);
  const [orderPreview, setOrderPreview] = useState(false);
  const [addnewAddressFlag, setNewAddressFlag] = useState(false);
  const [imagePreviewFlag, setImagePreviewFlag] = useState(false);
  const [currentImageArray, setCurrentImageArray] = useState([]);
  const [isProfileImageChange, setIsUserProfileChange] = useState(false);
  const [addressDetail, setAddressDetail] = useState({
    street: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
  });
  const dispatch = useDispatch();
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
      setEditProfileFlag(false);
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
              }
            });
          }
        });
      });
    }
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
  const closeImagePreview = () => {
    setImagePreviewFlag(false);
  };
  useEffect(() => {
    if (typeof cartDetails === 'undefined') {
      setCartDetails([]);
    } else {
      setCartDetails(shopCartDetails[cartIndex]);
    }
  }, [shopCartDetails]);
  useEffect(() => {
    dispatch(getMyAddresses()).then((res) => {
      if (res) {
        console.log('address-', addressDetails);
      }
    });
    dispatch(getStorePaymentModes({ inputProductId: cartDetails[0]?.product })).then((res) => {
      let tempPaymentMode = [];
      if (res.includes('0')) {
        tempPaymentMode.push({ name: 'cash on delivery(COD)' });
      }
      if (res.includes('1')) {
        tempPaymentMode.push({ name: 'UPI' });
      }
      if (res.includes('2')) {
        tempPaymentMode.push({ name: 'NET Banking' });
      }
      if (res.includes('3')) {
        tempPaymentMode.push({ name: 'Credit Card' });
      }
      if (res.includes('4')) {
        tempPaymentMode.push({ name: 'Debit Card' });
      }
      setShopPaymentMode([...tempPaymentMode]);
      console.log('address-', res);
    });
  }, []);
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
              setAddressDetail({ ...addressDetail, [key]: isIOS ? text.toUpperCase() : text });
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
              setAddressDetail({ ...addressDetail, [key]: isIOS ? text.toUpperCase() : text });
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

  const removeCartItem = (productId) => {
    dispatch(removeItemFromCart(productId)).then((res) => {
      if (res) {
        alert('Removed');
        dispatch(getCartItems()).then((res) => {});
      }
    });
  };
  const renderNameFloatingTextInputForProfile = (
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

  const _RenderItem = (item, index) => {
    return (
      <View style={style.mainView}>
        <View style={{ padding: hp(1), flexDirection: 'row' }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              !orderPreview && setImagePreviewFlag(true);
              !orderPreview && setCurrentImageArray(item?.image?.split());
            }}
          >
            <View style={{ flex: 1 }}>
              <Image
                resizeMode={'contain'}
                style={{ height: hp(10), width: orderPreview ? wp(30) : wp(20) }}
                source={{ uri: item?.image?.split()[0] }}
              />
            </View>
          </TouchableOpacity>
          <View style={{ flex: 2 }}>
            <Text style={style.textStyle}>{item?.name}</Text>
            <View style={style.dividerView} />
            <Text style={style.textStyle}>{'qty:' + item?.quantity}</Text>
            <View style={style.dividerView} />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  height: hp(2),
                  width: hp(2),
                  marginTop: hp(1),
                  borderRadius: hp(1),
                  backgroundColor: item?.color?.toLowerCase(),
                }}
              />
              <Text style={[style.textStyle, { marginLeft: wp(1), marginTop: hp(1) }]}>
                {item?.color}
              </Text>
            </View>
            <View style={style.dividerView} />
            <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
              {rupeesIcon()}
              <Text style={style.textStyle}>{item?.price}</Text>
            </View>
          </View>
          {!orderPreview && (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  removeCartItem(item?.product);
                }}
              >
                <View
                  style={[
                    style.listBtnStyle,
                    { backgroundColor: color.themeBtnColor, borderRadius: hp(1) },
                  ]}
                >
                  <Text style={style.listBtnTextStyle}>REMOVE</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          {editProfileFlag && (
            <Modal
              onRequestClose={() => setEditProfileFlag(false)}
              animated={true}
              transparent={false}
              visible={true}
            >
              <GradientBackground>
                <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: hp(1) }}>
                  <KeyboardAwareScrollView
                    style={{ justifySelf: 'center' }}
                    contentContainerStyle={{ zIndex: 1 }}
                    keyboardShouldPersistTaps="handled"
                    behavior={'position'}
                    enabled
                  >
                    <Text
                      style={{
                        paddingRight: wp(2),
                        alignSelf: 'flex-end',
                        fontWeight: '700',
                        color: color.themeBtnColor,
                        fontSize: normalize(16),
                      }}
                      onPress={() => {
                        setEditProfileFlag(false);
                      }}
                    >
                      CANCEL
                    </Text>
                    <Text style={[style.textStyle, { textAlign: 'center', fontWeight: '700' }]}>
                      FILL FOLLOWING
                    </Text>
                    <View style={{ flex: 1 }}>
                      <TouchableOpacity
                        onPress={() => {
                          openImagePicker('profileImage');
                        }}
                      >
                        <View style={{ flex: 1, ...style.center }}>
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
                              resizeMode={'cover'}
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
                          {renderNameFloatingTextInputForProfile(
                            'FIRST NAME',
                            User.firstName,
                            'firstName',
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
                          {renderNameFloatingTextInputForProfile(
                            'LAST NAME',
                            User.lastName,
                            'lastName',
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
                          {renderNameFloatingTextInputForProfile(
                            'EMAIL',
                            User.email,
                            'email',
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
                          {renderRadioButton('GENDER', 'MALE', 'FEMALE')}
                        </View>
                      </View>
                      <View style={{ height: hp(8) }} />
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        updateProfile();
                      }}
                    >
                      <View
                        style={{
                          ...style.center,
                          alignSelf: 'center',
                          width: wp(80),
                          height: hp(5),
                          marginTop: hp(2),
                          backgroundColor: color.themeBtnColor,
                        }}
                      >
                        <Text
                          style={{ fontWeight: '900', fontSize: normalize(16), color: color.white }}
                        >
                          SAVE
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </KeyboardAwareScrollView>
                </SafeAreaView>
              </GradientBackground>
            </Modal>
          )}
        </View>
        {/*<View style={{ height: hp(0.08), marginTop: hp(1), backgroundColor: 'gray' }} />*/}
      </View>
    );
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
              activeOpacity={0.8}
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
        <View style={{ height: hp(0.08), marginTop: hp(1), backgroundColor: '#d5d5d5' }} />
      </View>
    );
  };
  const _RenderPaymentMode = (item, index) => {
    return (
      <View>
        <View style={{ padding: hp(1), flexDirection: 'row' }}>
          <View style={{ flex: 4 }}>
            <Text style={style.textStyle}>{item?.name}</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setCurrentPaymentIndex(index);
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
                {index === currentPaymentIndex && (
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
        <View style={{ height: hp(0.08), marginTop: hp(1), backgroundColor: '#d5d5d5' }} />
      </View>
    );
  };
  const addNewAddressToDb = () => {
    if (checkNamesIsEmpty(addressDetail.street)) {
      alert('please enter company address street');
      return;
    } else if (checkNamesIsEmpty(addressDetail.landmark)) {
      alert('please enter company address landmark');
      return;
    } else if (checkNamesIsEmpty(addressDetail.state)) {
      alert('please enter company address state');
      return;
    } else if (checkNamesIsEmpty(addressDetail.city)) {
      alert('please enter company address city');
      return;
    } else if (checkNamesIsEmpty(addressDetail.pincode)) {
      alert('please enter company address pincode');
      return;
    } else {
      let obj = {
        inputType: 'office',
        inputStreet: addressDetail.street,
        inputCity: addressDetail.city,
        inputState: addressDetail.state,
        inputPincode: addressDetail.pincode,
        inputLandmark: addressDetail.landmark,
      };
      setNewAddressFlag(false);
      dispatch(addNewAddress(obj)).then((res) => {
        if (res) {
          alert('New Address added');
          dispatch(getMyAddresses()).then((res) => {
            console.log('adress list--', res);
          });
        }
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {isLoading && <Loading isLoading={isLoading} />}
      {imagePreviewFlag && (
        <ImagePreview imgArray={currentImageArray} setPreviewClose={closeImagePreview} />
      )}
      <GoBackHeader
        onMenuPress={() => {
          props.navigation.goBack();
        }}
        title={'PLACE YOUR ORDER'}
      />
      {typeof cartDetails !== 'undefined' && (
        <View style={{ flex: 1 }}>
          <ScrollView nestedScrollEnabled={true}>
            <FlatList
              data={cartDetails}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => _RenderItem(item, index)}
              horizontal={false}
              bounces={isANDROID ? false : true}
            />
            <View style={style.mainView}>
            {addressDetails.length > 0 && (
              <Text
                style={[
                  style.textStyle,
                  { marginLeft: wp(2), fontWeight: '700', color: color.themeBtnColor },
                ]}
              >
                SELECT ADDRESS
              </Text>
            )}
            <FlatList
              data={addressDetails}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => _RenderUserAddress(item, index)}
              horizontal={false}
              bounces={isANDROID ? false : true}
            />
            <Text
              onPress={() => {
                setNewAddressFlag(true);
              }}
              style={[
                style.textStyle,
                { color: 'orange', marginTop: hp(1), marginLeft: wp(2), fontWeight: '700' },
              ]}
            >
              ADD NEW ADDRESS
            </Text>
            </View>
            <View style={style.mainView}>

            <Text
              style={[style.textStyle, { marginLeft: wp(2), fontWeight: '700', marginTop: hp(3) }]}
            >
              PAYMENT MODE
            </Text>
            <FlatList
              data={PaymentMode}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => _RenderPaymentMode(item, index)}
              horizontal={false}
              bounces={isANDROID ? false : true}
            />
            </View>
          </ScrollView>
          <Text
            style={[
              style.textStyle,
              { marginRight: wp(2), fontWeight: '700', marginTop: hp(1), alignSelf: 'flex-end' },
            ]}
          >
            TOTAL BILL AMOUNT
          </Text>
          <Text
            style={[
              style.valueStyle,
              {
                marginRight: wp(2),
                fontSize: normalize(15),
                alignSelf: 'flex-end',
                fontWeight: '700',
              },
            ]}
          >
            {sumTotalPrice(cartDetails)}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (addressDetails.length === 0) {
                alert('please add shipping address');
              } else if (
                typeof userDetail.email === 'undefined' ||
                userDetail.email === '' ||
                typeof userDetail.firstName === 'undefined' ||
                userDetail.firstName === '' ||
                typeof userDetail.lastName === 'undefined' ||
                userDetail.lastName === ''
              ) {
                Alert.alert(
                  'please complete your profile first',
                  'Do you want to edit now?' + ' ',
                  [
                    {
                      text: 'YES',
                      onPress: () => {
                        setEditProfileFlag(true);
                      },
                    },
                    {
                      text: 'NO',
                      onPress: () => {},
                    },
                  ]
                );
                return;
              } else {
                setOrderPreview(true);
              }
            }}
          >
            <View
              style={{
                height: hp(5),
                backgroundColor: color.themeBtnColor,
                width: (IsAndroidOS || IsIOSOS)?wp(60): wp(40),
                marginTop: hp(1),
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: normalize(16), color: color.white, fontWeight: '700' }}>
                PLACE MY ORDER
              </Text>
            </View>
          </TouchableOpacity>
          <View style={{height:hp(2)}}/>
        </View>
      )}
      {typeof cartDetails === 'undefined' && (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Text>NO ITEMS AVAILABLE IN YOUR CART!</Text>
        </View>
      )}
      {orderPreview && (
        <Modal
          onRequestClose={() => setOrderPreview(false)}
          animated={true}
          transparent={false}
          visible={true}
        >
          <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
            <Text
              style={{
                paddingRight: wp(2),
                alignSelf: 'flex-end',
                fontWeight: '700',
                color: color.themeBtnColor,
                fontSize: normalize(18),
              }}
              onPress={() => {
                setOrderPreview(false);
              }}
            >
              EDIT
            </Text>
            <FlatList
              data={cartDetails}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => _RenderItem(item, index)}
              horizontal={false}
              bounces={isANDROID ? false : true}
            />
            <Text style={[style.textStyle, { marginLeft: wp(2), fontWeight: '700' }]}>
              SHIPPING ADDRESS
            </Text>
            <Text style={[style.valueStyle, { marginLeft: wp(2) }]}>
              {addressDetails[currentAddressIndex]?.street}
            </Text>
            <Text style={[style.valueStyle, { marginLeft: wp(2) }]}>
              {addressDetails[currentAddressIndex]?.landmark}
            </Text>
            <Text style={[style.valueStyle, { marginLeft: wp(2) }]}>
              {addressDetails[currentAddressIndex]?.city +
                ',' +
                addressDetails[currentAddressIndex]?.state}
            </Text>
            <Text style={[style.valueStyle, { marginLeft: wp(2) }]}>
              {addressDetails[currentAddressIndex]?.pincode}
            </Text>
            <View style={{ marginTop: hp(1), height: hp(0.05), backgroundColor: 'gray' }} />
            <Text
              style={[style.textStyle, { marginLeft: wp(2), fontWeight: '700', marginTop: hp(1) }]}
            >
              PAYMENT MODE
            </Text>
            <Text style={[style.valueStyle, { marginLeft: wp(2) }]}>
              {PaymentMode[currentPaymentIndex]?.name}
            </Text>
            <View style={{ height: hp(0.05), marginTop: hp(1), backgroundColor: 'gray' }} />
            <Text
              style={[style.textStyle, { marginLeft: wp(2), fontWeight: '700', marginTop: hp(1) }]}
            >
              TOTAL ITEMS
            </Text>
            <Text style={[style.valueStyle, { marginLeft: wp(2) }]}>
              {sumTotalQty(cartDetails)}
            </Text>
            <View style={{ height: hp(0.05), marginTop: hp(1), backgroundColor: 'gray' }} />
            <Text
              style={[style.textStyle, { marginLeft: wp(2), fontWeight: '700', marginTop: hp(1) }]}
            >
              TOTAL BILL AMOUNT
            </Text>
            <Text style={[style.valueStyle, { marginLeft: wp(2) }]}>
              {sumTotalPrice(cartDetails)}
            </Text>
            <View style={{ height: hp(0.05), marginTop: hp(1), backgroundColor: 'gray' }} />

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={async () => {
                // await setOrderPreview(false)
                // dispatch(plac)
                let obj = {
                  inputAddressId: addressDetails[currentAddressIndex]._id,
                  inputPaymentMode: PaymentMode[currentPaymentIndex].name,
                  inputStoreId: cartDetails[0].storeId,
                };
                setOrderPreview(false);
                dispatch(placeUserOrder(obj)).then((res) => {
                  if (res) {
                    if (PaymentMode[currentPaymentIndex].id === 1) {
                      if (
                        typeof res?.razorPayId !== 'undefined' &&
                        typeof res?.orderId !== 'undefined'
                      ) {
                        let updateOrderObj = {
                          inputOrderId: res?.orderId,
                          inputStoreId: cartDetails[0].storeId,
                          inputPaymentStatus: false,
                        };
                        const razorPayConfig = {
                          description: 'You are paying to Marothia Textile',
                          image: 'https://i.imgur.com/3g7nmJC.png',
                          currency: 'INR',
                          key: RAZOR_PAY_KEY,
                          amount: '100',
                          name: userDetail?.firstName + ' ' + userDetail?.lastName,
                          order_id: res?.razorPayId,
                          prefill: {
                            email: userDetail?.email,
                            contact: userDetail?.phoneNumber,
                            name: userDetail?.firstName + ' ' + userDetail?.lastName,
                          },
                          theme: { color: color.themeBtnColor },
                        };
                        RazorpayCheckout.open(razorPayConfig)
                          .then((data) => {
                            console.log('payment response', data);
                            updateOrderObj = {
                              ...updateOrderObj,
                              inputPaymentStatus: true,
                            };
                            dispatch(updatePlaceOrderStatusForPaymentForCart(updateOrderObj)).then(
                              (res) => {
                                if (res) {
                                  dispatch(removeItemFromCart(data?.inputProductId)).then((res) => {
                                    Alert.alert(
                                      '',
                                      'Your order is added...Thanks for shopping and keep shoping' +
                                        ' ',
                                      [
                                        {
                                          text: 'OK',
                                          onPress: () => {
                                            props.navigation.dispatch(
                                              CommonActions.reset({
                                                routes: [{ name: 'Dashboard' }],
                                              })
                                            );
                                          },
                                        },
                                      ]
                                    );
                                    dispatch(getCartItems()).then((res) => {});
                                  });
                                }
                              }
                            );
                          })
                          .catch((error) => {
                            // handle failure
                            alert(`Error: ${error.code} | ${error.description}`);
                            updateOrderObj = {
                              ...updateOrderObj,
                              inputPaymentStatus: false,
                            };
                            dispatch(
                              updatePlaceOrderStatusForPaymentForCart(updateOrderObj)
                            ).then((res) => {});
                          });
                      } else {
                        alert('Fail to start payment');
                      }
                    } else {
                      Alert.alert(
                        '',
                        'Your order is added...Thanks for shopping and keep shoping' + ' ',
                        [
                          {
                            text: 'OK',
                            onPress: () => {
                              props.navigation.dispatch(
                                CommonActions.reset({
                                  routes: [{ name: 'Dashboard' }],
                                })
                              );
                            },
                          },
                        ]
                      );
                      dispatch(getCartItems()).then((res) => {});
                    }
                    // dispatch(getCartItems()).then((res) => {});
                    // Alert.alert(
                    //   '',
                    //   'Your order is added...Thanks for shopping and keep shoping' + ' ',
                    //   [
                    //     {
                    //       text: 'OK',
                    //       onPress: () => {
                    //         props.navigation.dispatch(
                    //           CommonActions.reset({
                    //             routes: [{ name: 'Dashboard' }],
                    //           })
                    //         );
                    //       },
                    //     },
                    //   ]
                    // );
                  } else {
                    alert('fail to place your order..please try again...');
                  }
                });
              }}
            >
              <View
                style={{
                  height: hp(5),
                  backgroundColor: color.themeBtnColor,
                  width: (IsAndroidOS || IsIOSOS)?wp(70):wp(45),
                  marginTop: hp(1),
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: normalize(18), color: color.white, fontWeight: '700' }}>
                  VERIFIED & PLACE MY ORDER
                </Text>
              </View>

              <ActivityIndicator size={'large'} color={color.themeBtnColor} animating={isLoading} />
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
      )}

      {addnewAddressFlag && (
        <Modal
          onRequestClose={() => setNewAddressFlag(false)}
          animated={true}
          transparent={false}
          visible={true}
        >
          <GradientBackground>
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: hp(1) }}>
              <KeyboardAwareScrollView
                style={{ justifySelf: 'center' }}
                contentContainerStyle={{ zIndex: 1 }}
                keyboardShouldPersistTaps="handled"
                behavior={'position'}
                enabled
              >
                <Text
                  style={{
                    paddingRight: wp(2),
                    alignSelf: 'flex-end',
                    fontWeight: '700',
                    color: color.themeBtnColor,
                    fontSize: normalize(16),
                  }}
                  onPress={() => {
                    setNewAddressFlag(false);
                  }}
                >
                  CANCEL
                </Text>
                <Text style={[style.textStyle, { textAlign: 'center', fontWeight: '700' }]}>
                  FILL FOLLOWING
                </Text>
                <View style={[style.groupView, { marginTop: hp(3) }]}>
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
                      addressDetail.street,
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
                      addressDetail.landmark,
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
                    {renderNameFloatingTextInput('STATE', addressDetail.state, 'state', true)}
                    {renderNameFloatingTextInput('CITY', addressDetail.city, 'city', true)}
                    {renderNameFloatingTextInput(
                      'PIN CODE',
                      addressDetail.pincode,
                      'pincode',
                      true
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    addNewAddressToDb();
                  }}
                >
                  <View
                    style={{
                      ...style.center,
                      alignSelf: 'center',
                      width: wp(80),
                      height: hp(5),
                      marginTop: hp(2),
                      backgroundColor: color.themeBtnColor,
                    }}
                  >
                    <Text
                      style={{ fontWeight: '900', fontSize: normalize(16), color: color.white }}
                    >
                      ADD
                    </Text>
                  </View>
                </TouchableOpacity>
              </KeyboardAwareScrollView>
            </SafeAreaView>
          </GradientBackground>
        </Modal>
      )}
    </View>
  );
};
const style = StyleSheet.create({
  textStyle: {
    fontSize: normalize(11),
  },
  listBtnStyle: {
    width:(IsAndroidOS || IsIOSOS)?wp(20): wp(10),
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(1),
  },
  listBtnTextStyle: {
    fontSize: normalize(10),
    fontWeight: '700',
    color: 'white',
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
  dividerView: {
    width: wp(45),
    marginTop: hp(1),
    height: hp(0.06),
    backgroundColor: '#d5d5d5',
  },
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
  mainView: {
    flex: 1,
    marginTop: hp(2),
    marginLeft: wp(3),
    flexDirection: 'column',
    // alignItems: 'center',
    backgroundColor: '#fafafa',
    borderRadius: hp(2),
    paddingTop: hp(1),
    paddingLeft: wp(2),
    paddingRight: wp(2),
    paddingBottom: hp(1),
  },
});
export default PlaceOrderScreen;
