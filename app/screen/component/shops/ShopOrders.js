import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Linking, FlatList,
} from 'react-native';
import { AppHeader, GradientBackground, Loading } from '../../common';
import { useDispatch, useSelector } from 'react-redux';
import { getShopList, getShopOrders } from '../../../redux/actions/storeAction';
import { SwipeListView } from 'react-native-swipe-list-view';
import {isANDROID, IsAndroidOS, IsIOSOS} from '../../../helper/themeHelper';
import { wp, hp, normalize, color } from '../../../helper/themeHelper';
import moment from 'moment';
import { shadowStyle } from '../../../helper/styles';
import DefaultMaleIcon from '../../../assets/images/user_male.png';
import { autoCapitalString } from '../../../helper/validation';
import {
  add_user_icon,
  brand_icon,
  city_icon,
  location_pin_icon,
  owner_icon,
  shop_icon,
  state_icon,
} from '../../../assets/images';

const PendingShopsScreen = (props) => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.appDefaultSettingReducer.isLoading);
  const shopList = useSelector((state) => state.shopReducer.shopList);
  const shopOrders = useSelector((state) => state.shopReducer.shopOrders);
  const [currentMemberId, setCurrentMemberId] = useState({ currentMember: 0 });
  const flatlistRef = useRef(null);
  const [refreshPage, setRefreshPage] = useState(false);
  let tempCurrent = 0;

  let openRowRef = null;
  useEffect(() => {
    dispatch(getShopOrders()).then((res) => {
      console.log('orders--', shopOrders);
    });
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
          <View style={[style.mainView,{width:(IsAndroidOS || IsIOSOS)?wp(90):wp(45)}]}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}></View>
              <View style={{ flex: 1, justifyContent: 'space-between' }}>
                {item?.userId?.name && (
                  <View style={{ flexDirection: 'row' }}>
                    <Image
                      source={require('../../../assets/images/user_icon.png')}
                      style={style.iconStyle}
                    />
                    <Text
                      numberOfLines={1}
                      allowFontScaling={false}
                      style={[style.fontStyle, { width: wp(80) }]}
                    >
                      {item?.userId?.name?.firstName + ' ' + item?.userId?.name?.lastName}
                    </Text>
                  </View>
                )}

                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Image source={owner_icon} style={style.iconStyle} />
                    <Text
                      numberOfLines={5}
                      allowFontScaling={false}
                      style={[style.fontStyle, { width: wp(20) }]}
                    >
                      {item?.street + ',' + item?.landmark}
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: hp(3),
                      width: (IsAndroidOS || IsIOSOS)?wp(15):wp(5),
                      borderRadius: hp(1.5),
                      backgroundColor: item?.status ? 'green' : 'red',
                    }}
                  >
                    <Text style={{ fontSize: normalize(7), fontWeight: '900',color:color.white }}>
                      {item?.status ? 'DELIVERED' : 'PENDING'}
                    </Text>
                  </View>
                </View>

                {item?.userId?.email && (
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
                        Linking.openURL(`mailto:${item?.userId?.email}`)
                          .then((res) => {})
                          .catch((err) => {
                            alert('Failed');
                          });
                      }}
                    >
                      {item?.userId?.email.toLowerCase()}
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
                        Linking.openURL(`tel:${item?.UserId?.phoneNumber}`)
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
                      {item?.phoneNumber}
                    </Text>
                  </View>

                  <View style={[style.birthdayView, { flex: 1 }]}>
                    <Image
                      source={require('../../../assets/images/calendar.png')}
                      style={style.iconStyle}
                    />
                    <Text allowFontScaling={false} style={{ ...style.subText, marginLeft: wp(1) }}>
                      {item?.deliverDate}
                    </Text>
                  </View>
                </View>

                <View style={[style.common, { marginLeft: wp(2), marginTop: hp(0.8) }]}>
                  <View style={[style.common, { flex: 2 }]}>
                    <Image source={city_icon} style={style.iconStyle} />
                    <Text allowFontScaling={false} style={[style.subText, { marginLeft: wp(1) }]}>
                      {item?.city}
                    </Text>
                  </View>
                  <View style={[style.common, { flex: 2 }]}>
                    <Image source={state_icon} style={style.iconStyle} />
                    <Text allowFontScaling={false} style={[style.subText, { marginLeft: wp(1) }]}>
                      {item?.state}
                    </Text>
                  </View>
                  <View style={[style.common, { flex: 2.5 }]}>
                    <Image source={location_pin_icon} style={style.iconStyle} />
                    <Text allowFontScaling={false} style={[style.subText, { marginLeft: wp(1) }]}>
                      {item?.pincode}
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
    // tempData = shopList[index]
    props.navigation.navigate('OrderDetails', {
      data: index,
    });

    // props.navigation.navigate('DirectoryDetail', {
    //     data: tempData,
    // });
  };
  return (
    <GradientBackground>
      <AppHeader
        title={'My Order List'}
        onMenuPress={() => {
          props.navigation.openDrawer();
        }}
      />
      {isLoading && <Loading isLoading={isLoading} />}
      <FlatList
        directionalDistanceChangeThreshold={10}
        useFlatList={true}
        listViewRef={flatlistRef}
        data={
          shopOrders.length > 0 &&
          shopOrders.map((x, index) => {
            return { ...x, key: index };
          })
        }
        numColumns={(IsAndroidOS || IsIOSOS)?1:2}
        keyExtractor={(item, index) => index.toString()}
        recalculateHiddenLayout={true}
        renderItem={({ item, index }) => _RenderItem(item, index)}
        contentContainerStyle={{
          paddingHorizontal: wp(3),
          paddingVertical: hp(1),
        }}
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        extraData={{ ...props }}
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
    fontSize: normalize(12),
  },
  common: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fontStyle: {
    color: color.themeBtnColor,
    fontSize: normalize(9),
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
