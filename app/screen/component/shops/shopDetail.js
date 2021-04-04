import React, { useState, useEffect } from 'react';
// import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {
  color,
  font,
  hp,
  isANDROID,
  isIOS,
  normalize,
  screenWidth,
  wp,
} from '../../../helper/themeHelper';
import _ from 'lodash';
import {
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  Text,
  Image,
  Linking,
  Animated,
  BackHandler,
  Modal,
  Alert,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {
  AnimatedTitle,
  AppButton,
  CustomText,
  FloatingLabel,
  ImagePreview,
  InitialHeader,
  LabelInputText,
  Loading,
  PaymentTypeCheckBox,
} from '../../common/';
import moment from 'moment';
const defaultUserMaleImage = require('../../../assets/images/user_male.png');
const defaultUserFemaleImage = require('../../../assets/images/user_female.png');
import { useSafeArea } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getShopList, updateStoreStatus } from '../../../redux/actions/storeAction';
import { brand_icon, owner_icon, shop_icon } from '../../../assets/images';
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
const defaultInputData = {
  remark: '',
};

const ShopDetail = (props) => {
  const dispatch = useDispatch();
  const insets = useSafeArea();
  const { data } = props.route.params;
  const [fullScreenImage, setFullScreenImage] = useState(false);
  const isLoading = useSelector((state) => state.appDefaultSettingReducer.isLoading);
  const [checkBoxArr, setCheckboxArr] = useState([]);
  console.log('data--', data);
  const [currentDocImage, setCurrentDocImage] = useState(data?.document?.panCard);
  const [currentImageArray, setCurrentImageArray] = useState([]);
  const [scrollY] = useState(new Animated.Value(5));
  const [dividerView, setDividerView] = useState(false);
  const [imagePreviewFlag, setImagePreviewFlag] = useState(false);
  const [headerDetailHeight, SetHeaderDetailHeight] = useState(hp(0));
  const [addRemarkModel, setAddRemarkModel] = useState(false);
  const [inputData, setInputData] = useState({ ...defaultInputData });
  const handleBackPress = () => {
    props.navigation.goBack();
    return true;
  };
  const closeImagePreview = () => {
    setImagePreviewFlag(false);
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
              setInputData({ ...inputData, [key]: isIOS ? text.toUpperCase() : text });
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
              setInputData({ ...inputData, [key]: isIOS ? text.toUpperCase() : text });
            }}
          />
        )}
      </View>
    );
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    let tempArray = [];
    if (data?.paymentMode?.items?.length > 0) {
      data?.paymentMode?.items.map((item) => {
        tempArray.push(parseInt(item?.mode));
      });
      setCheckboxArr([...tempArray]);
    }
    return () => BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
  }, []);
  const updateStoreStatusToDb = (inputStatus, message = null) => {
    let obj = {
      inputStoreId: data?._id,
      inputStatus: inputStatus,
      inputRemark: message,
    };
    dispatch(updateStoreStatus(obj)).then(async (res) => {
      if (res) {
        await dispatch(getShopList()).then((res) => {});
        Alert.alert('', 'Store status is updated succefully!' + ' ', [
          {
            text: 'OK',
            onPress: () => {
              props.navigation.goBack();
            },
          },
        ]);
      }
    });
  };
  const renderHeader = () => {
    return (
      <View style={style.headerMain}>
        <InitialHeader
          isAnimated={true}
          cancelButton={true}
          canViewFullScreenImage={true}
          isButton={true}
          userGender={'male'}
          isUrl={true}
          cancelPress={() => props.navigation.goBack()}
          imgPath={{ uri: data?.storeImage }}
          scrollY={scrollY}
        />
        <AnimatedTitle scrollY={scrollY}>
          <View
            style={[
              style.nameView,
              {
                backgroundColor: color.creamDarkGray,
              },
            ]}
            onLayout={(event) => {
              SetHeaderDetailHeight(event.nativeEvent.layout.height);
            }}
          >
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: hp(1),
                  height: hp(5),
                  borderRadius: wp(5),
                  width: wp(20),
                  backgroundColor: data?.isApproved ? 'green' : 'red',
                }}
              >
                <Text style={{ fontSize: normalize(14), fontWeight: '700' }}>
                  {data?.isApproved ? 'APPROVED' : 'PENDING'}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <View style={[style.mainRowView, { flex: 1, alignItems: 'center' }]}>
                <Image source={shop_icon} style={[style.iconStyle]} />
                <CustomText style={style.subfontStyle}>{data?.companyName}</CustomText>
              </View>
              <View style={[style.mainRowView, { flex: 1, alignItems: 'center' }]}>
                <Image source={owner_icon} style={[style.iconStyle]} />
                <CustomText style={style.subfontStyle}>{data?.contactName}</CustomText>
              </View>
              <View style={[style.mainRowView, { flex: 1, alignItems: 'center' }]}>
                <Image source={brand_icon} style={[style.iconStyle]} />
                <CustomText style={style.subfontStyle}>{data?.brandName}</CustomText>
              </View>

            </View>
          </View>
          <View
              style={[
                style.nameView,
                {
                  backgroundColor: color.creamDarkGray,
                },
              ]}
              onLayout={(event) => {
                SetHeaderDetailHeight(event.nativeEvent.layout.height);
              }}
          >

            <View style={{ flexDirection: 'row' }}>
              <View style={[style.mainRowView, { flex: 1, alignItems: 'center' }]}>
                <Image
                    source={require('../../../assets/images/mail.png')}
                    style={[style.iconStyle]}
                />
                <CustomText numberOfLines={1} style={[style.subfontStyle, { width: wp(40) }]}>
                  {data?.companyEmail}
                </CustomText>
              </View>
              <View style={[style.mainRowView, { flex: 1, alignItems: 'center' }]}>
                <Image
                    source={require('../../../assets/images/phone.png')}
                    style={[style.iconStyle]}
                />
                <CustomText style={style.subfontStyle}>{data?.contactNumber}</CustomText>
              </View>
            </View>
          </View>
          {/*{dividerView && data.MaritalStatus !== MARITAL_STATUS.single && (*/}
          {/*    <View style={{height: hp(0.3), width: wp(100), backgroundColor: color.white}} />*/}
          {/*)}*/}
        </AnimatedTitle>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: color.white, marginTop: hp(-1) }}
      forceInset={{ top: 'never', bottom: 'always' }}
    >
      {fullScreenImage && (
        <Modal
          visible={'true'}
          transparent={'true'}
          style={{ flex: 1, bottom: 0 }}
          onRequestClose={() => setFullScreenImage(false)}
        >
          <View
            styel={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
              height: hp(100),
              width: wp(100),
            }}
          >
            <Image
              style={{ height: hp(50), width: wp(80), borderRadius: hp(2) }}
              source={{ uri: currentDocImage }}
            />
          </View>
        </Modal>
      )}
      {isLoading && <Loading isLoading={isLoading} />}
      {imagePreviewFlag && (
        <ImagePreview imgArray={[currentImageArray]} setPreviewClose={closeImagePreview} />
      )}
      {addRemarkModel && (
        <Modal
          onRequestClose={() => setAddRemarkModel(false)}
          animated={false}
          transparent={true}
          visible={true}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(36,36,36,0.96)' }}>
            <TouchableWithoutFeedback
              onPress={() => {
                setAddRemarkModel(false);
              }}
            >
              <Text
                style={{
                  color: color.white,
                  paddingRight: wp(5),
                  fontSize: normalize(16),
                  fontWeight: 'bold',
                  alignSelf: 'flex-end',
                  marginTop: hp(5),
                }}
              >
                cancel
              </Text>
            </TouchableWithoutFeedback>
            <LabelInputText
              multiline={true}
              numberOfLines={4}
              inputStyle={[style.floatingInputStyle, { color: color.white }]}
              style={[style.floatingStyle]}
              label={'  '}
              editable={true}
              value={inputData.remark}
              keyboardType={'default'}
              returnKeyType={'done'}
              autoCapitalize="characters"
              extraLabel={true}
              onChangeText={(text) => {
                setInputData({ ...inputData, remark: isIOS ? text.toUpperCase() : text });
              }}
            />
            <AppButton
              onPress={() => {
                if (
                  inputData.remark === '' ||
                  inputData.remark === null ||
                  inputData.remark.length === 0
                ) {
                  alert('please add valid remark note for rejection...');
                  return;
                } else {
                  setAddRemarkModel(false);
                  updateStoreStatusToDb(false, inputData?.remark);
                }
              }}
              title={'ADD REMARK & REJECT'}
              containerStyle={{ marginTop: hp(2), backgroundColor: color.red }}
            />
          </View>
        </Modal>
      )}

      {renderHeader()}
      <Animated.ScrollView
        overScrollMode={'never'}
        bounces={false}
        style={{ flex: 9, zIndex: 0 }}
        scrollEventThrottle={16}
        onScrollBeginDrag={({ nativeEvent }) => {
          if (nativeEvent.contentOffset.y > 0) {
            setDividerView(true);
          } else {
            setDividerView(false);
          }
        }}
        onScrollEndDrag={({ nativeEvent }) => {
          if (nativeEvent.contentOffset.y > 0) {
            setDividerView(true);
          } else {
            setDividerView(false);
          }
        }}
        onScroll={Animated.event([
          {
            nativeEvent: { contentOffset: { y: scrollY } },
          },
        ])}
      >
        <View
          style={{
            flex: 1,
            marginTop: dividerView
              ? headerDetailHeight + insets.top + hp(30.5)
              : headerDetailHeight + insets.top + hp(30.5),
          }}
        >
          <View style={{ flex: 1 }}>
            <View style={{ marginTop: hp(2), marginLeft: wp(3) }}>
              <CustomText style={{ color: color.red, fontSize: normalize(15) }}>
                {'DOCUMENT IMAGES' + ' '}
              </CustomText>
            </View>
            <View style={style.subMainRowView}>
              <View style={{ flex: 1 }}>
                <View>
                  <CustomText style={style.subMainRowFontStyle}>{'PAN CARD' + ' '}</CustomText>

                  <View>
                    <TouchableWithoutFeedback
                      onPress={async () => {
                        await setCurrentImageArray(data.document.panCard);
                        setImagePreviewFlag(true);
                      }}
                    >
                      <Image
                        source={{ uri: data?.document?.panCard }}
                        style={style.docImageStyle}
                        resizeMode={'contain'}
                      />
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              </View>
            </View>

            <View style={style.subMainRowView}>
              <View style={{ flex: 1 }}>
                <View>
                  <CustomText style={style.subMainRowFontStyle}>{'GST CARD' + ' '}</CustomText>

                  <View>
                    <TouchableWithoutFeedback
                      onPress={async () => {
                        await setCurrentImageArray(data.document.gstCard);
                        setImagePreviewFlag(true);
                      }}
                    >
                      <Image
                        source={{ uri: data?.document?.gstCard }}
                        style={style.docImageStyle}
                        resizeMode={'contain'}
                      />
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              </View>
            </View>

            <View style={style.subMainRowView}>
              <View style={{ flex: 1 }}>
                <View>
                  <CustomText style={style.subMainRowFontStyle}>{'CANCEL CHEQUE' + ' '}</CustomText>

                  <View>
                    <TouchableWithoutFeedback
                      onPress={async () => {
                        await setCurrentImageArray(data.document.cancelCheck);
                        setImagePreviewFlag(true);
                      }}
                    >
                      <Image
                        source={{ uri: data?.document?.cancelCheck }}
                        style={style.docImageStyle}
                        resizeMode={'contain'}
                      />
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ marginTop: hp(2), marginLeft: wp(3) }}>
              <CustomText style={{ color: color.red, fontSize: normalize(15) }}>
                {'ADDRESS DETAILS' + ' '}
              </CustomText>
            </View>
            <View style={style.subMainRowView}>
              <View style={{ flex: 1 }}>
                <View>
                  <CustomText style={style.subMainRowFontStyle}>{'STREET' + ' '}</CustomText>

                  <View>
                    <CustomText style={[style.subMainRowDetailFont]}>
                      {data?.address?.street}
                    </CustomText>
                  </View>
                </View>
              </View>
            </View>
            <View style={style.subMainRowView}>
              <View style={{ flex: 1 }}>
                <View>
                  <CustomText style={style.subMainRowFontStyle}>{'LANDMARK' + ' '}</CustomText>

                  <View>
                    <CustomText style={[style.subMainRowDetailFont]}>
                      {data?.address?.landmark}
                    </CustomText>
                  </View>
                </View>
              </View>
            </View>
            <View style={[style.subMainRowView]}>
              <View style={style.topDetail}>
                <View style={style.centerDetail}>
                  <CustomText style={style.subMainRowFontStyle}>{'CITY'}</CustomText>
                  <CustomText style={style.subMainRowDetailFont}>{data?.address?.city}</CustomText>
                </View>
              </View>
              <View style={[style.topDetail]}>
                <View style={style.centerDetail}>
                  <CustomText style={style.subMainRowFontStyle}>{'STATE'}</CustomText>
                  <CustomText style={[style.subMainRowDetailFont, { textAlign: 'center' }]}>
                    {data?.address?.state}
                  </CustomText>
                </View>
              </View>
              <View style={[style.topDetail, { marginLeft: wp(1.5) }]}>
                <View style={style.centerDetail}>
                  <CustomText style={[style.subMainRowFontStyle]}>COUNTRY</CustomText>
                  <CustomText style={[style.subMainRowDetailFont]}>{'INDIA'}</CustomText>
                </View>
              </View>
            </View>
          </View>
          <View style={style.subMainRowView}>
            <View style={{ flex: 1 }}>
              <View>
                <CustomText style={style.subMainRowFontStyle}>{'PINCODE' + ' '}</CustomText>
              </View>

              <View>
                <CustomText style={style.subMainRowDetailFont}>{data?.address?.pincode}</CustomText>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View>
                <CustomText style={style.subMainRowFontStyle}>{'MOBILE' + ' '}</CustomText>
              </View>

              <View>
                <CustomText style={style.subMainRowDetailFont}>
                  {data?.alternatePhoneNumber}
                </CustomText>
              </View>
            </View>
          </View>

          <View style={{ marginTop: hp(2), marginLeft: wp(3) }}>
            <CustomText style={{ color: color.red, fontSize: normalize(15) }}>
              {'BANK DETAILS' + ' '}
            </CustomText>
          </View>
          <View style={style.subMainRowView}>
            <View style={{ flex: 1 }}>
              <View>
                <CustomText style={style.subMainRowFontStyle}>{'BANK NAME' + ' '}</CustomText>

                <View>
                  <CustomText style={[style.subMainRowDetailFont]}>
                    {data?.bankDetail?.bankName}
                  </CustomText>
                </View>
              </View>
            </View>
          </View>
          <View style={style.subMainRowView}>
            <View style={{ flex: 1 }}>
              <View>
                <CustomText style={style.subMainRowFontStyle}>
                  {'BANK ACCOUNT NUMBER' + ' '}
                </CustomText>

                <View>
                  <CustomText style={[style.subMainRowDetailFont]}>
                    {data?.bankDetail?.accountNumber}
                  </CustomText>
                </View>
              </View>
            </View>
          </View>

          <View style={style.subMainRowView}>
            <View style={{ flex: 1 }}>
              <View>
                <CustomText style={style.subMainRowFontStyle}>
                  {'BANK ACCOUNT NAME' + ' '}
                </CustomText>

                <View>
                  <CustomText style={[style.subMainRowDetailFont]}>
                    {data?.bankDetail?.accountName}
                  </CustomText>
                </View>
              </View>
            </View>
          </View>
          <View style={style.subMainRowView}>
            <View style={{ flex: 1 }}>
              <View>
                <CustomText style={style.subMainRowFontStyle}>
                  {'BANK IFSC NUMBER' + ' '}
                </CustomText>

                <View>
                  <CustomText style={[style.subMainRowDetailFont]}>
                    {data?.bankDetail?.ifscCode}
                  </CustomText>
                </View>
              </View>
            </View>
          </View>
          <View style={{ marginTop: hp(2), marginLeft: wp(3) }}>
            <CustomText style={{ color: color.red, fontSize: normalize(15) }}>
              {'OTHER DETAILS' + ' '}
            </CustomText>
          </View>
          <View style={style.subMainRowView}>
            <View style={{ flex: 1 }}>
              <View>
                <CustomText style={style.subMainRowFontStyle}>{'PAN CARD NUMBER' + ' '}</CustomText>

                <View>
                  <CustomText style={[style.subMainRowDetailFont]}>{data?.panNumber}</CustomText>
                </View>
              </View>
            </View>
          </View>
          <View style={style.subMainRowView}>
            <View style={{ flex: 1 }}>
              <View>
                <CustomText style={style.subMainRowFontStyle}>{'PAN NAME' + ' '}</CustomText>

                <View>
                  <CustomText style={[style.subMainRowDetailFont]}>{data?.panCardName}</CustomText>
                </View>
              </View>
            </View>
          </View>
          <View style={style.subMainRowView}>
            <View style={{ flex: 1 }}>
              <View>
                <CustomText style={style.subMainRowFontStyle}>{'GST NUMBER' + ' '}</CustomText>

                <View>
                  <CustomText style={[style.subMainRowDetailFont]}>{data?.gstNumber}</CustomText>
                </View>
              </View>
            </View>
          </View>
          <View style={style.subMainRowView}>
            <View style={{ flex: 1 }}>
              <View>
                <CustomText style={style.subMainRowFontStyle}>{'PAYMENT MODES' + ' '}</CustomText>

                <View>
                  <PaymentTypeCheckBox
                    disable={true}
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
              </View>
            </View>
          </View>

          {data?.upi && (
            <View style={style.subMainRowView}>
              <View style={{ flex: 1 }}>
                <View>
                  <CustomText style={style.subMainRowFontStyle}>
                    {'BUSINESS UPI ID' + ' '}
                  </CustomText>

                  <View>
                    <CustomText style={[style.subMainRowDetailFont]}>{data?.upi}</CustomText>
                  </View>
                </View>
              </View>
            </View>
          )}

          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <AppButton
              onPress={() => {
                setAddRemarkModel(true);
              }}
              title={'REJECT'}
              containerStyle={{ marginTop: hp(2), width: wp(20), backgroundColor: color.red }}
            />
            <AppButton
              onPress={() => {
                updateStoreStatusToDb(true);
              }}
              title={'ACCEPT'}
              containerStyle={{
                marginTop: hp(2),
                width: wp(20),
                marginLeft: wp(5),
                backgroundColor: color.green,
              }}
            />
          </View>
        </View>
      </Animated.ScrollView>
      <View style={{ height: hp(1) }} />
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  fontStyle: {
    color: color.blue,
    fontSize: normalize(12),
    fontFamily: font.robotoRegular,
    textAlign: 'center',
    marginLeft: wp(1),
    fontWeight: 'bold',
  },
  subfontStyle: {
    fontSize: normalize(10),
    fontFamily: font.robotoRegular,
    textAlign: 'left',
    marginLeft: wp(1),
  },
  nameView: {
    alignItems: 'center',
    backgroundColor: color.creamDarkGray,
    marginHorizontal: wp(3),
    marginBottom: hp(1),
    borderRadius: 5,
  },
  iconStyle: {
    width: wp(2),
    height: wp(2),
    marginLeft: wp(1),
  },
  mainRowView: {
    flexDirection: 'row',
    marginTop: hp(2),
    marginLeft: wp(2),
  },
  detailFontStyle: {
    fontSize: normalize(10),
    fontFamily: font.robotoRegular,
    marginLeft: wp(1),
  },
  subMainRowView: {
    flex: 1,
    // backgroundColor: 'red',
    backgroundColor: color.creamGray,
    marginHorizontal: wp(3),
    marginTop: hp(1),
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
  },
  subMainRowFontStyle: {
    color: color.blue,
    fontSize: normalize(10),
    fontFamily: font.robotoRegular,
    // marginLeft: wp(4),
    // marginTop: hp(1),
  },
  subMainRowDetailFont: {
    fontSize: normalize(10),
    fontFamily: font.robotoRegular,
    // marginLeft: wp(4),
    marginTop: hp(0.7),
  },
  topDetail: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerDetail: {
    flex: 0,
    alignItems: 'center',
  },
  headerMain: {
    zIndex: 100,
    width: wp(100),
    position: 'absolute',
    backgroundColor: color.creamDarkGray,
    borderBottomWidth: 20,
    borderBottomColor: '#fff',
  },
  docImageStyle: {
    height: hp(25),
    width: wp(60),
    alignSelf: 'center',
    borderRadius: hp(1),
  },
});
export default ShopDetail;
