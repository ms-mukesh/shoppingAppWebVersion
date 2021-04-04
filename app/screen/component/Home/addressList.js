import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Alert,
  Image,
} from 'react-native';
import {
  AppHeader,
  FloatingLabel,
  GradientBackground,
  LabelInputText,
  Loading,
} from '../../common/';
import { useDispatch, useSelector } from 'react-redux';
import { addNewAddress, getMyAddresses, removeAddress } from '../../../redux/actions/userActions';
import { color, hp, isANDROID, isIOS, normalize, wp } from '../../../helper/themeHelper';
import SafeAreaView from 'react-native-safe-area-view';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { plus_icon } from '../../../assets/images';
import { checkNamesIsEmpty } from '../../../helper/validation';

const AddressListScreen = (props) => {
  const isLoading = useSelector((state) => state.appDefaultSettingReducer.isLoading);
  const addressDetails = useSelector((state) => state.user.userAddress);
  const cartDetails = useSelector((state) => state.productReducer.myCart);
  const [addressDetail, setAddressDetail] = useState({
    street: '',
    landMark: '',
    city: '',
    state: '',
    pincode: '',
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMyAddresses()).then((res) => {
      if (res) {
        console.log('address-', addressDetails);
      }
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
            style={[style.floatingStyle, { width: wp(30) }]}
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
            style={[style.floatingStyle, { width: wp(30) }]}
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
  const removeAddressFromDb = (addressId) => {
    Alert.alert('', 'Are You sure To Remove this Address?' + ' ', [
      {
        text: 'YES',
        onPress: () => {
          dispatch(removeAddress({ inputAddressId: addressId })).then((res) => {
            console.log('remove address---', res);
            dispatch(getMyAddresses()).then((res) => {
              console.log('res--', res);
            });
          });
        },
      },
      {
        text: 'NO',
        onPress: () => {},
      },
    ]);
  };

  const _RenderUserAddress = (item, index) => {
    return (
      <View>
        <View style={{ padding: hp(1), flexDirection: 'row' }}>
          <View style={{ flex: 4 }}>
            <Text style={[style.textStyle, { fontWeight: '700' }]}>{item?.street}</Text>
            <Text style={[style.textStyle, { fontWeight: '700' }]}>{item?.landmark}</Text>
            <Text style={style.textStyle}>{item?.city + ',' + item?.state}</Text>
            <Text style={style.textStyle}>{item?.pincode}</Text>
          </View>

          {index === currentAddressIndex && (
            <Text
              onPress={() => {
                removeAddressFromDb(item?._id);
              }}
              style={{
                alignSelf: 'center',
                color: 'red',
                fontWeight: '700',
                fontSize: normalize(13),
              }}
            >
              REMOVE
            </Text>
          )}
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
  const [currentAddressIndex, setCurrentAddressIndex] = useState(0);
  const [addnewAddressFlag, setNewAddressFlag] = useState(false);
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
          setAddressDetail({
            ...addressDetail,
            inputStreet: addressDetail.street,
            inputCity: '',
            inputState: '',
            inputPincode: '',
            inputLandmark: '',
          });
          dispatch(getMyAddresses()).then((res) => {});
        }
      });
    }
  };
  return (
    <GradientBackground>
      {isLoading && <Loading isLoading={isLoading} />}
      <AppHeader
        cartItemCount={cartDetails.length}
        onCartIconPress={() => {
          props.navigation.navigate('CartDetail');
        }}
        title={'My Address List'}
        onMenuPress={() => props.navigation.openDrawer()}
      />
      <TouchableOpacity
        onPress={() => {
          setNewAddressFlag(true);
        }}
      >
        <Image
          source={plus_icon}
          style={{ height: hp(3), width: hp(3), alignSelf: 'flex-end', marginRight: wp(5) }}
        />
      </TouchableOpacity>
      <FlatList
        data={addressDetails}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => _RenderUserAddress(item, index)}
        horizontal={false}
        bounces={isANDROID ? false : true}
      />
      {addnewAddressFlag && (
        <Modal
          onRequestClose={() => setNewAddressFlag(false)}
          animated={true}
          transparent={false}
          visible={true}
        >
          <GradientBackground>
            <SafeAreaView style={{ flex: 1, width:wp(60),justifyContent: 'center', padding: hp(1) }}>
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
                  onPress={() => {
                    addNewAddressToDb();
                  }}
                >
                  <View
                    style={{
                      alignItems:'center',
                      justifyContent:'center',
                      alignSelf: 'center',
                      width: wp(20),
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
    </GradientBackground>
  );
};
const style = StyleSheet.create({
  textStyle: {
    fontSize: normalize(10),
    color: color.themeBtnColor,
  },
  listBtnStyle: {
    width: wp(25),
    height: hp(3.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(1),
  },
  listBtnTextStyle: {
    fontSize: normalize(14),
    fontWeight: '700',
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
});

export default AddressListScreen;
