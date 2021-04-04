import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Linking,
  StyleSheet,
  BackHandler,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { AppHeader, GoBackHeader, GradientBackground, Loading } from '../../common';
import { useDispatch, useSelector } from 'react-redux';
import { getShopList } from '../../../redux/actions/storeAction';
import { SwipeListView } from 'react-native-swipe-list-view';
import {isANDROID, IsAndroidOS, IsIOSOS} from '../../../helper/themeHelper';
import { wp, hp, normalize, color } from '../../../helper/themeHelper';
import moment from 'moment';
import { shadowStyle } from '../../../helper/styles';
import DefaultMaleIcon from '../../../assets/images/user_male.png';
import { autoCapitalString } from '../../../helper/validation';
import {
  brand_icon,
  city_icon,
  location_pin_icon,
  owner_icon,
  shop_icon,
  state_icon,
} from '../../../assets/images';
import {FlatList} from "react-native-web";

const PendingShopsScreen = (props) => {
  const dispatch = useDispatch();
  console.log(props);
  const { fromPopUp = false } = props?.route?.params;
  const isLoading = useSelector((state) => state.appDefaultSettingReducer.isLoading);
  const shopList = useSelector((state) => state.shopReducer.shopList);
  const [currentMemberId, setCurrentMemberId] = useState({ currentMember: 0 });
  const flatlistRef = useRef(null);
  const [refreshPage, setRefreshPage] = useState(false);
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
  let tempCurrent = 0;

  let openRowRef = null;
  useEffect(() => {
    dispatch(getShopList()).then((res) => {});
  }, []);
  const _RenderItem = (item, index) => {
    let date = item.DOB;
    const dob = moment(date).format('Do MMM YYYY');
    return (
      <View style={{ flex: 1, marginBottom: hp(1) }}>
        <TouchableWithoutFeedback
          onPress={() => {
            displayDetailPage(index);
          }}
        >
          <View style={[style.mainView,{width:(IsIOSOS || IsAndroidOS)?wp(90):wp(40)}]}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                {/*{typeof item.ProfileImage === 'undefined' ||*/}
                {/*item.ProfileImage === '-' ||*/}
                {/*item.ProfileImage === null ||*/}
                {/*item.ProfileImage === '' ? (*/}
                {/*    <TouchableWithoutFeedback onPress={() => displayImageInFullScreen()}>*/}
                {/*        <Image style={{height: wp(20), width: wp(20), borderRadius: wp(10)}} source={DefaultMaleIcon} />*/}
                {/*    </TouchableWithoutFeedback>*/}
                {/*) : (*/}
                {/*    <TouchableWithoutFeedback*/}
                {/*        onPress={() => {*/}
                {/*            displayImageInFullScreen(item.ProfileImage);*/}
                {/*        }}>*/}
                {/*        <Image*/}
                {/*            style={{height: wp(20), width: wp(20), borderRadius: wp(10)}}*/}
                {/*            resizeMode={'cover'}*/}
                {/*            onLoad={e => {}}*/}
                {/*            source={{*/}
                {/*                uri: item.ProfileImage,*/}
                {/*                // headers: {Authorization: '9876543210'},*/}
                {/*                // priority: FastImage.priority.normal,*/}
                {/*                // cache: FastImage.cacheControl.immutable,*/}
                {/*                //cache: FastImage.cacheControl.web,*/}
                {/*                //cache: FastImage.cacheControl.cacheOnly,*/}
                {/*            }}*/}
                {/*        />*/}
                {/*    </TouchableWithoutFeedback>*/}
                {/*)}*/}
              </View>
              <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row' }}>
                  <Image source={shop_icon} style={style.iconStyle} />
                  <Text
                    numberOfLines={1}
                    allowFontScaling={false}
                    style={[style.fontStyle, { width: wp(80) }]}
                  >
                    {item?.companyName}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Image source={owner_icon} style={style.iconStyle} />
                    <Text
                      numberOfLines={1}
                      allowFontScaling={false}
                      style={[style.fontStyle, { width: wp(50) }]}
                    >
                      {item?.contactName}
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: hp(5),
                      width: wp(10),
                      borderRadius: hp(1.5),
                      backgroundColor: item?.isApproved ? 'green' : 'red',
                    }}
                  >
                    <Text style={{ fontSize: normalize(10), fontWeight: '900',color:color.white }}>
                      {item?.isApproved ? 'APPROVED' : 'PENDING'}
                    </Text>
                  </View>
                </View>

                {item?.companyEmail !== '' &&
                  item?.companyEmail !== '-' &&
                  item?.companyEmail !== null &&
                  typeof item?.companyEmail !== 'undefined' && (
                    <View style={[style.common, { marginLeft: wp(2), marginTop: hp(0.8) }]}>
                      <Image
                        source={require('../../../assets/images/mail.png')}
                        style={style.iconStyle}
                      />
                      <Text
                        allowFontScaling={false}
                        style={[
                          style.subText,
                          {
                            marginLeft: wp(1),
                            flex: 1,
                            textDecorationLine: 'underline',
                            color: color.blue,
                            textDecorationColor: color.blue,
                          },
                        ]}
                        onPress={() => {
                          Linking.openURL(`mailto:${item?.companyEmail}`)
                            .then((res) => {})
                            .catch((err) => {
                              alert('Failed');
                            });
                        }}
                      >
                        {item?.companyEmail.toLowerCase()}
                      </Text>
                    </View>
                  )}

                <View style={[style.common, { marginLeft: wp(2), marginTop: hp(0.8) }]}>
                  <View style={[style.common, { flex: 1 }]}>
                    <Image
                      source={require('../../../assets/images/phone.png')}
                      style={style.iconStyle}
                    />
                    <Text
                      allowFontScaling={false}
                      onPress={() => {
                        Linking.openURL(`tel:${item?.contactNumber}`)
                          .then((res) => {})
                          .catch((err) => {
                            alert('Failed');
                          });
                      }}
                      style={[
                        style.subText,
                        {
                          marginLeft: wp(1),
                          textDecorationLine: 'underline',
                          color: color.blue,
                          textDecorationColor: color.blue,
                        },
                      ]}
                    >
                      {item?.contactNumber}
                    </Text>
                  </View>

                  <View style={[style.birthdayView, { flex: 1 }]}>
                    <Image source={brand_icon} style={style.iconStyle} />
                    <Text allowFontScaling={false} style={{ ...style.subText, marginLeft: wp(1) }}>
                      {item?.brandName}
                    </Text>
                  </View>
                </View>

                <View style={[style.common, { marginLeft: wp(2), marginTop: hp(0.8) }]}>
                  <View style={[style.common, { flex: 2 }]}>
                    <Image source={city_icon} style={style.iconStyle} />
                    <Text allowFontScaling={false} style={[style.subText, { marginLeft: wp(1) }]}>
                      {item?.address?.city}
                    </Text>
                  </View>
                  <View style={[style.common, { flex: 2 }]}>
                    <Image source={state_icon} style={style.iconStyle} />
                    <Text allowFontScaling={false} style={[style.subText, { marginLeft: wp(1) }]}>
                      {item?.address?.state}
                    </Text>
                  </View>
                  <View style={[style.common, { flex: 2.5 }]}>
                    <Image source={location_pin_icon} style={style.iconStyle} />
                    <Text allowFontScaling={false} style={[style.subText, { marginLeft: wp(1) }]}>
                      {item?.address?.pincode}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };
  const _RenderItemForMobileDevice = (item, index) => {
    let date = item.DOB;
    const dob = moment(date).format('Do MMM YYYY');
    return (
        <View style={{ flex: 1, marginBottom: hp(1) }}>
          <TouchableWithoutFeedback
              onPress={() => {
                displayDetailPage(index);
              }}
          >
            <View style={style.mainView}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  {/*{typeof item.ProfileImage === 'undefined' ||*/}
                  {/*item.ProfileImage === '-' ||*/}
                  {/*item.ProfileImage === null ||*/}
                  {/*item.ProfileImage === '' ? (*/}
                  {/*    <TouchableWithoutFeedback onPress={() => displayImageInFullScreen()}>*/}
                  {/*        <Image style={{height: wp(20), width: wp(20), borderRadius: wp(10)}} source={DefaultMaleIcon} />*/}
                  {/*    </TouchableWithoutFeedback>*/}
                  {/*) : (*/}
                  {/*    <TouchableWithoutFeedback*/}
                  {/*        onPress={() => {*/}
                  {/*            displayImageInFullScreen(item.ProfileImage);*/}
                  {/*        }}>*/}
                  {/*        <Image*/}
                  {/*            style={{height: wp(20), width: wp(20), borderRadius: wp(10)}}*/}
                  {/*            resizeMode={'cover'}*/}
                  {/*            onLoad={e => {}}*/}
                  {/*            source={{*/}
                  {/*                uri: item.ProfileImage,*/}
                  {/*                // headers: {Authorization: '9876543210'},*/}
                  {/*                // priority: FastImage.priority.normal,*/}
                  {/*                // cache: FastImage.cacheControl.immutable,*/}
                  {/*                //cache: FastImage.cacheControl.web,*/}
                  {/*                //cache: FastImage.cacheControl.cacheOnly,*/}
                  {/*            }}*/}
                  {/*        />*/}
                  {/*    </TouchableWithoutFeedback>*/}
                  {/*)}*/}
                </View>
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Image source={shop_icon} style={style.iconStyle} />
                    <Text
                        numberOfLines={1}
                        allowFontScaling={false}
                        style={[style.fontStyle, { width: wp(80) }]}
                    >
                      {item?.companyName}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Image source={owner_icon} style={style.iconStyle} />
                      <Text
                          numberOfLines={1}
                          allowFontScaling={false}
                          style={[style.fontStyle, { width: wp(50) }]}
                      >
                        {item?.contactName}
                      </Text>
                    </View>
                    <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: hp(2.5),
                          width: wp(25),
                          borderRadius: hp(1.5),
                          backgroundColor: item?.isApproved ? 'green' : 'red',
                        }}
                    >
                      <Text style={{ fontSize: normalize(12), fontWeight: '700' }}>
                        {item?.isApproved ? 'APPROVED' : 'PENDING'}
                      </Text>
                    </View>
                  </View>

                  {item?.companyEmail !== '' &&
                  item?.companyEmail !== '-' &&
                  item?.companyEmail !== null &&
                  typeof item?.companyEmail !== 'undefined' && (
                      <View style={[style.common, { marginLeft: wp(2), marginTop: hp(0.8) }]}>
                        <Image
                            source={require('../../../assets/images/mail.png')}
                            style={style.iconStyle}
                        />
                        <Text
                            allowFontScaling={false}
                            style={[
                              style.subText,
                              {
                                marginLeft: wp(1),
                                flex: 1,
                                textDecorationLine: 'underline',
                                color: color.blue,
                                textDecorationColor: color.blue,
                              },
                            ]}
                            onPress={() => {
                              Linking.openURL(`mailto:${item?.companyEmail}`)
                                  .then((res) => {})
                                  .catch((err) => {
                                    alert('Failed');
                                  });
                            }}
                        >
                          {item?.companyEmail.toLowerCase()}
                        </Text>
                      </View>
                  )}

                  <View style={[style.common, { marginLeft: wp(2), marginTop: hp(0.8) }]}>
                    <View style={[style.common, { flex: 1 }]}>
                      <Image
                          source={require('../../../assets/images/phone.png')}
                          style={style.iconStyle}
                      />
                      <Text
                          allowFontScaling={false}
                          onPress={() => {
                            Linking.openURL(`tel:${item?.contactNumber}`)
                                .then((res) => {})
                                .catch((err) => {
                                  alert('Failed');
                                });
                          }}
                          style={[
                            style.subText,
                            {
                              marginLeft: wp(1),
                              textDecorationLine: 'underline',
                              color: color.blue,
                              textDecorationColor: color.blue,
                            },
                          ]}
                      >
                        {item?.contactNumber}
                      </Text>
                    </View>

                    <View style={[style.birthdayView, { flex: 1 }]}>
                      <Image source={brand_icon} style={style.iconStyle} />
                      <Text allowFontScaling={false} style={{ ...style.subText, marginLeft: wp(1) }}>
                        {item?.brandName}
                      </Text>
                    </View>
                  </View>

                  <View style={[style.common, { marginLeft: wp(2), marginTop: hp(0.8) }]}>
                    <View style={[style.common, { flex: 2 }]}>
                      <Image source={city_icon} style={style.iconStyle} />
                      <Text allowFontScaling={false} style={[style.subText, { marginLeft: wp(1) }]}>
                        {item?.address?.city}
                      </Text>
                    </View>
                    <View style={[style.common, { flex: 2 }]}>
                      <Image source={state_icon} style={style.iconStyle} />
                      <Text allowFontScaling={false} style={[style.subText, { marginLeft: wp(1) }]}>
                        {item?.address?.state}
                      </Text>
                    </View>
                    <View style={[style.common, { flex: 2.5 }]}>
                      <Image source={location_pin_icon} style={style.iconStyle} />
                      <Text allowFontScaling={false} style={[style.subText, { marginLeft: wp(1) }]}>
                        {item?.address?.pincode}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
    );
  };
  const _renderHiddenComponent = (data, rowMap) => {
    // if (isLoading) {
    //     return null;
    // } else if (!renderFlag) {
    //     return null;
    // }

    return (
      <View style={style.rowBack}>
        <TouchableWithoutFeedback
          onPress={() => {
            rowMap[data.item.key].closeRow();
            displayDetailPage(currentMemberId.currentMember);
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
          >
            <Text
              allowFontScaling={false}
              style={{
                fontSize: normalize(15),
                color: color.white,
                // fontFamily: font.robotoBold,
              }}
            >
              Details
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };
  const displayDetailPage = (index) => {
    let tempData = null;
    openRowRef && openRowRef.closeRow();
    tempData = shopList[index];
    props.navigation.navigate('ShopDetails', {
      data: tempData,
    });

    // props.navigation.navigate('DirectoryDetail', {
    //     data: tempData,
    // });
  };
  return (
    <GradientBackground>
      {fromPopUp ? (
        <GoBackHeader
          title={'Shop List'}
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
          title={'Shop List'}
          onMenuPress={() => {
            props.navigation.openDrawer();
          }}
        />
      )}

      {isLoading && <Loading isLoading={isLoading} />}
      <FlatList
        directionalDistanceChangeThreshold={10}
        useFlatList={true}
        listViewRef={flatlistRef}
        data={
          shopList.length > 0 &&
          shopList.map((x, index) => {
            return { ...x, key: index };
          })
        }
        numColumns={(IsIOSOS || IsAndroidOS)?1:2}
        keyExtractor={(item, index) => index.toString()}
        recalculateHiddenLayout={true}
        renderItem={({ item, index }) => (IsIOSOS || IsAndroidOS)?_RenderItemForMobileDevice(item, index):_RenderItem(item, index)}
        renderHiddenItem={(data, rowMap) => _renderHiddenComponent(data, rowMap)}
        closeOnScroll={true}
        rightOpenValue={-wp(18)}
        rightActivationValue={isANDROID ? -1104545 : -wp(35)}
        disableRightSwipe={true}
        onRightActionStatusChange={() => {
          setTimeout(() => {
            displayDetailPage(tempCurrent);
            // displayDetailPage(currentMemberId.currentMember);
            openRowRef && openRowRef.closeRow();
          }, 50);
        }}
        contentContainerStyle={{
          paddingHorizontal: wp(3),
          paddingVertical: hp(1),
        }}
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        extraData={{ ...props }}
        refreshing={refreshPage}
        onRefresh={() => {
          dispatch(getShopList()).then((res) => {});
        }}
        onEndReachedThreshold={0.01}
        onRowOpen={(rowKey, rowMap) => {
          openRowRef = rowMap[rowKey];
          tempCurrent = rowKey;
          currentMemberId.currentMember = rowKey;
          if (isANDROID) {
            openRowRef = rowMap[rowKey];
          }
        }}
        onEndReachedThreshold={0.5}
        bounces={isANDROID ? false : true}
        onSwipeValueChange={(swipeData) => {
          if (isANDROID) {
            if (swipeData.direction === 'left' && !swipeData.isOpen && swipeData.value <= -150) {
              // setTimeout(() => {
              // alert("called")
              openRowRef && openRowRef.closeRow();
              displayDetailPage(swipeData.key);

              // }, 100);
            }
          }
        }}
      />
    </GradientBackground>
  );
};
const style = StyleSheet.create({
  searchTextinput: {
    flexDirection: 'row',
    marginHorizontal: wp(3),
    marginVertical: hp(1),
    paddingHorizontal: hp(2),
    backgroundColor: color.creamGray,
    borderRadius: wp(2),
    ...shadowStyle,
    elevation: 10,
  },
  subText: {
    fontSize: normalize(10),
  },
  common: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fontStyle: {
    color: color.themeBtnColor,
    fontSize: normalize(10),
    // fontFamily: font.robotoRegular,
    marginLeft: wp(2),
    fontWeight: 'bold',
  },
  mainView: {
    flexDirection: 'row',
    backgroundColor: color.white,
    // backgroundColor: 'red',
    borderRadius: wp(2),
    alignSelf: 'center',
    ...shadowStyle,
    paddingRight: wp(2),
    paddingLeft: wp(3),
    paddingVertical: hp(1),
    elevation: 10,
  },
  birthdayView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    // justifyContent: 'flex-end',
  },
  searchContainer: {
    fontSize: normalize(14),
    marginLeft: wp(2),
    paddingVertical: hp(1.5),
    flex: 1,
    color: color.black,
  },
  rowBack: {
    marginBottom: hp(1),
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(2.5),
    backgroundColor: color.themeBtnColor,
    borderRadius: wp(2),
  },
  iconStyle: {
    width: (IsIOSOS || IsAndroidOS)?wp(4):wp(1.0),
    height: (IsIOSOS || IsAndroidOS)?wp(4):wp(1.0),
  },
  sortLabel: {
    fontSize: normalize(15),
    color: '#414141',
    fontWeight: 'bold',
  },
  sortListItem: {
    fontSize: normalize(16),
    // fontWeight: 'bold',
    color: color.blue,
  },
  sortViewHeader: {
    height: hp(5.5),
    backgroundColor: color.blue,
  },
  sortViewHeaderText: {
    fontWeight: 'bold',
    fontSize: normalize(15),
    color: color.white,
    // color: color.white,
  },
  sortViewButton: {
    height: hp(4),
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    // borderRadius: hp(0.5),
  },
  sortButtonText: {
    fontSize: normalize(14),
    fontWeight: 'bold',
  },
  sortMainView: {
    flex: 1,
    marginTop: hp(1),
    flexDirection: 'row',
    padding: hp(0.5),
    alignItems: 'center',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  dividerView: {
    height: hp(0.05),
    backgroundColor: color.gray,
    width: wp(75),
    alignSelf: 'center',
  },
  sortModalMainView: {
    flex: 0,
    width: wp(84),
    backgroundColor: color.white,
  },
  sortModalTopRow: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: wp(10),
  },
  sortModalBottomRow: { height: hp(10), alignItems: 'center', justifyContent: 'center' },
});

export default PendingShopsScreen;
