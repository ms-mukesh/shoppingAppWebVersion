import React, { useEffect, useState, useRef } from 'react';
import { CommonActions } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoBackHeader, ImagePreview, Loading, rupeesIcon } from '../../common';
import { useDispatch, useSelector } from 'react-redux';
import {
  addItemToCart,
  addItemToRecentItemList,
  getCartItems,
  getProductDetail,
  getRecentItemList,
  removeItemFromCart,
} from '../../../redux/actions/homeScreenActions';

import {hp, wp, normalize, color, IsAndroidOS, IsIOSOS} from '../../../helper/themeHelper';
import { center } from '../../../helper/styles';
import { star_empty, star_filled } from '../../../assets/images';
import AutoCompleteModel from '../../common/AutoCompleteBox';
// import FastImage from 'react-native-fast-image';

const ProductDetailScreen = (props) => {
  const { productId, productImage = null, price = 0, productName = '',isFromShareLink=false } = props.route.params;
  const PRODUCT_SIZE = ['S', 'M', 'L', 'XL', 'XXL'];
  const [productDetails, setProductDetail] = useState(null);

  const dispatch = useDispatch();
  console.log('data---', productDetails);
  const scrollRef = useRef(null);
  const [imagePreviewFlag, setImagePreviewFlag] = useState(false);
  // const [productDetails,setProductDetail] = useState(null)
  const isLoading = useSelector((state) => state.appDefaultSettingReducer.isLoading);
  // const productDetails = useSelector(state => state.productReducer.productDetail);
  const cartDetails = useSelector((state) => state.productReducer.myCart);
  // console.log('cart details--', cartDetails);
  const [currentColorIndex, setCurrentColorIndex] = useState(null);
  const [currentImages, setCurrentImages] = useState(null);
  const [isProductInCart, setIsProductInCart] = useState(false);
  const [autoCompleteFlag, setAutoCompleteFlag] = useState(false);
  const [currentKey, setCurrentKey] = useState();
  const [setValues, setSelectedValues] = useState('');
  const [selectField, setSelectedField] = useState('');
  const [currentSize, setCurrentSize] = useState('S');
  const [currentQty, setCurrentQty] = useState(1);
  const [isProductAvaliableInCart, setIsProductAvailableInCart] = useState(false);
  const checkProductAvailableInCart = () => {
    return new Promise(async (resolve) => {
      let flag = false;
      await cartDetails.map((item) => {
        if (item.find((o) => o.product === productId)) {
          flag = true;
          return resolve(true);
        }
      });
      return resolve(flag);
    });
  };
  useEffect(() => {
    dispatch(getProductDetail({ inputProductId: productId }))
      .then(async (res) => {
        if (res) {
          await setProductDetail(res);
        } else {
          alert('fail to get product data');
        }
      })
      .catch((err) => {
        alert('fail to get product data');
      });

    checkProductAvailableInCart().then((res) => {
      setIsProductAvailableInCart(res);
    });
  }, [cartDetails]);
  useEffect(() => {
    AsyncStorage.getItem('userLoginDetail').then((res) => {
      if (res) {
        console.log('data--', res);
      }
    });

    dispatch(addItemToRecentItemList({ inputProductId: productId })).then((res) => {
      dispatch(getRecentItemList()).then((res) => {
        dispatch(getCartItems()).then((res) => {});
      });
    });
  }, []);
  const closeImagePreview = () => {
    setImagePreviewFlag(false);
  };
  const _setIsAutoCompleteModel = (value) => {
    setAutoCompleteFlag(value);
  };
  const _setCurrentKey = (key) => {
    setCurrentKey(key);
  };
  const changeValue = () => {
    setCurrentSize(setValues.toUpperCase());
  };
  const _setSelectedField = (value) => {};
  const _setSelectedValues = (value) => {
    setSelectedValues(value);
  };
  const _setValuesForAutoCompelete = (Value, keyName, Label) => {
    setSelectedValues(Value);
    _setCurrentKey(keyName);
    setSelectedField(Label);
    setAutoCompleteFlag(true);
    _setCurrentKey(keyName);
  };
  const renderStars = (value) => {
    let comp = [];
    for (let i = 0; i < 5; i++) {
      comp.push(
        <Image
          style={{ height: hp(2), width: hp(2) }}
          source={i < parseInt(value) ? star_filled : star_empty}
        />
      );
    }
    return comp;
  };
  const addOrRemoveToCart = () => {
    if (!isProductAvaliableInCart) {
      if (
        (currentSize === null || currentSize === '') &&
        productDetails?.category?.name?.toLowerCase() !== 'saree'
      ) {
        alert('please select size');
        return;
      } else if (currentQty === 0) {
        alert('please select your quantity');
        return;
      } else {
        let obj = {
          inputProductColor:
            currentColorIndex !== null
              ? productDetails?.colors?.items[currentColorIndex]?.color
              : productDetails?.primarycolor,
          inputImage:
            currentColorIndex == null
              ? productDetails?.images
              : productDetails?.colors?.items[currentColorIndex]?.image,
          inputProductId: productId,
          inputProductQuantity: currentQty,
        };
        if (productDetails?.category?.name?.toLowerCase() === 'saree') {
          obj = {
            ...obj,
            inputProductPrice: parseInt(productDetails?.price) * parseInt(currentQty),
          };
        } else {
          obj = { ...obj, inputProductsize: currentSize };
          if (currentSize?.toLowerCase() === 's') {
            obj = {
              ...obj,
              inputProductPrice: parseInt(productDetails?.s?.price) * parseInt(currentQty),
            };
          } else if (currentSize?.toLowerCase() === 'm') {
            obj = {
              ...obj,
              inputProductPrice: parseInt(productDetails?.m?.price) * parseInt(currentQty),
            };
          } else if (currentSize?.toLowerCase() === 'xl') {
            obj = {
              ...obj,
              inputProductPrice: parseInt(productDetails?.xl?.price) * parseInt(currentQty),
            };
          } else if (currentSize?.toLowerCase() === 'xxl') {
            obj = {
              ...obj,
              inputProductPrice: parseInt(productDetails?.xxl?.price) * parseInt(currentQty),
            };
          } else if (currentSize?.toLowerCase() === 'l') {
            obj = {
              ...obj,
              inputProductPrice: parseInt(productDetails?.l?.price) * parseInt(currentQty),
            };
          }
        }

        if (
          typeof productDetails?.s !== 'undefined' &&
          currentSize?.toLowerCase() === 's' &&
          parseInt(currentQty) > parseInt(productDetails?.s?.quantity)
        ) {
          alert(productDetails?.s + ' stocks left for Size - S');
          return;
        } else if (
          typeof productDetails?.m !== 'undefined' &&
          currentSize?.toLowerCase() === 'm' &&
          parseInt(currentQty) > parseInt(productDetails?.m?.quantity)
        ) {
          alert(productDetails?.m + ' stocks left for Size - M');
          return;
        } else if (
          typeof productDetails?.xl !== 'undefined' &&
          currentSize?.toLowerCase() === 'xl' &&
          parseInt(currentQty) > parseInt(productDetails?.xl?.quantity)
        ) {
          alert(productDetails?.xl + ' stocks left for Size - XL');
          return;
        } else if (
          typeof productDetails?.xxl !== 'undefined' &&
          currentSize?.toLowerCase() === 'xxl' &&
          parseInt(currentQty) > parseInt(productDetails?.xxl?.quantity)
        ) {
          alert(productDetails?.xxl + ' stocks left for Size - XXL');
          return;
        } else if (
          typeof productDetails?.l !== 'undefined' &&
          currentSize?.toLowerCase() === 'l' &&
          parseInt(currentQty) > parseInt(productDetails?.l?.quantity)
        ) {
          alert(productDetails?.l + ' stocks left for Size - L');
          return;
        } else if (currentQty > productDetails?.quantity) {
          alert(productDetails?.quantity + ' stocks left');
          return;
        } else {
          dispatch(addItemToCart(obj)).then((res) => {
            if (res) {
              alert('Added');
              setIsProductInCart(true);

              dispatch(getCartItems()).then((res) => {
                if (res) {
                  checkProductAvailableInCart().then((res) => {
                    console.log('data--', res);
                    setIsProductAvailableInCart(res);
                  });
                }
              });
            }
          });
        }
      }
    } else {
      dispatch(removeItemFromCart(productId)).then((res) => {
        if (res) {
          alert('Removed');
          setIsProductInCart(false);
          setTimeout(() => {
            dispatch(getCartItems()).then((res) => {
              if (res) {
                checkProductAvailableInCart().then((res) => {
                  console.log('data--', res);
                  setIsProductAvailableInCart(res);
                });
              }
            });
          }, 200);
        }
      });
    }
  };
  const buyProduct = () => {
    if (
      (currentSize === null || currentSize === '') &&
      productDetails?.category?.name?.toLowerCase() !== 'saree'
    ) {
      alert('please select product size');
      return;
    } else if (currentQty === 0) {
      alert('please select quantity');
      return;
    }
    if (
      typeof productDetails?.s !== 'undefined' &&
      currentSize?.toLowerCase() === 's' &&
      parseInt(currentQty) > parseInt(productDetails?.s)
    ) {
      alert(productDetails?.s + ' stocks left for Size - S');
      return;
    } else if (
      typeof productDetails?.m !== 'undefined' &&
      currentSize?.toLowerCase() === 'm' &&
      parseInt(currentQty) > parseInt(productDetails?.m)
    ) {
      alert(productDetails?.m + ' stocks left for Size - M');
      return;
    } else if (
      typeof productDetails?.xl !== 'undefined' &&
      currentSize?.toLowerCase() === 'xl' &&
      parseInt(currentQty) > parseInt(productDetails?.xl)
    ) {
      alert(productDetails?.xl + ' stocks left for Size - XL');
      return;
    } else if (
      typeof productDetails?.xxl !== 'undefined' &&
      currentSize?.toLowerCase() === 'xxl' &&
      parseInt(currentQty) > parseInt(productDetails?.xxl)
    ) {
      alert(productDetails?.xxl + ' stocks left for Size - XXL');
      return;
    } else if (
      typeof productDetails?.l !== 'undefined' &&
      currentSize?.toLowerCase() === 'l' &&
      parseInt(currentQty) > parseInt(productDetails?.l)
    ) {
      alert(productDetails?.l + ' stocks left for Size - L');
      return;
    } else if (currentQty > productDetails?.quantity) {
      alert(productDetails?.quantity + ' stocks left');
      return;
    } else {
      let obj = {
        inputProductId: productDetails?._id,
        inputQuantity: currentQty,
        inputSize: currentSize,
        inputColor:
          currentColorIndex !== null
            ? productDetails?.colors?.items[currentColorIndex]?.color
            : productDetails?.primarycolor,
        productImages:
          currentColorIndex == null
            ? productDetails?.images?.split(',')
            : productDetails?.colors?.items[currentColorIndex]?.image?.split(','),
        productPrice: productDetails?.price,
        description: productDetails?.description,
        name: productDetails?.name,
      };

      if (productDetails?.category?.name?.toLowerCase() === 'saree') {
        obj = { ...obj, productPrice: productDetails?.price };
      } else {
        if (currentSize?.toLowerCase() === 's') {
          obj = { ...obj, productPrice: productDetails?.s?.price };
        } else if (currentSize?.toLowerCase() === 'm') {
          obj = { ...obj, productPrice: productDetails?.m?.price };
        } else if (currentSize?.toLowerCase() === 'xl') {
          obj = { ...obj, productPrice: productDetails?.xl?.price };
        } else if (currentSize?.toLowerCase() === 'xxl') {
          obj = { ...obj, productPrice: productDetails?.xxl?.price };
        } else if (currentSize?.toLowerCase() === 'l') {
          obj = { ...obj, productPrice: productDetails?.l?.price };
        }
      }
      props.navigation.navigate('PlaceDirectOrderScreen', { data: obj });
    }
  };

  const renderProductSizeChart = ({ item, index }) => {
    return (
      <View key={Math.random() + 'MK'} style={{ marginLeft: wp(2), marginTop: hp(1) }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setCurrentSize(item.toUpperCase());
          }}
        >
          <View
            style={{
              height: hp(5),
              width: wp(6),
              borderWidth: hp(0.1),
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: currentSize === item ? color.themeBtnColor : 'transparent',
            }}
          >
            <Text
              style={{
                fontSize: normalize(10),
                fontWeight: '700',
                color: currentSize === item ? color.white : color.black,
              }}
            >
              {item}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  const renderOutOfStockButton = () => {
    return productDetails?.category?.name?.toLowerCase() === 'saree' ? (
      <View style={[style.btnStyle, { backgroundColor: 'red', width: wp(80) }]}>
        <Text style={style.btnText}>{'OUT OF STOCK'}</Text>
      </View>
    ) : (
      <View style={[style.btnStyle, { backgroundColor: 'red', width: wp(80) }]}>
        <Text style={style.btnText}>
          {'NOT IN STOCK FOR SIZE "' + currentSize + '" FOR ' + currentQty + ' ENTITY'}
        </Text>
      </View>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: color.white }}>
      {isLoading && <Loading isLoading={isLoading} />}
      {imagePreviewFlag && (
        <ImagePreview
          imgArray={
            currentColorIndex !== null ? [currentImages] : productDetails?.images?.split(',')
          }
          setPreviewClose={closeImagePreview}
        />
      )}
      {autoCompleteFlag && (
        <AutoCompleteModel
          allSearchData={[]}
          _setIsAutoCompleteModel={_setIsAutoCompleteModel}
          SearchField={setValues}
          changeValue={changeValue}
          selectField={selectField}
          _setSelectedField={_setSelectedField}
          _setSelectedValues={_setSelectedValues}
          currentKey={'size'}
          // selectedValue={User[currentKey]}
        />
      )}
      <GoBackHeader
        onCartIconPress={() => {
          props.navigation.navigate('CartDetail');
        }}
        cartItemCount={cartDetails.length > 0 ? cartDetails.length : 0}
        onMenuPress={() => {

          isFromShareLink?  props.navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Dashboard' }],
              })
          ):props.navigation.goBack();
        }}
        title={productDetails !== null ? productDetails?.name ?? '' : productName}
      />
      <ScrollView style={{ flex: 1 }}>
        <View style={{ height: hp(50), width: wp(100) }}>
          {productDetails === null ? (
            <Image
              style={style.productImage}
              resizeMode={'contain'}
              source={{
                uri: productImage,
                headers: { Authorization: '9876543210' },
                // priority: FastImage.priority.normal,
                // cache: FastImage.cacheControl.immutable,
              }}
            />
          ) : (
            <ScrollView
              ref={scrollRef}
              scrollEventThrottle={16}
              pagingEnabled={true}
              horizontal={true}
              scrollEnabled={true}
              nestedScrollEnabled={true}
            >
              {currentColorIndex !== null ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setImagePreviewFlag(true);
                  }}
                >
                  <View style={{ flex: 1, width: wp(100) }}>
                    <Image resizeMode={'contain'} style={style.productImage} source={{ uri: currentImages }} />
                    {/*<FastImage*/}
                    {/*  style={style.productImage}*/}
                    {/*  source={{*/}
                    {/*    uri: currentImages,*/}
                    {/*    headers: { Authorization: '9876543210' },*/}
                    {/*    priority: FastImage.priority.normal,*/}
                    {/*    cache: FastImage.cacheControl.immutable,*/}
                    {/*  }}*/}
                    {/*/>*/}
                  </View>
                </TouchableOpacity>
              ) : (
                productDetails &&
                productDetails?.images.length > 0 &&
                productDetails?.images?.split(',')?.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={'jh' + index}
                      activeOpacity={0.8}
                      onPress={() => {
                        setImagePreviewFlag(true);
                      }}
                    >
                      <View style={{ flex: 1, width: wp(100) }}>
                        <Image
                          resizeMode={'contain'}
                          style={style.productImage}
                          source={{ uri: item }}
                        />
                        {/*<FastImage*/}
                        {/*  style={style.productImage}*/}
                        {/*  resizeMode={FastImage.resizeMode.contain}*/}
                        {/*  source={{*/}
                        {/*    uri: item,*/}
                        {/*    headers: { Authorization: '9876543210' },*/}
                        {/*    priority: FastImage.priority.normal,*/}
                        {/*    cache: FastImage.cacheControl.immutable,*/}
                        {/*  }}*/}
                        {/*/>*/}
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          )}
        </View>
        <View style={[style.mainView, { marginTop: 0 }]}>
          <View style={{ flexDirection: 'row', paddingLeft: wp(1) }}>
            <Text style={{ fontSize: normalize(15) }}>
              {productDetails === null ? productName : productDetails?.name}
            </Text>
          </View>
        </View>
        {productDetails?.category?.name?.toLowerCase() === 'saree' ? (
          <View style={[style.mainView]}>
            <View style={{ flexDirection: 'row', paddingLeft: wp(1) }}>
              <Text style={{ fontSize: normalize(15) }}>
                {productDetails === null ? price : productDetails?.price}
              </Text>
            </View>
            <Text style={{ fontSize: normalize(12), marginLeft: wp(1) }}>
              Inclusive of all taxes
            </Text>
          </View>
        ) : (
          <View style={[style.mainView]}>
            <View style={{ flexDirection: 'row', paddingLeft: wp(1) }}>
              <Text style={{ fontSize: normalize(15) }}>
                {productDetails === null
                  ? price
                  : currentSize?.toLowerCase() === 's'
                  ? productDetails?.s?.price
                  : currentSize?.toLowerCase() === 'm'
                  ? productDetails?.m?.price
                  : currentSize?.toLowerCase() === 'l'
                  ? productDetails?.l?.price
                  : currentSize?.toLowerCase() === 'xl'
                  ? productDetails?.xl?.price
                  : currentSize?.toLowerCase() === 'xxl'
                  ? productDetails?.xxl?.price
                  : productDetails?.price}
              </Text>
            </View>
            <Text style={{ fontSize: normalize(12), marginLeft: wp(1) }}>
              Inclusive of all taxes
            </Text>
          </View>
        )}
        {productDetails?.colors?.items?.length !== 0 && (
          <View style={[style.mainView]}>
            <View>
              <Text style={style.titleHeading}>Available colors</Text>
              <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                {productDetails?.colors?.items.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={'mk' + index}
                      activeOpacity={0.8}
                      onPress={async () => {
                        await setCurrentColorIndex(index);
                        await setCurrentImages(item?.image);
                      }}
                    >
                      <View
                        style={{
                          height: hp(3),
                          marginLeft: index !== 0 ? wp(2) : 0,
                          width: hp(3),
                          backgroundColor: item.color?.toLowerCase(),
                          borderRadius: hp(1.5),
                          borderWidth: currentColorIndex === index ? hp(0.4) : 0,
                          borderColor: color.themeBtnColor,
                        }}
                      />
                    </TouchableOpacity>
                  );
                })}

                {currentColorIndex !== null && (
                  <Text
                    onPress={() => {
                      setCurrentColorIndex(null);
                    }}
                    style={{ marginLeft: wp(40), fontSize: normalize(12), fontWeight: '700' }}
                  >
                    see original
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}
        <View style={[style.mainView]}>
          <Text style={style.titleHeading}>Description</Text>
          <Text style={style.valueStyle}>{productDetails?.description}</Text>
        </View>

        <View style={[style.mainView]}>
          <Text style={style.titleHeading}>Brand</Text>
          <Text style={style.valueStyle}>{productDetails?.brandName?.brandName}</Text>
        </View>

        {productDetails?.category?.name?.toLowerCase() !== 'saree' && (
          <View style={[style.mainView]}>
            <View>
              <Text style={style.titleHeading}>Select Size</Text>
              <FlatList
                numColumns={6}
                horizontal={false}
                data={PRODUCT_SIZE}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={true}
                renderItem={renderProductSizeChart}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
        )}
        <View style={[style.mainView]}>
          <View>
            <Text style={style.titleHeading}>Select Qty</Text>
            <View style={{ marginTop: hp(1), flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => {
                  if (currentQty !== 0) {
                    setCurrentQty(currentQty - 1);
                  }
                }}
              >
                <View style={[style.qtyView, { marginLeft: wp(2) }]}>
                  <Text style={style.qtyBtnText}>{'-'}</Text>
                </View>
              </TouchableOpacity>
              <View
                style={[
                  style.qtyView,
                  { marginLeft: wp(2), backgroundColor: 'transparent', borderWidth: hp(0.1) },
                ]}
              >
                <Text style={[style.qtyBtnText, { color: color.black }]}>{currentQty}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setCurrentQty(currentQty + 1);
                }}
              >
                <View style={[style.qtyView, { marginLeft: wp(2) }]}>
                  <Text style={style.qtyBtnText}>{'+'}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {productDetails?.review?.items.length > 0 && (
          <View style={[style.mainView]}>
            <Text style={style.titleHeading}>Review</Text>
            {productDetails?.review?.items.map((item, index) => {
              return (
                <View key={'hl' + index}>
                  <Text style={style.valueStyle}>{item?.name}</Text>
                  <Text style={[style.valueStyle]}>{item?.description}</Text>
                  <View style={{ flexDirection: 'row', marginLeft: wp(1), marginTop: hp(0.5) }}>
                    {renderStars(item?.rating)}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/*<View style={{ flexDirection: 'row', marginTop: hp(1), paddingLeft: wp(1) }}>*/}
        {/*  {rupeesIcon()}*/}
        {/*  <Text style={{ fontSize: normalize(25) }}>{productDetails?.price}</Text>*/}
        {/*</View>*/}
        {/*<Text style={{ fontSize: normalize(18), marginLeft: wp(1) }}>Inclusive of all taxes</Text>*/}
        {/*<View style={{ height: hp(0.08), marginTop: hp(1), backgroundColor: 'gray' }} />*/}
        {/*{productDetails?.colors?.items?.length !== 0 && (*/}
        {/*  <View>*/}
        {/*    <Text style={style.titleHeading}>Available colors</Text>*/}
        {/*    <View style={{ flexDirection: 'row', paddingLeft: wp(2), marginTop: hp(1) }}>*/}
        {/*      {productDetails?.colors?.items.map((item, index) => {*/}
        {/*        return (*/}
        {/*          <TouchableOpacity*/}
        {/*            activeOpacity={0.8}*/}
        {/*            onPress={async () => {*/}
        {/*              await setCurrentColorIndex(index);*/}
        {/*              await setCurrentImages(item?.image);*/}
        {/*            }}*/}
        {/*          >*/}
        {/*            <View*/}
        {/*              style={{*/}
        {/*                height: hp(3),*/}
        {/*                marginLeft: wp(1),*/}
        {/*                width: hp(3),*/}
        {/*                backgroundColor: item.color?.toLowerCase(),*/}
        {/*                borderRadius: hp(1.5),*/}
        {/*              }}*/}
        {/*            />*/}
        {/*          </TouchableOpacity>*/}
        {/*        );*/}
        {/*      })}*/}
        {/*      {currentColorIndex !== null && (*/}
        {/*        <Text*/}
        {/*          onPress={() => {*/}
        {/*            setCurrentColorIndex(null);*/}
        {/*          }}*/}
        {/*          style={{ marginLeft: wp(40), fontSize: normalize(15), fontWeight: '700' }}*/}
        {/*        >*/}
        {/*          see original*/}
        {/*        </Text>*/}
        {/*      )}*/}
        {/*    </View>*/}
        {/*    <View style={{ height: hp(0.08), marginTop: hp(1), backgroundColor: 'gray' }} />*/}
        {/*  </View>*/}
        {/*)}*/}
        {/*<View>*/}
        {/*  <Text style={style.titleHeading}>Description</Text>*/}
        {/*  <Text style={style.valueStyle}>{productDetails?.description}</Text>*/}
        {/*  <View style={{ height: hp(0.08), marginTop: hp(1), backgroundColor: 'gray' }} />*/}
        {/*</View>*/}
        {/*<View>*/}
        {/*  <Text style={style.titleHeading}>Brand</Text>*/}
        {/*  <Text style={style.valueStyle}>{productDetails?.brandName?.brandName}</Text>*/}
        {/*  <View style={{ height: hp(0.08), marginTop: hp(1), backgroundColor: 'gray' }} />*/}
        {/*</View>*/}
        {/*{productDetails?.category?.name?.toLowerCase() !== 'saree' && (*/}
        {/*  <View>*/}
        {/*    <Text style={style.titleHeading}>Select Size</Text>*/}
        {/*    <FlatList*/}
        {/*      numColumns={4}*/}
        {/*      horizontal={false}*/}
        {/*      data={PRODUCT_SIZE}*/}
        {/*      showsVerticalScrollIndicator={true}*/}
        {/*      showsHorizontalScrollIndicator={true}*/}
        {/*      renderItem={renderProductSizeChart}*/}
        {/*      keyExtractor={(item, index) => index.toString()}*/}
        {/*    />*/}
        {/*  </View>*/}
        {/*)}*/}
        {/*<View>*/}
        {/*  <Text style={style.titleHeading}>Select Qty</Text>*/}
        {/*  <View style={{ marginTop: hp(1), flexDirection: 'row', paddingLeft: wp(5) }}>*/}
        {/*    <TouchableOpacity*/}
        {/*      onPress={() => {*/}
        {/*        if (currentQty !== 0) {*/}
        {/*          setCurrentQty(currentQty - 1);*/}
        {/*        }*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      <View style={style.qtyView}>*/}
        {/*        <Text style={style.qtyBtnText}>{'-'}</Text>*/}
        {/*      </View>*/}
        {/*    </TouchableOpacity>*/}
        {/*    <View style={[style.qtyView, { backgroundColor: 'transparent', borderWidth: hp(0.1) }]}>*/}
        {/*      <Text style={style.qtyBtnText}>{currentQty}</Text>*/}
        {/*    </View>*/}
        {/*    <TouchableOpacity*/}
        {/*      onPress={() => {*/}
        {/*        setCurrentQty(currentQty + 1);*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      <View style={style.qtyView}>*/}
        {/*        <Text style={style.qtyBtnText}>{'+'}</Text>*/}
        {/*      </View>*/}
        {/*    </TouchableOpacity>*/}
        {/*  </View>*/}
        {/*</View>*/}

        {/*{productDetails?.review?.items.length > 0 && (*/}
        {/*  <View>*/}
        {/*    <Text style={style.titleHeading}>Review</Text>*/}
        {/*    {productDetails?.review?.items.map((item) => {*/}
        {/*      return (*/}
        {/*        <View>*/}
        {/*          <Text style={style.valueStyle}>{item?.name}</Text>*/}
        {/*          <Text style={[style.valueStyle]}>{item?.description}</Text>*/}
        {/*          <View style={{ flexDirection: 'row', marginLeft: wp(1), marginTop: hp(0.5) }}>*/}
        {/*            {renderStars(item?.rating)}*/}
        {/*          </View>*/}
        {/*        </View>*/}
        {/*      );*/}
        {/*    })}*/}
        {/*    <View style={{ height: hp(0.08), marginTop: hp(1), backgroundColor: 'gray' }} />*/}
        {/*  </View>*/}
        {/*)}*/}

        <View style={{ height: hp(3) }} />
      </ScrollView>

      {productDetails?.category?.name?.toLowerCase() === 'saree' ? (
        parseInt(productDetails?.quantity) <= 0 ||
        parseInt(currentQty) > parseInt(productDetails?.quantity) ? (
          renderOutOfStockButton()
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                addOrRemoveToCart();
              }}
            >
              <View
                style={[
                  style.btnStyle,
                  { backgroundColor: 'rgba(206,81,171,0.71)', width: (IsAndroidOS || IsIOSOS)?wp(35):wp(20) },
                ]}
              >
                <Text style={style.btnText}>
                  {isProductAvaliableInCart ? 'REMOVE FROM CART' : 'ADD TO CART'}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                buyProduct();
              }}
            >
              <View style={[style.btnStyle, { backgroundColor: '#ff6e00', marginLeft: wp(2) }]}>
                <Text style={style.btnText}>BUY NOW</Text>
              </View>
            </TouchableOpacity>
          </View>
        )
      ) : typeof productDetails?.s !== 'undefined' &&
        currentSize?.toLowerCase() === 's' &&
        parseInt(currentQty) > parseInt(productDetails?.s) ? (
        renderOutOfStockButton()
      ) : typeof productDetails?.m !== 'undefined' &&
        currentSize?.toLowerCase() === 'm' &&
        parseInt(currentQty) > parseInt(productDetails?.m) ? (
        renderOutOfStockButton()
      ) : typeof productDetails?.xl !== 'undefined' &&
        currentSize?.toLowerCase() === 'xl' &&
        parseInt(currentQty) > parseInt(productDetails?.xl) ? (
        renderOutOfStockButton()
      ) : typeof productDetails?.xxl !== 'undefined' &&
        currentSize?.toLowerCase() === 'xxl' &&
        parseInt(currentQty) > parseInt(productDetails?.xxl) ? (
        renderOutOfStockButton()
      ) : typeof productDetails?.l !== 'undefined' &&
        currentSize?.toLowerCase() === 'l' &&
        parseInt(currentQty) > parseInt(productDetails?.l) ? (
        renderOutOfStockButton()
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              addOrRemoveToCart();
            }}
          >
            <View
              style={[style.btnStyle, { backgroundColor: 'rgba(206,81,171,0.71)', width: (IsAndroidOS || IsIOSOS)?wp(35):wp(20) }]}
            >
              <Text style={style.btnText}>
                {isProductAvaliableInCart ? 'REMOVE FROM CART' : 'ADD TO CART'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              buyProduct();
            }}
          >
            <View style={[style.btnStyle, { backgroundColor: '#ff6e00', marginLeft: wp(2) }]}>
              <Text style={style.btnText}>BUY NOW</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: hp(2) }} />
    </View>
    // </GradientBackground>
  );
};
const style = StyleSheet.create({
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
  btnStyle: {
    height: hp(7),
    width: (IsAndroidOS || IsIOSOS)?wp(35):wp(20),
    alignSelf: 'center',
    marginTop: hp(2),
    backgroundColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp(1),
  },
  btnText: {
    fontSize: normalize(12),
    fontWeight: '700',
    color: '#f4e5e6',
  },
  productImage: {
    height: hp(50),
    width: wp(100),
  },
  qtyBtnText: { fontSize: normalize(16), fontWeight: '500', color: color.white },
  qtyView: {
    height: hp(4),
    width: hp(4),
    backgroundColor: color.themeBtnColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueStyle: { width: wp(90), marginTop: hp(0.5), fontSize: normalize(12), marginLeft: wp(1) },
  titleHeading: { color: '#4e3451', fontSize: normalize(12), marginTop: hp(1), marginLeft: wp(1) },
});
export default ProductDetailScreen;
