import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ScrollView,
  Modal,
} from 'react-native';
import {
  AppButton,
  AppHeader,
  GradientBackground,
  ImagePreview,
  Loading,
  rupeesIcon,
} from '../../common';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerOrder } from '../../../redux/actions/userActions';
import {color, hp, isANDROID, IsAndroidOS, IsIOSOS, normalize, wp} from '../../../helper/themeHelper';
import moment from 'moment';
import {
  addItemToRecentItemList,
  getRecentItemList,
} from '../../../redux/actions/homeScreenActions';

const CustomerOrderScreen = (props) => {
  const isLoading = useSelector((state) => state.appDefaultSettingReducer.isLoading);
  const customerOrders = useSelector((state) => state.user.userCustomerOrder);
  const userDetails = useSelector((state) => state.user.userDetail);
  const cartDetails = useSelector((state) => state.productReducer.myCart);
  const [orderPreview, setOrderPreview] = useState(false);
  const [currentOrderDetail, setOrderDetail] = useState([]);
  const dispatch = useDispatch();
  const [currentImages, setCurrentImages] = useState(null);
  const [imagePreviewFlag, setImagePreviewFlag] = useState(false);
  console.log(currentOrderDetail);
  useEffect(() => {
    dispatch(getCustomerOrder()).then((res) => {});
  }, []);
  const closeImagePreview = () => {
    setImagePreviewFlag(false);
  };
  const renderOrders = ({ item, index }) => {
    console.log('item--', item);
    return (
      <View key={Math.random() + 'DE'} style={style.mainView}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={async () => {
            await setOrderDetail(item);
            await setOrderPreview(true);
          }}
        >
          <Image style={style.productImage} resizeMode={'contain'} source={{ uri: item?.image }} />
        </TouchableOpacity>
        {item?.status ? (
          <Text
            numberOfLines={1}
            style={[style.bottomTextStyle, { width: wp(30), textAlign: 'center' }]}
          >
            {'RECEIVED'}
          </Text>
        ) : (
          <Text
            numberOfLines={1}
            style={[
              style.bottomTextStyle,
              { width: wp(40), textAlign: 'center', fontSize: normalize(10) },
            ]}
          >
            {'DELIVERY TILL: ' + item?.deliverDate}
          </Text>
        )}
      </View>
    );
  };
  const _RenderItem = (item, index) => {
    return (
      <View>
        <View style={{ padding: hp(1), flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={async () => {
              await setCurrentImages(item?.image);
              await setImagePreviewFlag(true);
            }}
          >
            <View style={{ flex: 1 }}>
              <Image style={{ height: hp(10), width: wp(25) }} source={{ uri: item?.image }} />
            </View>
          </TouchableOpacity>
          <View style={{ flex: 3 }}>
            <Text style={style.textStyle}>{item?.productName}</Text>
            <Text style={style.textStyle}>
              {'Expected Delivery: ' + moment(item?.deliverDate).format('DD-MM-YYYY')}
            </Text>
            <Text style={style.textStyle}>{'qty:' + item?.quantity}</Text>
            {item?.size !== '' && typeof item?.size !== 'undefined' && (
              <Text style={style.textStyle}>{'size:' + item?.size}</Text>
            )}

            <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
              {rupeesIcon()}
              <Text style={style.textStyle}>{item?.amount}</Text>
            </View>
            <Text style={style.textStyle}>
              Received: <Text>{item?.status ? 'YES' : 'NO'}</Text>
            </Text>
          </View>
          {/*<View style={{flex:1}}>*/}
          {/*    {item?.color &&*/}
          {/*    <View style={{flexDirection: 'row'}}>*/}
          {/*        <Text style={style.textStyle}>color: </Text>*/}
          {/*        <View style={{*/}
          {/*            alignSelf: 'center',*/}
          {/*            height: hp(2),*/}
          {/*            width: hp(2),*/}
          {/*            borderRadius: hp(1),*/}
          {/*            backgroundColor: item?.color.toLowerCase()*/}
          {/*        }}/>*/}

          {/*    </View>*/}

          {/*    }*/}

          {/*</View>*/}
        </View>
        <View style={{ height: hp(0.08), marginTop: hp(1), backgroundColor: 'gray' }} />
      </View>
    );
  };

  return (
    <GradientBackground>
      {orderPreview && (
        <Modal
          onRequestClose={() => setOrderPreview(false)}
          animated={true}
          transparent={true}
          visible={true}
        >
          <View style={{ flex: 1, backgroundColor: color.white }}>
            <SafeAreaView
              style={{
                flex: 1,
                // backgroundColor: 'rgba(14,14,14,0.9)',
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  setOrderPreview(false);
                }}
              >
                <Text
                  style={{
                    color: color.black,
                    paddingRight: wp(5),
                    fontSize: normalize(16),
                    fontWeight: 'bold',
                    alignSelf: 'flex-end',
                  }}
                >
                  cancel
                </Text>
              </TouchableWithoutFeedback>
              <View style={[style.mainView, { flex: 0 }]}>
                <Image
                  resizeMode={'contain'}
                  source={{ uri: currentOrderDetail?.image }}
                  style={{ height: hp(40), width: wp(95), borderRadius: hp(5) }}
                />
              </View>
              <ScrollView style={{ flex: 1 }}>
                <View style={style.subMainView}>
                  <View style={{ flexDirection: 'row', marginTop: hp(1), paddingLeft: wp(1) }}>
                    <Text style={{ fontSize: normalize(13), color: color.themeBtnColor }}>
                      {currentOrderDetail?.amount}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: normalize(10),
                      marginLeft: wp(1),
                      color: color.themeBtnColor,
                    }}
                  >
                    Inclusive of all taxes
                  </Text>
                </View>
                <View style={style.subMainView}>
                  <Text style={style.titleHeading}>Name</Text>
                  <Text style={style.valueStyle}>{currentOrderDetail?.productName}</Text>
                </View>
                {currentOrderDetail?.status ? (
                  <View style={style.subMainView}>
                    <Text style={style.titleHeading}>Delivery Status</Text>
                    <Text style={style.valueStyle}>{'DELIVERED'}</Text>
                  </View>
                ) : (
                  <View style={style.subMainView}>
                    <Text style={style.titleHeading}>Delivery Status</Text>
                    <Text style={style.valueStyle}>
                      {'Expected Delivery on :-' + currentOrderDetail?.deliverDate}
                    </Text>
                  </View>
                )}
                <View style={style.subMainView}>
                  <Text style={style.titleHeading}>Delivery Address</Text>
                  <Text style={style.valueStyle}>{currentOrderDetail?.street}</Text>
                  <Text style={style.valueStyle}>{currentOrderDetail?.landmark}</Text>
                  <Text style={style.valueStyle}>
                    {currentOrderDetail?.city + ',' + currentOrderDetail?.state}
                  </Text>
                  <Text style={style.valueStyle}>{currentOrderDetail?.pincode}</Text>
                </View>
                <View style={style.subMainView}>
                  <Text style={style.titleHeading}>Order Place Date</Text>
                  <Text style={style.valueStyle}>{currentOrderDetail?.placeDate}</Text>
                </View>
                <View style={style.subMainView}>
                  <Text style={style.titleHeading}>Will Be Contact On</Text>
                  <Text style={style.valueStyle}>{currentOrderDetail?.phoneNumber}</Text>
                </View>

                <View style={style.subMainView}>
                  <Text style={style.titleHeading}>Description</Text>
                  <Text style={style.valueStyle}>{currentOrderDetail?.product?.description}</Text>
                </View>
                <View style={style.subMainView}>
                  <Text style={style.titleHeading}>Brand</Text>
                  <Text style={style.valueStyle}>
                    {currentOrderDetail?.product?.brandName?.brandName}
                  </Text>
                </View>
                {currentOrderDetail?.size ? (
                  <View style={style.subMainView}>
                    <Text style={style.titleHeading}>Size</Text>
                    <Text style={style.valueStyle}>{currentOrderDetail?.size}</Text>
                  </View>
                ) : (
                  <View />
                )}
                <View style={style.subMainView}>
                  <Text style={style.titleHeading}>Qty</Text>
                  <Text style={style.valueStyle}>{currentOrderDetail?.quantity}</Text>
                </View>
                <View style={{ height: hp(3) }} />
              </ScrollView>
            </SafeAreaView>
          </View>
        </Modal>
      )}
      {imagePreviewFlag && (
        <ImagePreview imgArray={[currentImages]} setPreviewClose={closeImagePreview} />
      )}
      <AppHeader
        cartItemCount={cartDetails.length}
        onCartIconPress={() => {
          props.navigation.navigate('CartDetail');
        }}
        title={'My Orders'}
        onMenuPress={() => props.navigation.openDrawer()}
      />
      {customerOrders && customerOrders.length > 0 && (
        <FlatList
          data={customerOrders}
          numColumns={(IsIOSOS || IsAndroidOS)?2:4}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderOrders}
          horizontal={false}
          bounces={isANDROID ? false : true}
        />
      )}
      {customerOrders.length === 0 && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>No order found ... please explore and order more items</Text>
        </View>
      )}
      {isLoading && <Loading isLoading={isLoading} />}
    </GradientBackground>
  );
};
const style = StyleSheet.create({
  valueStyle: {
    width: wp(90),
    marginTop: hp(0.5),
    fontSize: normalize(10),
    marginLeft: wp(1),
    color: color.themeBtnColor,
  },
  titleHeading: {
    color: color.themeBtnColor,
    fontSize: normalize(12),
    marginTop: hp(1),
    marginLeft: wp(1),
  },
  textStyle: {
    fontSize: normalize(16),
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
  mainView: {
    flex: 1,
    marginTop: hp(2),
    marginLeft: wp(1),
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: color.white,
    // backgroundColor: 'red',
    borderRadius: hp(2),
    paddingTop: hp(1),
    paddingLeft: wp(2),
    paddingRight: wp(2),
    paddingBottom: hp(1),
  },
  productImage: {
    height: hp(25),
    width: wp(38),
    borderRadius: hp(2),
  },
  bottomTextStyle: {
    marginTop: hp(1),
    fontSize: normalize(12),
    fontWeight: '700',
    color: color.themeBtnColor,
  },
  subMainView: {
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

export default CustomerOrderScreen;
