import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import {
  AppButton,
  AppHeader,
  GoBackHeader,
  GradientBackground,
  ImagePreview,
  Loading,
  rupeesIcon,
} from '../../common';
import {color, hp, IsAndroidOS, IsIOSOS, normalize, wp} from '../../../helper/themeHelper';
import {
  getMyShopDetails,
  getShopOrders,
  updateOrderDeliverStatus,
  updateStoreOrderDeliverStatus,
} from '../../../redux/actions/storeAction';
import moment from 'moment';

const ShopOrderDetailScreen = (props) => {
  const isLoading = useSelector((state) => state.appDefaultSettingReducer.isLoading);
  const { data } = props.route.params;
  const shopOrders = useSelector((state) => state.shopReducer.shopOrders);
  const productDetails = shopOrders[data];
  const [imagePreviewFlag, setImagePreviewFlag] = useState(false);
  const closeImagePreview = () => {
    setImagePreviewFlag(false);
  };
  console.log('data for order', shopOrders[data]);

  const dispatch = useDispatch();
  const updateOrderDeliverStatus = () => {
    let obj = {
      inputOrderid: productDetails?._id,
      inputStatus: true,
    };
    console.log('obj--', obj);
    dispatch(updateStoreOrderDeliverStatus(obj)).then((res) => {
      if (res) {
        dispatch(getShopOrders()).then((res) => {
          props.navigation.goBack();
        });
      }
    });
    console.log('object------', obj);
  };
  const orderDetail = () =>{
    return (
        <GradientBackground>
          <GoBackHeader title={'Order Detail'} onMenuPress={() => props.navigation.goBack()} />
          {imagePreviewFlag && (
              <ImagePreview imgArray={[productDetails?.image]} setPreviewClose={closeImagePreview} />
          )}
          <ScrollView style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setImagePreviewFlag(true);
                  }}
              >
                <View style={style.mainView}>
                  <Image
                      style={{ height: hp(13), width: wp(20), alignSelf: 'center' }}
                      source={{ uri: productDetails.image }}
                      resizeMode={'contain'}
                  />
                </View>
              </TouchableOpacity>
              <View style={[style.mainView, { flex: 3, alignItems: 'flex-start' }]}>
                {productDetails?.userId?.name && (
                    <Text style={style.listItemValue}>
                      {productDetails?.userId?.name?.firstName +
                      ' ' +
                      productDetails?.userId?.name?.lastName}
                    </Text>
                )}
                {productDetails?.userId?.phoneNumber && (
                    <Text style={style.listItemValue}>{productDetails?.userId?.phoneNumber}</Text>
                )}
                {productDetails?.userId?.email && (
                    <Text style={style.listItemValue}>
                      {productDetails?.userId?.email?.toLowerCase()}
                    </Text>
                )}
                {productDetails?.userId?.email && (
                    <Text style={style.listItemValue}>
                      {'Order place Date  ' + productDetails?.placeDate}
                    </Text>
                )}
                {productDetails?.amount && (
                    <Text style={style.listItemValue}>
                      {'Total Billing Amount ' + productDetails?.amount}
                    </Text>
                )}
              </View>
            </View>
            <View style={[style.mainView,{flexDirection:'row'}]}>
              <View style={{flex:1}}>
                <Text style={style.listItemValue}>{'DELIVERY DETAILS'}</Text>
                <Text style={[style.listItemSubheader, { alignSelf: 'flex-start' }]}>
                  {'Delivery status'}
                </Text>
                <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
                  {productDetails?.status ? 'DELIVERED' : 'NOT DELIVER YET'}
                </Text>
                <Text style={[style.listItemSubheader, { alignSelf: 'flex-start' }]}>
                  {'Address Type' + '   ' + productDetails?.type?.toUpperCase()}
                </Text>
                <Text style={[style.listItemSubheader, { alignSelf: 'flex-start' }]}>{'Address'}</Text>
                <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
                  {productDetails?.street}
                </Text>
                <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
                  {productDetails?.landmark}
                </Text>
                <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
                  {productDetails?.city + ', ' + productDetails?.state}
                </Text>
                <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
                  {productDetails?.pincode}
                </Text>
                <Text style={[style.listItemSubheader, { alignSelf: 'flex-start' }]}>
                  {'Expected Delivery Date'}
                </Text>
                <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
                  {productDetails?.deliverDate}
                </Text>
                <Text style={[style.listItemSubheader, { alignSelf: 'flex-start' }]}>
                  {'Payment Mode'}
                </Text>
                <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
                  {productDetails?.payment}
                </Text>
              </View>
              <View style={{flex:3}}>
                <Text style={style.listItemValue}>{'PRODUCT DETAILS'}</Text>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={[style.listItemSubheader, { alignSelf: 'flex-start' }]}>{'Name'}</Text>
                    <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
                      {productDetails?.productName}
                    </Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <Text style={[style.listItemSubheader, { alignSelf: 'flex-start' }]}>{'Price'}</Text>
                    <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
                      {parseInt(productDetails?.amount) / parseInt(productDetails?.quantity) +
                      '/ Per Quantity'}
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={[style.listItemSubheader, { alignSelf: 'flex-start' }]}>
                      {'Product Quantity'}
                    </Text>
                    <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
                      {productDetails?.quantity}
                    </Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    {productDetails?.size && (
                        <Text style={[style.listItemSubheader, { alignSelf: 'flex-start' }]}>{'Size'}</Text>
                    )}
                    {productDetails?.size && (
                        <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
                          {productDetails?.size}
                        </Text>
                    )}
                  </View>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={[style.listItemSubheader, { alignSelf: 'flex-start' }]}>{'Brand'}</Text>
                    <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
                      {productDetails?.product?.brandName?.brandName}
                    </Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <Text style={[style.listItemSubheader, { alignSelf: 'flex-start' }]}>
                      {'Product Category'}
                    </Text>
                    <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
                      {productDetails?.product?.category?.name}
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={[style.listItemSubheader, { alignSelf: 'flex-start' }]}>
                      {'Product Type'}
                    </Text>
                    <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
                      {productDetails?.product?.type?.typeName}
                    </Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <Text style={[style.listItemSubheader, { alignSelf: 'flex-start' }]}>
                      {'Product Fabric'}
                    </Text>
                    <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
                      {productDetails?.product?.fabric?.fabricName}
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={[style.listItemSubheader, { alignSelf: 'flex-start' }]}>{'Color'}</Text>
                    <View
                        style={{
                          height: hp(3),
                          width: hp(3),
                          borderRadius: hp(1.5),
                          backgroundColor: productDetails?.color?.toLowerCase(),
                        }}
                    />
                  </View>
                  <View style={{ flex: 3 }}>
                    <Text style={[style.listItemSubheader, { alignSelf: 'flex-start' }]}>
                      {'Total Amount'}
                    </Text>
                    <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
                      {productDetails?.amount}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
          <AppButton
              containerStyle={{ marginTop: hp(2),width:wp(30) }}
              title={productDetails?.status ? 'Delivered' : 'Check as Delivered'}
              onPress={() => {
                !productDetails?.status && updateOrderDeliverStatus();
              }}
          />
          <View style={{ height: hp(3) }} />
          {isLoading && <Loading isLoading={isLoading} />}
        </GradientBackground>
    );
  }
  const orderDetailForMoileDevice = () =>{
    return(
    <GradientBackground>
      <GoBackHeader title={'Order Detail'} onMenuPress={() => props.navigation.goBack()} />
      {imagePreviewFlag && (
          <ImagePreview imgArray={[productDetails?.image]} setPreviewClose={closeImagePreview} />
      )}
      <ScrollView style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setImagePreviewFlag(true);
              }}
          >
            <View style={style.mainView}>
              <Image
                  style={{ height: hp(13), width: wp(20), alignSelf: 'center' }}
                  source={{ uri: productDetails.image }}
                  resizeMode={'contain'}
              />
            </View>
          </TouchableOpacity>
          <View style={[style.mainView, { flex: 3, alignItems: 'flex-start' }]}>
            {productDetails?.userId?.name && (
                <Text style={style.listItemValue}>
                  {productDetails?.userId?.name?.firstName +
                  ' ' +
                  productDetails?.userId?.name?.lastName}
                </Text>
            )}
            {productDetails?.userId?.phoneNumber && (
                <Text style={style.listItemValue}>{productDetails?.userId?.phoneNumber}</Text>
            )}
            {productDetails?.userId?.email && (
                <Text style={style.listItemValue}>
                  {productDetails?.userId?.email?.toLowerCase()}
                </Text>
            )}
            {productDetails?.userId?.email && (
                <Text style={style.listItemValue}>
                  {'Order place Date  ' + productDetails?.placeDate}
                </Text>
            )}
            {productDetails?.amount && (
                <Text style={style.listItemValue}>
                  {'Total Billing Amount ' + productDetails?.amount}
                </Text>
            )}
          </View>
        </View>
        <View style={style.mainView}>
          <Text style={style.listItemValue}>{'DELIVERY DETAILS'}</Text>
          <Text style={[style.listItemSubheader, { alignSelf: 'flex-start' }]}>
            {'Delivery status'}
          </Text>
          <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
            {productDetails?.status ? 'DELIVERED' : 'NOT DELIVER YET'}
          </Text>
          <Text style={[style.listItemSubheader, { alignSelf: 'flex-start' }]}>
            {'Address Type' + '   ' + productDetails?.type?.toUpperCase()}
          </Text>
          <Text style={[style.listItemSubheader, { alignSelf: 'flex-start' }]}>{'Address'}</Text>
          <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
            {productDetails?.street}
          </Text>
          <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
            {productDetails?.landmark}
          </Text>
          <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
            {productDetails?.city + ', ' + productDetails?.state}
          </Text>
          <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
            {productDetails?.pincode}
          </Text>
          <Text style={[style.listItemSubheader, { alignSelf: 'flex-start' }]}>
            {'Expected Delivery Date'}
          </Text>
          <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
            {productDetails?.deliverDate}
          </Text>
          <Text style={[style.listItemSubheader, { alignSelf: 'flex-start' }]}>
            {'Payment Mode'}
          </Text>
          <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
            {productDetails?.payment}
          </Text>
        </View>
        <View style={style.mainView}>
          <Text style={style.listItemValue}>{'PRODUCT DETAILS'}</Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Text style={[style.listItemSubheader, { alignSelf: 'flex-start' }]}>{'Name'}</Text>
              <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
                {productDetails?.productName}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[style.listItemSubheader, { alignSelf: 'flex-start' }]}>{'Price'}</Text>
              <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
                {parseInt(productDetails?.amount) / parseInt(productDetails?.quantity) +
                '/ Per Quantity'}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Text style={[style.listItemSubheader, { alignSelf: 'flex-start' }]}>
                {'Product Quantity'}
              </Text>
              <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
                {productDetails?.quantity}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              {productDetails?.size && (
                  <Text style={[style.listItemSubheader, { alignSelf: 'flex-start' }]}>{'Size'}</Text>
              )}
              {productDetails?.size && (
                  <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
                    {productDetails?.size}
                  </Text>
              )}
            </View>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Text style={[style.listItemSubheader, { alignSelf: 'flex-start' }]}>{'Brand'}</Text>
              <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
                {productDetails?.product?.brandName?.brandName}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[style.listItemSubheader, { alignSelf: 'flex-start' }]}>
                {'Product Category'}
              </Text>
              <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
                {productDetails?.product?.category?.name}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Text style={[style.listItemSubheader, { alignSelf: 'flex-start' }]}>
                {'Product Type'}
              </Text>
              <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
                {productDetails?.product?.type?.typeName}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[style.listItemSubheader, { alignSelf: 'flex-start' }]}>
                {'Product Fabric'}
              </Text>
              <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
                {productDetails?.product?.fabric?.fabricName}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Text style={[style.listItemSubheader, { alignSelf: 'flex-start' }]}>{'Color'}</Text>
              <View
                  style={{
                    height: hp(3),
                    width: hp(3),
                    borderRadius: hp(1.5),
                    backgroundColor: productDetails?.color?.toLowerCase(),
                  }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[style.listItemSubheader, { alignSelf: 'flex-start' }]}>
                {'Total Amount'}
              </Text>
              <Text style={[style.listItemSubValue, { alignSelf: 'flex-start' }]}>
                {productDetails?.amount}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <AppButton
          containerStyle={{ marginTop: hp(2) }}
          title={productDetails?.status ? 'Delivered' : 'Check as Delivered'}
          onPress={() => {
            !productDetails?.status && updateOrderDeliverStatus();
          }}
      />
      <View style={{ height: hp(3) }} />
      {isLoading && <Loading isLoading={isLoading} />}
    </GradientBackground>
    )
  }
  return (
      (IsIOSOS || IsAndroidOS)?orderDetailForMoileDevice():orderDetail()
  );
};
const style = StyleSheet.create({
  btnStyle: {
    height: hp(5),
    width: wp(95),
    alignSelf: 'center',
    marginTop: hp(1),
    backgroundColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: normalize(14),
    fontWeight: '700',
  },
  productImage: {
    height: hp(50),
    width: wp(100),
  },
  qtyBtnText: { fontSize: normalize(16), fontWeight: '700' },
  qtyView: {
    marginLeft: wp(3),
    height: hp(4),
    width: hp(4),
    backgroundColor: color.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueStyle: { width: wp(90), marginTop: hp(0.5), fontSize: normalize(12), marginLeft: wp(1) },
  titleHeading: { color: '#4e3451', fontSize: normalize(13), marginTop: hp(1), marginLeft: wp(1) },
  mainView: {
    flex: 1,
    marginTop: hp(2),
    marginLeft: wp(3),
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: color.white,
    borderRadius: hp(2),
    paddingTop: hp(1),
    paddingLeft: wp(2),
    paddingRight: wp(2),
    paddingBottom: hp(1),
  },
  listItemValue: {
    fontSize: normalize(10),
    color: color.themeBtnColor,
    fontWeight: '700',
  },
  listItemSubValue: {
    fontSize: normalize(10),
    color: 'rgba(42,62,84,0.83)',
    fontWeight: '700',
  },
  listItemSubheader: {
    fontSize: normalize(12),
    color: color.themeBtnColor,
    fontWeight: '700',
  },
});
export default ShopOrderDetailScreen;
