import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
} from 'react-native';
import {
  AppButton,
  GoBackHeader,
  GradientBackground,
  ImagePreview,
  Loading,
  rupeesIcon,
} from '../../common';
import { useDispatch, useSelector } from 'react-redux';
import {
  addItemToRecentItemList,
  getBrandWiseProduct,
  getCartItems,
  getRecentItemList,
  removeItemFromCart,
} from '../../../redux/actions/homeScreenActions';
import {color, hp, isANDROID, IsAndroidOS, IsIOSOS, normalize, wp} from '../../../helper/themeHelper';
import SafeAreaView from 'react-native-safe-area-view';
import { sumTotalPrice, sumTotalQty } from '../../../helper/validation';
import moment from '../order/showCustomerSideMyOrder';
import { getMyAddresses, removeAddress } from '../../../redux/actions/userActions';
// import FastImage from "react-native-fast-image";

const SubCartDetailScreen = (props) => {
  const { cartIndex = 0, keyName = null } = props.route.params;
  const cartDetails = useSelector((state) => state.productReducer.myCart);
  const [shopCartDetails, setShopCartDetails] = useState(cartDetails[cartIndex]);
  const isLoading = useSelector((state) => state.appDefaultSettingReducer.isLoading);
  const [orderPreview, setOrderPreview] = useState(false);
  const dispatch = useDispatch();
  const [imagePreviewFlag, setImagePreviewFlag] = useState(false);
  const [currentImageArray, setCurrentImageArray] = useState([]);
  const [currentCartItem, setCurrentCartItem] = useState([]);
  const closeImagePreview = () => {
    setImagePreviewFlag(false);
  };
  useEffect(() => {
    dispatch(getCartItems()).then((res) => {});
  }, []);
  useEffect(() => {
    if (typeof shopCartDetails === 'undefined') {
      setShopCartDetails([]);
    } else {
      setShopCartDetails(cartDetails[cartIndex]);
    }
  }, [cartDetails]);

  const removeCartItem = (productId) => {
    dispatch(removeItemFromCart(productId)).then((res) => {
      if (res) {
        alert('Removed');
        dispatch(getCartItems()).then((res) => {
          // setShopCartDetails(cartDetails[cartIndex]);
        });
      }
    });
  };
  const buyNowProduct = (productData) => {
    let obj = {
      inputProductId: productData?.product,
      inputQuantity: productData?.quantity,
      inputSize: productData?.size,
      inputColor: productData?.color,
      productImages: productData?.image?.split(','),
      productPrice: productData?.price,
      description: 'demo description',
      name: productData?.name,
    };
    props.navigation.navigate('PlaceDirectOrderScreen', { data: obj });
  };
  // const renderCartItems = ({ item }) => {
  //   return (
  //     <View key={Math.random() + 'DE'} style={style.mainView}>
  //       <TouchableOpacity
  //         activeOpacity={0.8}
  //         onPress={async () => {
  //           await setCurrentCartItem(item);
  //           await setOrderPreview(true);
  //         }}
  //       >
  //         <Image
  //           resizeMode={'contain'}
  //           style={style.cartProductImage}
  //           source={{ uri: item?.image }}
  //         />
  //       </TouchableOpacity>
  //       <Text
  //         numberOfLines={1}
  //         style={[style.bottomTextStyle, { width: wp(30), textAlign: 'center' }]}
  //       >
  //         {item?.price}
  //       </Text>
  //       <AppButton
  //         onPress={() => {
  //           removeCartItem(item?.product);
  //         }}
  //         customBtnText={{ fontSize: normalize(13) }}
  //         containerStyle={{
  //           width: wp(25),
  //           marginTop: hp(1),
  //           borderRadius: hp(1),
  //           height: hp(2),
  //           backgroundColor: 'red',
  //         }}
  //         title={'REMOVE'}
  //       />
  //       <AppButton
  //         onPress={() => {
  //           buyNowProduct(item);
  //         }}
  //         customBtnText={{ fontSize: normalize(13) }}
  //         containerStyle={{ width: wp(25), marginTop: hp(1), borderRadius: hp(1), height: hp(2) }}
  //         title={'BUY'}
  //       />
  //     </View>
  //   );
  // };
  const renderCartItems = ({ item, index }) => {
    return (
      <View key={Math.random() + 'DE'} style={style.mainView}>
        <View style={{ flexDirection: 'row' }}>
          <View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={async () => {
                console.log(item);
                await setCurrentCartItem(item);
                await setOrderPreview(true);
                console.log(item);
              }}
            >
              {/*<Image*/}
              {/*  resizeMode={'contain'}*/}
              {/*  style={style.cartProductImage}*/}
              {/*  source={{ uri: item?.image }}*/}
              {/*/>*/}
              <Image
                style={style.cartProductImage}
                resizeMode={'contain'}
                source={{
                  uri: item?.image,
                  headers: { Authorization: '9876543210' },
                  // priority: FastImage.priority.normal,
                  // cache: FastImage.cacheControl.immutable,
                }}
              />
            </TouchableOpacity>
          </View>
          <View>
            <View style={[style.subMainView, { marginTop: 0 }]}>
              <Text style={{ fontSize: normalize(10), marginLeft: wp(1), width: wp(40) }}>
                {item?.name}
              </Text>
            </View>
            <View style={[style.subMainView]}>
              <Text style={{ fontSize: normalize(10), marginLeft: wp(1) }}>{item?.price}</Text>
            </View>
          </View>
          <View>
            <AppButton
              onPress={() => {
                buyNowProduct(item);
              }}
              customBtnText={{ fontSize: normalize(13) }}
              containerStyle={{
                width: (IsAndroidOS || IsIOSOS)?wp(20):wp(15),
                marginTop: hp(1),
                borderRadius: hp(1),
                height: hp(4),
              }}
              title={'BUY'}
            />
            <AppButton
              onPress={() => {
                removeCartItem(item?.product);
              }}
              customBtnText={{ fontSize: normalize(13) }}
              containerStyle={{
                width: (IsAndroidOS || IsIOSOS)?wp(20):wp(15),
                marginTop: hp(1),
                borderRadius: hp(1),
                height: hp(4),
                backgroundColor: 'red',
              }}
              title={'REMOVE'}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <GradientBackground style={{ flex: 1 }}>
      {isLoading && <Loading isLoading={isLoading} />}
      {imagePreviewFlag && (
        <ImagePreview imgArray={currentImageArray} setPreviewClose={closeImagePreview} />
      )}
      <GoBackHeader
        onMenuPress={() => {
          props.navigation.goBack();
        }}
        title={'MY SHOP CART'}
      />

      {typeof shopCartDetails !== 'undefined' && (
        <ScrollView style={{ flex: 1 }}>
          {
            <FlatList
              data={shopCartDetails}
              numColumns={1}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderCartItems}
              horizontal={false}
              bounces={isANDROID ? false : true}
            />
          }
          <View style={[style.mainView, { flex: 0 }]}>
            <Text style={[style.textStyle, { fontWeight: '700' }]}>
              {'TOTAL CART ITEMS: ' + sumTotalQty(shopCartDetails)}
            </Text>
            <Text style={[style.textStyle, { marginTop: hp(1), fontWeight: '700' }]}>
              {'TOTAL CART AMOUNT: ' + sumTotalPrice(shopCartDetails)}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                props.navigation.navigate('PlaceOrder', { cartIndex: cartIndex });
              }}
            >
              <View
                style={[
                  style.listBtnStyle,
                  {
                    borderRadius: hp(1),
                    alignSelf: 'center',
                    backgroundColor: color.themeBtnColor,
                    width: (IsAndroidOS || IsIOSOS)?wp(35):wp(30),
                    height:hp(5)
                  },
                ]}
              >
                <Text style={style.listBtnTextStyle}>BUY ALL CART ITEMS</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ height: hp(3) }} />
        </ScrollView>
      )}
      {typeof shopCartDetails === 'undefined' && (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Text>NO ITEMS AVAILABLE IN YOUR CART FOR THIS SHOP!</Text>
        </View>
      )}
      {orderPreview && (
        <Modal
          onRequestClose={() => setOrderPreview(false)}
          animated={true}
          transparent={true}
          visible={true}
        >
          <View style={{ flex: 1, backgroundColor: color.white }}>
            <TouchableWithoutFeedback
              onPress={() => {
                setOrderPreview(false);
              }}
            >
              <Text
                style={{
                  color: color.themeBtnColor,
                  paddingRight: wp(5),
                  fontSize: normalize(16),
                  fontWeight: 'bold',
                  alignSelf: 'flex-end',
                }}
              >
                cancel
              </Text>
            </TouchableWithoutFeedback>
            <View style={[{ flex: 0 }]}>
              <ScrollView
                scrollEventThrottle={16}
                pagingEnabled={true}
                horizontal={true}
                scrollEnabled={true}
                nestedScrollEnabled={true}
              >
                {currentCartItem?.image.split(',')?.map((item, index) => {
                  return (
                    <View
                      key={'mk' + index}
                      style={{ flex: 1, width: wp(100), alignItems: 'center' }}
                    >
                      {/*<Image*/}
                      {/*  resizeMode={'contain'}*/}
                      {/*  style={{ height: hp(40), width: wp(95), borderRadius: hp(0.5) }}*/}
                      {/*  source={{ uri: item }}*/}
                      {/*/>*/}
                      <Image
                        style={{ height: hp(40), width: wp(95), borderRadius: hp(0.5) }}
                        // resizeMode={FastImage.resizeMode.contain}
                        source={{
                          uri: item,
                          headers: { Authorization: '9876543210' },
                          // priority: FastImage.priority.normal,
                          // cache: FastImage.cacheControl.immutable,
                        }}
                      />
                    </View>
                  );
                })}
              </ScrollView>
            </View>
            <ScrollView style={{ flex: 1 }}>
              <View style={[style.mainViewForModel]}>
                <View style={{ flexDirection: 'row', paddingLeft: wp(1) }}>
                  <Text style={{ fontSize: normalize(15) }}>{currentCartItem?.price}</Text>
                </View>
                <Text style={{ fontSize: normalize(12), marginLeft: wp(1) }}>
                  Inclusive of all taxes
                </Text>
              </View>
              <View style={[style.mainViewForModel]}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.titleHeading}>Product Name</Text>
                </View>
                <Text style={style.valueStyle}>{currentCartItem?.name}</Text>
              </View>

              {/*<View style={{ flexDirection: 'row', marginTop: hp(1), paddingLeft: wp(1) }}>*/}
              {/*  <Text style={{ fontSize: normalize(25), color: color.black }}>*/}
              {/*    {currentCartItem?.price}*/}
              {/*  </Text>*/}
              {/*</View>*/}

              <View style={[style.mainViewForModel]}>
                <Text style={style.titleHeading}>Description</Text>
                <Text style={style.valueStyle}>{currentCartItem?.description}</Text>
              </View>
              <View style={[style.mainViewForModel]}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.titleHeading}>Brand</Text>
                </View>
                <Text style={style.valueStyle}>{currentCartItem?.brandName}</Text>
              </View>

              <View style={[style.mainViewForModel]}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.titleHeading}>Color</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View
                    style={{
                      height: hp(3),
                      width: hp(3),
                      borderRadius: hp(1.5),
                      backgroundColor:
                        currentCartItem?.color?.toLowerCase() ??
                        currentCartItem?.primaryColor?.toLowerCase(),
                    }}
                  />
                  <Text style={[style.valueStyle]}>
                    {currentCartItem?.color?.toLowerCase() ??
                    currentCartItem?.primaryColor?.toLowerCase()}
                  </Text>
                </View>
              </View>

              <View style={[style.mainViewForModel]}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.titleHeading}>Size</Text>
                </View>
                <Text style={style.valueStyle}>{currentCartItem?.size}</Text>
              </View>
              <View style={[style.mainViewForModel]}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.titleHeading}>Qty</Text>
                </View>
                <Text style={style.valueStyle}>{currentCartItem?.quantity}</Text>
              </View>
              {/*<View style={{ height: hp(0.08), marginTop: hp(1), backgroundColor: 'gray' }} />*/}
              {/*<View>*/}
              {/*  <Text style={style.titleHeading}>Name</Text>*/}
              {/*  <Text style={style.valueStyle}>{currentCartItem?.name}</Text>*/}
              {/*  <View style={{ height: hp(0.08), marginTop: hp(1), backgroundColor: 'gray' }} />*/}
              {/*</View>*/}
              {/*<View>*/}
              {/*  <Text style={style.titleHeading}>Description</Text>*/}
              {/*  <Text style={style.valueStyle}>{currentCartItem?.description}</Text>*/}
              {/*  <View style={{ height: hp(0.08), marginTop: hp(1), backgroundColor: 'gray' }} />*/}
              {/*</View>*/}
              {/*<View>*/}
              {/*  <Text style={style.titleHeading}>Brand</Text>*/}
              {/*  <Text style={style.valueStyle}>{currentCartItem?.brandName}</Text>*/}
              {/*  <View style={{ height: hp(0.08), marginTop: hp(1), backgroundColor: 'gray' }} />*/}
              {/*</View>*/}
              {/*<View>*/}
              {/*  <Text style={style.titleHeading}>Color</Text>*/}
              {/*  <View style={{ flexDirection: 'row' }}>*/}
              {/*    <View*/}
              {/*      style={{*/}
              {/*        height: hp(3),*/}
              {/*        width: hp(3),*/}
              {/*        borderRadius: hp(1.5),*/}
              {/*        backgroundColor:*/}
              {/*          currentCartItem?.color?.toLowerCase() ??*/}
              {/*          currentCartItem?.primaryColor?.toLowerCase(),*/}
              {/*      }}*/}
              {/*    />*/}
              {/*    <Text style={[style.valueStyle, { marginTop: hp(-0.5) }]}>*/}
              {/*      {currentCartItem?.color?.toLowerCase() ??*/}
              {/*        currentCartItem?.primaryColor?.toLowerCase()}*/}
              {/*    </Text>*/}
              {/*  </View>*/}
              {/*  <View style={{ height: hp(0.08), marginTop: hp(1), backgroundColor: 'gray' }} />*/}
              {/*</View>*/}
              {/*{currentCartItem?.size ? (*/}
              {/*  <View>*/}
              {/*    <Text style={style.titleHeading}>Size</Text>*/}
              {/*    <Text style={style.valueStyle}>{currentCartItem?.size}</Text>*/}
              {/*    <View style={{ height: hp(0.08), marginTop: hp(1), backgroundColor: 'gray' }} />*/}
              {/*  </View>*/}
              {/*) : (*/}
              {/*  <View />*/}
              {/*)}*/}
              {/*<View>*/}
              {/*  <Text style={style.titleHeading}>Qty</Text>*/}
              {/*  <Text style={style.valueStyle}>{currentCartItem?.quantity}</Text>*/}
              {/*  <View style={{ height: hp(0.08), marginTop: hp(1), backgroundColor: 'gray' }} />*/}
              {/*</View>*/}
              <View style={{ height: hp(3) }} />
            </ScrollView>
          </View>
        </Modal>
      )}
    </GradientBackground>
  );
};
const style = StyleSheet.create({
  textStyle: {
    fontSize: normalize(13),
  },
  listBtnStyle: {
    width: wp(25),
    height: hp(3.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(1),
  },
  listBtnTextStyle: {
    fontSize: normalize(12),
    fontWeight: '700',
    color: color.white,
  },
  mainView: {
    flex: 1,
    marginTop: hp(2),
    marginLeft: wp(3),
    flexDirection: 'column',
    // alignItems: 'center',
    backgroundColor: color.white,
    borderRadius: hp(2),
    paddingTop: hp(1),
    paddingLeft: wp(2),
    paddingRight: wp(2),
    paddingBottom: hp(1),
  },
  mainViewForModel: {
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
  cartProductImage: {
    height: hp(15),
    width: wp(20),
    borderRadius: hp(2),
  },
  bottomTextStyle: {
    fontSize: normalize(12),
    fontWeight: '700',
    color: color.themeBtnColor,
  },
  valueStyle: {
    width: wp(90),
    marginTop: hp(0.5),
    fontSize: normalize(10),
    marginLeft: wp(1),
    color: color.black,
  },
  titleHeading: {
    color: color.themeBtnColor,
    fontSize: normalize(12),
    marginTop: hp(1),
    marginLeft: wp(1),
  },
  roundImageView: {
    height: hp(14),
    width: hp(14),
    borderRadius: hp(7),
    backgroundColor: color.white,
    shadowOffset: { height: 2, width: 2 },
    shadowRadius: 20,
    shadowOpacity: 1,
    elevation: 3,
    shadowColor: color.black,
  },
  mainViewForRound: {
    shadowOffset: { height: 2, width: 2 },
    shadowRadius: 20,
    shadowOpacity: 1,
    elevation: 3,
    shadowColor: color.black,
    flex: 1,
    marginTop: hp(2),
    marginLeft: wp(2),
    alignItems: 'center',
  },
  categoryImageStyle: {
    height: hp(14),
    width: hp(14),
    borderRadius: hp(7),
    alignItems: 'center',
    justifyContent: 'center',
  },
  subMainView: {
    flex: 0.25,
    marginTop: hp(1),
    marginLeft: wp(3),
    flexDirection: 'column',
    // alignItems: 'center',

    justifyContent: 'center',
    backgroundColor: '#fafafa',
    borderRadius: hp(2),
    // paddingTop: hp(1),
    paddingLeft: wp(2),
    paddingRight: wp(2),
  },
});
export default SubCartDetailScreen;
