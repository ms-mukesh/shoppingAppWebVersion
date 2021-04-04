import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import {color, hp, wp, normalize, isANDROID, isIOS, isWEB, IsIOSOS, IsAndroidOS} from '../../../helper/themeHelper';
import {
  AppHeader,
  FloatingLabel,
  GradientBackground,
  CustomColorPicker,
  LabelInputText,
  AppButton,
  Loading,
  rupeesIcon,
  GoBackHeader,
  ImagePreview,
} from '../../common';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { back_arrow_icon, cross_black_icon } from '../../../assets/images';
import {
  addNewBrand,
  addNewFabric,
  addNewType,
  getAutoCompleteData,
} from '../../../redux/actions/userActions';
import AutoCompleteModel from '../../common/AutoCompleteBox';
import SafeAreaView from 'react-native-safe-area-view';
import { setLoaderStatus } from '../../../redux/actions/dashboardAction';
import { uploadImageOnFirebase } from '../../../helper/firebaseMethods';
import {
  addNewProductToStore,
  getStoreProductList,
  removeProductFromStore,
  updateStoreProductDetail,
} from '../../../redux/actions/storeAction';

const ProductDetailScreen = (props) => {
  //---state variable---//
  const { data } = props.route.params;
  console.log('--data--', data);
  const scrollRef = useRef(null);
  const [rightTitleText, setRightTitleText] = useState('Edit');
  const [isItemEditing, setIsItemEditing] = useState(false);
  const defaultProductDetail = {
    inputName: data?.name ?? '',
    inputImages: '',
    inputBrandName: data?.brandName?.brandName ?? '',
    inputCategory: data?.category?.name ?? '',
    inputPrice: data?.price?.toString() ?? '',
    productColor: data?.primarycolor?.toString()?.toLowerCase() ?? '',
    inputColor: [],
    inputType: data?.type?.typeName ?? '',
    inputQuantity: data?.quantity ?? '',
    inputFabric: data?.fabric?.fabricName ?? '',
    inputDescription: data?.description ?? '',
    inputCatologue: '',
    inputSquantity: data?.s?.quantity?.toString() ?? '',
    inputMquantity: data?.m?.quantity?.toString() ?? '',
    inputLquantity: data?.l?.quantity?.toString() ?? '',
    inputXLquantity: data?.xl?.quantity?.toString() ?? '',
    inputXXLquantity: data?.xxl?.quantity?.toString() ?? '',
    inputXXXLquantity: data?.xxxl?.quantity?.toString() ?? '',
    inputSPrice: data?.s?.price ?? '',
    inputMPrice: data?.m?.price ?? '',
    inputLPrice: data?.l?.price ?? '',
    inputXLPrice: data?.xl?.price ?? '',
    inputXXLPrice: data?.xxl?.price ?? '',
    inputXXXLPrice: data?.xxxl?.price ?? '',
    inputQty: data?.quantity?.toString(),
    colorView: [],
    taskList: [],
    taskArray: [],
  };
  console.log(defaultProductDetail);
  let defaultImagesSetForValidation = ['', '', '', '', '', ''];
  let defaultImagesSet = ['', '', '', '', '', ''];
  let defaultImages = data?.images?.split(',');

  const isLoading = useSelector((state) => state.appDefaultSettingReducer.isLoading);
  const [productData, setProductData] = useState(defaultProductDetail);

  const [colorData, setColorData] = useState([]);
  const [colorPickerFlag, setColorPickerFlag] = useState(false);
  const [currentKeyForExtraColor, setCurrentKEyForExtraColor] = useState(0);
  const [colorPickerFlagForExtraColor, setColorPickerFlagForExtraColor] = useState(false);
  const [productImages, setProductImages] = useState([...defaultImages]);
  const [currentImages, setCurrentImages] = useState(null);
  const [imagePreviewFlag, setImagePreviewFlag] = useState(false);
  const [autoCompleteData, setAutoCompleteData] = useState([]);
  const [autoCompleteFlag, setAutoCompleteFlag] = useState(false);
  const [currentKey, setCurrentKey] = useState();
  const [setValues, setSelectedValues] = useState('');
  const [selectField, setSelectedField] = useState('');
  const [addNewBrandFormFlag, setAddNewBrandFormFlag] = useState(false);
  const [addNewFarbricFormFlag, setAddNewFabricFormFlag] = useState(false);
  const [addNewTypeFormFlag, setAddNewTypeFormFlag] = useState(false);
  const dispatch = useDispatch();
  const [isTextInputEditable, setIsTextInputEditable] = useState(false);
  //---state methods----//

  //---common methods---//
  useEffect(() => {
    defaultImages.map((item, index) => {
      defaultImagesSet[index] = item;
    });
    setProductImages([...defaultImagesSet]);
    dispatch(getAutoCompleteData()).then(async (res) => {
      console.log('repsonse--', res);
      if (res) {
        console.log('repsonse--', res);
        await setAutoCompleteData(res);
      }
    });
  }, []);
  const _setIsAutoCompleteModel = (value) => {
    setAutoCompleteFlag(value);
  };
  const _setAddNewFabricNameFlag = () => {
    setProductData({ ...productData, inputFabric: '' });
    setAddNewFabricFormFlag(true);
  };
  const _setAddNewTypeNameFlag = () => {
    setProductData({ ...productData, inputType: '' });
    setAddNewTypeFormFlag(true);
  };

  const _setCurrentKey = (key) => {
    setCurrentKey(key);
  };
  const _setAddNewBrandNameFlag = () => {
    setProductData({ ...productData, inputBrandName: '' });
    setAddNewBrandFormFlag(true);
  };
  const closeImagePreview = () => {
    setImagePreviewFlag(false);
  };

  const _setValuesForAutoCompelete = (Value, keyName, Label) => {
    setSelectedValues(Value);
    _setCurrentKey(keyName);
    setSelectedField(Label);
    setAutoCompleteFlag(true);
    _setCurrentKey(keyName);
  };
  const changeValue = () => {
    productData[currentKey] = setValues.toUpperCase();
  };
  const _setSelectedField = (value) => {};
  const _setSelectedValues = (value) => {
    setSelectedValues(value);
  };
  const updateProductDetail = () => {
    addNewProduct();
  };
  const removeProduct = () => {
      dispatch(
          removeProductFromStore({
              inputProductId: data?._id,
          })
      ).then((res) => {
          dispatch(getStoreProductList()).then((res) => {
              props.navigation.goBack();
          });
      });
  };
  const renderNameFloatingTextInput = (
    lable,
    value,
    key,
    extraLabel = null,
    isMultiLine = false,
    isAutoComplete = false,
    requireNumPadOnly = false
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
            editable={key === 'inputCategory' ? false : isTextInputEditable}
            value={value}
            // autoCapitalize="characters"
            extraLabel={extraLabel}
            onChangeText={(text) => {
              setProductData({ ...productData, [key]: text });
            }}
          />
        ) : (
          <FloatingLabel
            numberOfLines={1}
            inputStyle={style.floatingInputStyle}
            style={[style.floatingStyle]}
            label={lable + '  '}
            editable={key === 'inputCategory' ? false : isTextInputEditable}
            value={value}
            // autoCapitalize="characters"
            extraLabel={extraLabel}
            onChangeText={(text) => {
              setProductData({ ...productData, [key]: text });
            }}
            onFocus={() => {
              isTextInputEditable && isAutoComplete && Keyboard.dismiss();
              isTextInputEditable && isAutoComplete && setAutoCompleteFlag(true);
              isTextInputEditable &&
                isAutoComplete &&
                _setValuesForAutoCompelete(value, key, lable);
            }}
            keyboardType={requireNumPadOnly ? 'phone-pad' : 'phone-pad-name'}
          />
        )}
      </View>
    );
  };
  const renderNameFloatingTextInputForSelectionForColorPicker = (
    lable,
    value,
    key,
    extraLabel = null
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
        <FloatingLabel
          numberOfLines={1}
          inputStyle={[style.floatingInputStyle, { marginLeft: wp(10) }]}
          style={[style.floatingStyle]}
          label={lable + '  '}
          editable={isTextInputEditable}
          value={productData?.productColor?.toUpperCase() ?? ''}
          autoCapitalize="characters"
          extraLabel={extraLabel}
          onFocus={() => {
            Keyboard.dismiss();
            setColorPickerFlag(true);
          }}
        />
        {productData?.productColor !== '' && (
          <View
            style={{
              height: hp(4),
              position: 'absolute',
              marginTop: hp(2.5),
              width: hp(4),
              backgroundColor: productData?.productColor,
            }}
          />
        )}
      </View>
    );
  };
  const renderExtraColorView = (item, index) => {
    return (
      <View key={'MD' + index} style={{ flex: 1 }}>
        <View key={'CD' + index} style={[style.groupView]}>
          <View style={[style.innerView]}>
            <View
              style={{
                ...style.iconContainer,
                marginBottom: 0,
                borderBottomWidth: 1,
                borderBottomColor: color.gray,
                paddingVertical: hp(1),
              }}
            ></View>
            <View
              style={{
                flex: 1,
                borderBottomWidth: 1,
                borderBottomColor: color.gray,
                marginHorizontal: wp(0.5),
              }}
            >
              <View
                key={'HD' + index}
                style={{
                  flex: 1,
                  borderBottomWidth: 1,
                  borderBottomColor: color.gray,
                  marginHorizontal: wp(0.5),
                }}
              >
                <FloatingLabel
                  numberOfLines={1}
                  inputStyle={[style.floatingInputStyle, { marginLeft: wp(10) }]}
                  style={[style.floatingStyle]}
                  label={'COLOR'}
                  editable={isTextInputEditable}
                  value={item?.color.toString() ?? 'color'}
                  autoCapitalize="characters"
                  extraLabel={true}
                  onFocus={() => {
                    Keyboard.dismiss();
                    isTextInputEditable && setCurrentKEyForExtraColor(index);
                    isTextInputEditable && setColorPickerFlagForExtraColor(index);
                  }}
                />
                {item?.color !== '' && (
                  <View
                    style={{
                      height: hp(4),
                      position: 'absolute',
                      marginTop: hp(2.5),
                      width: hp(4),
                      backgroundColor: item?.color,
                    }}
                  />
                )}
              </View>
            </View>
          </View>
        </View>
        <View key={'GD' + index} style={[style.groupView]}>
          <View style={[style.innerView]}>
            <View
              style={{
                ...style.iconContainer,
                marginBottom: 0,
                borderBottomWidth: 1,
                borderBottomColor: color.gray,
                paddingVertical: hp(1),
              }}
            ></View>
            {item?.image !== '' && (
              <TouchableOpacity
                activeOpacity={0.8}
                style={{ alignItems: 'center' }}
                onPress={async () => {
                  await setCurrentImages([item?.image]);
                  setImagePreviewFlag(true);
                }}
              >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Image
                    resizeMode={'contain'}
                    style={{ height: hp(10), width: wp(80) }}
                    source={{ uri: item?.image }}
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View
          style={{
            marginTop: hp(1),
            height: hp(0.3),
            width: wp(100),
            alignSelf: 'center',
            backgroundColor: color.gray,
          }}
        />
      </View>
    );
  };
  const renderColorView = (key) => {
    return (
      <View key={'MD' + key} style={{ flex: 1 }}>
        <View key={'CD' + key} style={[style.groupView]}>
          <View style={[style.innerView]}>
            <View
              style={{
                ...style.iconContainer,
                marginBottom: 0,
                borderBottomWidth: 1,
                borderBottomColor: color.gray,
                paddingVertical: hp(1),
              }}
            ></View>
            <View
              style={{
                flex: 1,
                borderBottomWidth: 1,
                borderBottomColor: color.gray,
                marginHorizontal: wp(0.5),
              }}
            >
              <View
                key={key}
                style={{
                  flex: 1,
                  borderBottomWidth: 1,
                  borderBottomColor: color.gray,
                  marginHorizontal: wp(0.5),
                }}
              >
                <FloatingLabel
                  numberOfLines={1}
                  inputStyle={[style.floatingInputStyle, { marginLeft: wp(10) }]}
                  style={[style.floatingStyle]}
                  label={'COLOR'}
                  editable={isTextInputEditable}
                  value={colorData[key]?.color?.toString() ?? 'color'}
                  autoCapitalize="characters"
                  extraLabel={true}
                  onFocus={() => {
                    Keyboard.dismiss();
                    isTextInputEditable && setCurrentKEyForExtraColor(key);
                    isTextInputEditable && setColorPickerFlagForExtraColor(true);
                  }}
                />
                {colorData[key]?.color !== '' && (
                  <View
                    style={{
                      height: hp(4),
                      position: 'absolute',
                      marginTop: hp(2.5),
                      width: hp(4),
                      backgroundColor: colorData[key]['color'],
                    }}
                  />
                )}
              </View>
            </View>
          </View>
        </View>
        <View key={'GD' + key} style={[style.groupView]}>
          <View style={[style.innerView]}>
            <View
              style={{
                ...style.iconContainer,
                marginBottom: 0,
                borderBottomWidth: 1,
                borderBottomColor: color.gray,
                paddingVertical: hp(1),
              }}
            ></View>
            {colorData[key]?.image !== '' ? (
              <TouchableOpacity
                activeOpacity={0.8}
                style={{ alignItems: 'center' }}
                onPress={async () => {
                  pickImage();
                }}
              >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Image
                    resizeMode={'contain'}
                    style={{ height: hp(10), width: wp(80) }}
                    source={{ uri: colorData[key]?.image }}
                  />
                </View>
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  flex: 1,
                  borderBottomWidth: 1,
                  borderBottomColor: color.gray,
                  marginHorizontal: wp(0.5),
                }}
              >
                <View
                  key={key}
                  style={{
                    flex: 1,
                    borderBottomWidth: 1,
                    borderBottomColor: color.gray,
                    marginHorizontal: wp(0.5),
                  }}
                >
                  <FloatingLabel
                    numberOfLines={1}
                    inputStyle={[style.floatingInputStyle, { marginLeft: wp(10) }]}
                    style={[style.floatingStyle]}
                    label={'SELECT IMAGE'}
                    editable={isTextInputEditable}
                    value={colorData[key]?.image?.toString() ?? 'color'}
                    autoCapitalize="characters"
                    extraLabel={true}
                    onFocus={() => {
                      Keyboard.dismiss();
                      isTextInputEditable && setCurrentKEyForExtraColor(key);
                      isTextInputEditable && pickImage();
                    }}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ alignItems: 'center' }}
          onPress={() => {
            removeColor(key);
          }}
        >
          <View
            style={{
              width: wp(25),
              marginTop: hp(1),
              borderRadius: 100,
              alignSelf: 'center',
              height: hp(3),
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'orange',
            }}
          >
            <Text style={{ fontSize: normalize(14), fontWeight: '500' }}>REMOVE</Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            marginTop: hp(1),
            height: hp(0.3),
            width: wp(100),
            alignSelf: 'center',
            backgroundColor: color.gray,
          }}
        />
      </View>
    );
  };
  const addNewColor = async (key) => {
    let tempArrayForTaskList = colorData;
    let tempObj = {
      color: '',
      image: '',
    };
    tempArrayForTaskList.push(tempObj);
    await setColorData(tempArrayForTaskList);
    let textInput = productData.inputColor;
    textInput.push(renderColorView(key));
    setProductData({ ...productData, inputColor: textInput });
  };
  const removeColor = async (index) => {
    let tempArray = productData.inputColor;
    let tempTaskArray = colorData;
    if (index > -1) {
      tempArray.splice(index, 1);
      tempTaskArray.splice(index, 1);
      await setColorData(tempTaskArray);
      await setProductData({ ...productData, inputColor: tempArray });
      setCurrentKEyForExtraColor(index);
    }
  };
  const setExtraProductColor = async (value) => {
    let tempArray = [...colorData];
    tempArray[currentKeyForExtraColor]['color'] = value;
    await setColorData([...tempArray]);
    let textInput = productData.inputColor;
    textInput[currentKeyForExtraColor] = renderColorView(currentKeyForExtraColor);
    setProductData({ ...productData, inputColor: textInput });
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: isANDROID ? false : true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      let tempArray = [...colorData];
      tempArray[currentKeyForExtraColor]['image'] = result.uri;
      await setColorData([...tempArray]);
      let textInput = productData.inputColor;
      textInput[currentKeyForExtraColor] = renderColorView(currentKeyForExtraColor);
      setProductData({ ...productData, inputColor: textInput });
    }
  };
  const pickMainImages = async (index) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: isANDROID ? false : true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      let tempArray = productImages;
      tempArray[index] = result?.uri;
      await setProductImages([...tempArray]);
    }
  };
  const removeHash = (value) => {
    if (value === '') {
      return value;
    } else if (value.indexOf('#') < 0) {
      return value;
    } else {
      return value.substring(value.indexOf('#') + 1, value.length);
    }
  };

  const renderProductImages = ({ item, index }) => {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            pickMainImages(index);
          }}
        >
          {item === '' ? (
            <View style={style.imgView}>
              <Text style={{ fontSize: normalize(13) }}>
                {'select ' + parseInt(index + 1) + ' image'}
              </Text>
            </View>
          ) : (
            <Image resizeMode={'contain'} style={style.imgView} source={{ uri: item }} />
          )}
        </TouchableOpacity>
        {item !== '' && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={async () => {
              let tempArray = productImages;
              tempArray[index] = '';
              await setProductImages([...tempArray]);
            }}
          >
            <View
              style={{
                width: wp(15),
                marginTop: hp(1),
                borderRadius: 100,
                alignSelf: 'center',
                height: hp(5),
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'orange',
              }}
            >
              <Text style={{ fontSize: normalize(14), fontWeight: '500' }}>REMOVE</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  const addNewProductForm = () => {
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        // contentContainerStyle={{flex: 1}}
        enableAutomaticScroll={isIOS}
        scrollEnabled={true}
        extraScrollHeight={hp(-1)}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1 }}>
          <ScrollView
            ref={scrollRef}
            scrollEventThrottle={16}
            pagingEnabled={true}
            horizontal={true}
            scrollEnabled={true}
            nestedScrollEnabled={true}
          >
            {productImages &&
              productImages?.length > 0 &&
              productImages?.map((item) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={async () => {
                      await setCurrentImages(productImages);
                      setImagePreviewFlag(true);
                    }}
                  >
                    <View style={{ flex: 1, width: wp(100) }}>
                      <Image
                        resizeMode={'contain'}
                        style={style.productImage}
                        source={{ uri: item }}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>

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
              ></View>
              {renderNameFloatingTextInput(
                'PRODUCT NAME',
                productData.inputName,
                'inputName',
                true
              )}
            </View>
          </View>
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
              ></View>
              {renderNameFloatingTextInput(
                'BRAND',
                removeHash(productData.inputBrandName),
                'inputBrandName',
                true,
                false,
                true
              )}
              {renderNameFloatingTextInput(
                'CATEGORY',
                removeHash(productData.inputCategory),
                'inputCategory',
                true,
                false,
                true
              )}
            </View>
          </View>
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
              ></View>
              {renderNameFloatingTextInput(
                'PRICE',
                productData.inputPrice,
                'inputPrice',
                true,
                false,
                false,
                true
              )}
              {renderNameFloatingTextInputForSelectionForColorPicker(
                'COLOR',
                productData.productColor,
                'productColor',
                true
              )}
            </View>
          </View>
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
              ></View>
              {renderNameFloatingTextInput(
                'FABRIC',
                removeHash(productData?.inputFabric),
                'inputFabric',
                true,
                false,
                true
              )}
              {renderNameFloatingTextInput(
                'TYPE',
                removeHash(productData.inputType),
                'inputType',
                true,
                false,
                true
              )}
            </View>
          </View>
          {data?.category.name?.toUpperCase() !== 'SAREE' ? (
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
                  ></View>
                  {renderNameFloatingTextInput(
                    'S-QTY',
                    data?.s?.quantity?.toString(),
                    'inputSquantity',
                    true,
                    false,
                    false,
                    true
                  )}
                  {renderNameFloatingTextInput(
                    'S-SIZE-PRICE',
                    data?.s?.price?.toString(),
                    'inputMquantity',
                    true
                  )}
                </View>
              </View>
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
                  ></View>
                  {renderNameFloatingTextInput(
                    'M-QTY',
                    data?.m?.quantity?.toString(),
                    'inputLquantity',
                    true
                  )}
                  {renderNameFloatingTextInput(
                    'M-SIZE-PRICE',
                    data?.m?.price?.toString(),
                    'inputXLquantity',
                    true
                  )}
                </View>
              </View>
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
                  ></View>
                  {renderNameFloatingTextInput(
                    'L-QTY',
                    data?.l?.quantity?.toString(),
                    'inputXXLquantity',
                    true
                  )}
                  {renderNameFloatingTextInput(
                    'L-SIZE-PRICE',
                    data?.l?.price?.toString(),
                    'inputXXXLquantity',
                    true
                  )}
                </View>
              </View>
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
                  ></View>
                  {renderNameFloatingTextInput(
                    'XL-QTY',
                    data?.xl?.quantity?.toString(),
                    'inputSquantity',
                    true,
                    false,
                    false,
                    true
                  )}
                  {renderNameFloatingTextInput(
                    'XL-SIZE-PRICE',
                    data?.xl?.price?.toString(),
                    'inputMquantity',
                    true
                  )}
                </View>
              </View>
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
                  ></View>
                  {renderNameFloatingTextInput(
                    'XXL-QTY',
                    data?.xxl?.quantity?.toString(),
                    'inputLquantity',
                    true
                  )}
                  {renderNameFloatingTextInput(
                    'XXL-SIZE-PRICE',
                    data?.xxl?.price?.toString(),
                    'inputXLquantity',
                    true
                  )}
                </View>
              </View>
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
                  ></View>
                  {renderNameFloatingTextInput(
                    'XXXL-QTY',
                    data?.xxxl?.quantity?.toString(),
                    'inputXXLquantity',
                    true
                  )}
                  {renderNameFloatingTextInput(
                    'XXXL-SIZE-PRICE',
                    data?.xxxl?.price?.toString(),
                    'inputXXXLquantity',
                    true
                  )}
                </View>
              </View>
            </View>
          ) : (
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
                ></View>
                {renderNameFloatingTextInput(
                  'TOTAL-QTY',
                  productData?.inputQuantity?.toString(),
                  'inputQuantity',
                  true
                )}
              </View>
            </View>
          )}
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
              ></View>
              {renderNameFloatingTextInput(
                'DESCRIPTION',
                productData.inputDescription,
                'inputDescription',
                true,
                true
              )}
            </View>
          </View>
          {data?.colors?.items?.length > 0 && (
            <Text
              style={{
                fontSize: normalize(20),
                color: color.themeBtnColor,
                fontWeight: '700',
                textAlign: 'center',
              }}
            >
              Extra colors
            </Text>
          )}
          {data?.colors?.items.map((item, index) => {
            return renderExtraColorView(item, index);
          })}
          {/*<AppButton onPress={()=>{*/}
          {/*    addNewColor(productData.inputColor.length).then((res)=>{})*/}
          {/*}} title={productData.inputColor.length ===0?'ADD EXTRA COLOR':'ADD OTHER COLOR'}/>*/}

          <AppButton
            onPress={() => {
              removeProduct();
            }}
            containerStyle={{width:wp(30)}}
            title={'REMOVE THIS PRODUCT '}
          />
          <View style={{ height: hp(5) }} />
        </View>
      </KeyboardAwareScrollView>
    );
  };
  const addNewProductFormForEdit = () => {
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        // contentContainerStyle={{flex: 1}}
        enableAutomaticScroll={isIOS}
        scrollEnabled={true}
        extraScrollHeight={hp(-1)}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1 }}>
          <FlatList
            numColumns={2}
            horizontal={false}
            data={productImages}
            showsVerticalScrollIndicator={true}
            showsHorizontalScrollIndicator={true}
            renderItem={renderProductImages}
            keyExtractor={(item, index) => index.toString()}
          />
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
              ></View>
              {renderNameFloatingTextInput(
                'PRODUCT NAME',
                productData.inputName,
                'inputName',
                true
              )}
            </View>
          </View>
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
              ></View>
              {renderNameFloatingTextInput(
                'SELECT BRAND',
                removeHash(productData.inputBrandName),
                'inputBrandName',
                true,
                false,
                true
              )}
              {renderNameFloatingTextInput(
                'SELECT CATEGORY',
                removeHash(productData.inputCategory),
                'inputCategory',
                true,
                false,
                true
              )}
            </View>
          </View>
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
              ></View>
              {renderNameFloatingTextInput(
                'PRICE',
                productData.inputPrice,
                'inputPrice',
                true,
                false,
                false,
                true
              )}
              {renderNameFloatingTextInputForSelectionForColorPicker(
                'SELECT COLOR',
                productData.productColor,
                'productColor',
                true
              )}
            </View>
          </View>
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
              ></View>
              {renderNameFloatingTextInput(
                'SELECT FABRIC',
                removeHash(productData?.inputFabric),
                'inputFabric',
                true,
                false,
                true
              )}
              {renderNameFloatingTextInput(
                'SELECT TYPE',
                removeHash(productData.inputType),
                'inputType',
                true,
                false,
                true
              )}
            </View>
          </View>

          {productData?.inputCategory?.toLowerCase() !== 'saree' ? (
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
                  ></View>
                  {renderNameFloatingTextInput(
                    'S-QTY',
                    productData.inputSquantity,
                    'inputSquantity',
                    true,
                    false,
                    false,
                    true
                  )}
                  {renderNameFloatingTextInput(
                    'S-QTY-PRICE',
                    productData.inputSprice?.toString(),
                    'inputSprice',
                    true,
                    false,
                    false,
                    true
                  )}
                </View>
              </View>
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
                  ></View>
                  {renderNameFloatingTextInput(
                    'M-QTY',
                    productData.inputMquantity,
                    'inputMquantity',
                    true,
                    false,
                    false,
                    true
                  )}
                  {renderNameFloatingTextInput(
                    'M-QTY-PRICE',
                    productData.inputMprice,
                    'inputMprice',
                    true,
                    false,
                    false,
                    true
                  )}
                </View>
              </View>
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
                  ></View>
                  {renderNameFloatingTextInput(
                    'L-QTY',
                    productData.inputLquantity,
                    'inputLquantity',
                    true,
                    false,
                    false,
                    true
                  )}
                  {renderNameFloatingTextInput(
                    'L-QTY-PRICE',
                    productData.inputLprice,
                    'inputLprice',
                    true,
                    false,
                    false,
                    true
                  )}
                </View>
              </View>
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
                  ></View>
                  {renderNameFloatingTextInput(
                    'XL-QTY',
                    productData.inputXLquantity,
                    'inputXLquantity',
                    true,
                    false,
                    false,
                    true
                  )}
                  {renderNameFloatingTextInput(
                    'XL-QTY-PRICE',
                    productData.inputXLprice,
                    'inputXLprice',
                    true,
                    false,
                    false,
                    true
                  )}
                </View>
              </View>
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
                  ></View>
                  {renderNameFloatingTextInput(
                    'XXL-QTY',
                    productData.inputXXLquantity,
                    'inputXXLquantity',
                    true,
                    false,
                    false,
                    true
                  )}
                  {renderNameFloatingTextInput(
                    'XXL-QTY-PRICE',
                    productData.inputXXLprice,
                    'inputXXLprice',
                    true,
                    false,
                    false,
                    true
                  )}
                </View>
              </View>
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
                  ></View>
                  {renderNameFloatingTextInput(
                    'XXXL-QTY',
                    productData.inputXXXLquantity,
                    'inputXXXLquantity',
                    true,
                    false,
                    false,
                    true
                  )}
                  {renderNameFloatingTextInput(
                    'XXXL-QTY-PRICE',
                    productData.inputXXXLprice,
                    'inputXXXLprice',
                    true,
                    false,
                    false,
                    true
                  )}
                </View>
              </View>
            </View>
          ) : (
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
                ></View>
                {renderNameFloatingTextInput(
                  'TOTAL-QTY',
                  productData.inputQuantity?.toString(),
                  'inputQuantity',
                  true,
                  false,
                  false,
                  true
                )}
              </View>
            </View>
          )}

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
              ></View>
              {renderNameFloatingTextInput(
                'DESCRIPTION',
                productData.inputDescription,
                'inputDescription',
                true,
                true
              )}
            </View>
          </View>

          <AppButton
            containerStyle={{ marginTop: hp(1),width:wp(35) }}
            onPress={() => {
              updateProductDetail();
            }}
            title={'UPDATE'}
          />
          <View style={{ height: hp(5) }} />
        </View>
      </KeyboardAwareScrollView>
    );
  };

    const addNewProductFormForMobileDevice = () => {
        return (
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps="handled"
                // contentContainerStyle={{flex: 1}}
                enableAutomaticScroll={isIOS}
                scrollEnabled={true}
                extraScrollHeight={hp(-1)}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ flex: 1 }}>
                    <ScrollView
                        ref={scrollRef}
                        scrollEventThrottle={16}
                        pagingEnabled={true}
                        horizontal={true}
                        scrollEnabled={true}
                        nestedScrollEnabled={true}
                    >
                        {productImages &&
                        productImages?.length > 0 &&
                        productImages?.map((item) => {
                            return (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={async () => {
                                        await setCurrentImages(productImages);
                                        setImagePreviewFlag(true);
                                    }}
                                >
                                    <View style={{ flex: 1, width: wp(100) }}>
                                        <Image
                                            resizeMode={'contain'}
                                            style={style.productImage}
                                            source={{ uri: item }}
                                        />
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

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
                            ></View>
                            {renderNameFloatingTextInput(
                                'PRODUCT NAME',
                                productData.inputName,
                                'inputName',
                                true
                            )}
                        </View>
                    </View>
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
                            ></View>
                            {renderNameFloatingTextInput(
                                'BRAND',
                                removeHash(productData.inputBrandName),
                                'inputBrandName',
                                true,
                                false,
                                true
                            )}
                            {renderNameFloatingTextInput(
                                'CATEGORY',
                                removeHash(productData.inputCategory),
                                'inputCategory',
                                true,
                                false,
                                true
                            )}
                        </View>
                    </View>
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
                            ></View>
                            {renderNameFloatingTextInput(
                                'PRICE',
                                productData.inputPrice,
                                'inputPrice',
                                true,
                                false,
                                false,
                                true
                            )}
                            {renderNameFloatingTextInputForSelectionForColorPicker(
                                'COLOR',
                                productData.productColor,
                                'productColor',
                                true
                            )}
                        </View>
                    </View>
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
                            ></View>
                            {renderNameFloatingTextInput(
                                'FABRIC',
                                removeHash(productData?.inputFabric),
                                'inputFabric',
                                true,
                                false,
                                true
                            )}
                            {renderNameFloatingTextInput(
                                'TYPE',
                                removeHash(productData.inputType),
                                'inputType',
                                true,
                                false,
                                true
                            )}
                        </View>
                    </View>
                    {data?.category.name?.toUpperCase() !== 'SAREE' ? (
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
                                    ></View>
                                    {renderNameFloatingTextInput(
                                        'S-QTY',
                                        data?.s?.quantity?.toString(),
                                        'inputSquantity',
                                        true,
                                        false,
                                        false,
                                        true
                                    )}
                                    {renderNameFloatingTextInput(
                                        'S-SIZE-PRICE',
                                        data?.s?.price?.toString(),
                                        'inputMquantity',
                                        true
                                    )}
                                </View>
                            </View>
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
                                    ></View>
                                    {renderNameFloatingTextInput(
                                        'M-QTY',
                                        data?.m?.quantity?.toString(),
                                        'inputLquantity',
                                        true
                                    )}
                                    {renderNameFloatingTextInput(
                                        'M-SIZE-PRICE',
                                        data?.m?.price?.toString(),
                                        'inputXLquantity',
                                        true
                                    )}
                                </View>
                            </View>
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
                                    ></View>
                                    {renderNameFloatingTextInput(
                                        'L-QTY',
                                        data?.l?.quantity?.toString(),
                                        'inputXXLquantity',
                                        true
                                    )}
                                    {renderNameFloatingTextInput(
                                        'L-SIZE-PRICE',
                                        data?.l?.price?.toString(),
                                        'inputXXXLquantity',
                                        true
                                    )}
                                </View>
                            </View>
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
                                    ></View>
                                    {renderNameFloatingTextInput(
                                        'XL-QTY',
                                        data?.xl?.quantity?.toString(),
                                        'inputSquantity',
                                        true,
                                        false,
                                        false,
                                        true
                                    )}
                                    {renderNameFloatingTextInput(
                                        'XL-SIZE-PRICE',
                                        data?.xl?.price?.toString(),
                                        'inputMquantity',
                                        true
                                    )}
                                </View>
                            </View>
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
                                    ></View>
                                    {renderNameFloatingTextInput(
                                        'XXL-QTY',
                                        data?.xxl?.quantity?.toString(),
                                        'inputLquantity',
                                        true
                                    )}
                                    {renderNameFloatingTextInput(
                                        'XXL-SIZE-PRICE',
                                        data?.xxl?.price?.toString(),
                                        'inputXLquantity',
                                        true
                                    )}
                                </View>
                            </View>
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
                                    ></View>
                                    {renderNameFloatingTextInput(
                                        'XXXL-QTY',
                                        data?.xxxl?.quantity?.toString(),
                                        'inputXXLquantity',
                                        true
                                    )}
                                    {renderNameFloatingTextInput(
                                        'XXXL-SIZE-PRICE',
                                        data?.xxxl?.price?.toString(),
                                        'inputXXXLquantity',
                                        true
                                    )}
                                </View>
                            </View>
                        </View>
                    ) : (
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
                                ></View>
                                {renderNameFloatingTextInput(
                                    'TOTAL-QTY',
                                    productData?.inputQuantity?.toString(),
                                    'inputQuantity',
                                    true
                                )}
                            </View>
                        </View>
                    )}
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
                            ></View>
                            {renderNameFloatingTextInput(
                                'DESCRIPTION',
                                productData.inputDescription,
                                'inputDescription',
                                true,
                                true
                            )}
                        </View>
                    </View>
                    {data?.colors?.items?.length > 0 && (
                        <Text
                            style={{
                                fontSize: normalize(20),
                                color: color.themeBtnColor,
                                fontWeight: '700',
                                textAlign: 'center',
                            }}
                        >
                            Extra colors
                        </Text>
                    )}
                    {data?.colors?.items.map((item, index) => {
                        return renderExtraColorView(item, index);
                    })}
                    {/*<AppButton onPress={()=>{*/}
                    {/*    addNewColor(productData.inputColor.length).then((res)=>{})*/}
                    {/*}} title={productData.inputColor.length ===0?'ADD EXTRA COLOR':'ADD OTHER COLOR'}/>*/}

                    <AppButton
                        onPress={() => {
                            removeProduct();
                        }}
                        title={'REMOVE THIS PRODUCT '}
                    />
                    <View style={{ height: hp(5) }} />
                </View>
            </KeyboardAwareScrollView>
        );
    };
    const addNewProductFormForEditForMobileDevice = () => {
        return (
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps="handled"
                // contentContainerStyle={{flex: 1}}
                enableAutomaticScroll={isIOS}
                scrollEnabled={true}
                extraScrollHeight={hp(-1)}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ flex: 1 }}>
                    <FlatList
                        numColumns={2}
                        horizontal={false}
                        data={productImages}
                        showsVerticalScrollIndicator={true}
                        showsHorizontalScrollIndicator={true}
                        renderItem={renderProductImages}
                        keyExtractor={(item, index) => index.toString()}
                    />
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
                            ></View>
                            {renderNameFloatingTextInput(
                                'PRODUCT NAME',
                                productData.inputName,
                                'inputName',
                                true
                            )}
                        </View>
                    </View>
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
                            ></View>
                            {renderNameFloatingTextInput(
                                'SELECT BRAND',
                                removeHash(productData.inputBrandName),
                                'inputBrandName',
                                true,
                                false,
                                true
                            )}
                            {renderNameFloatingTextInput(
                                'SELECT CATEGORY',
                                removeHash(productData.inputCategory),
                                'inputCategory',
                                true,
                                false,
                                true
                            )}
                        </View>
                    </View>
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
                            ></View>
                            {renderNameFloatingTextInput(
                                'PRICE',
                                productData.inputPrice,
                                'inputPrice',
                                true,
                                false,
                                false,
                                true
                            )}
                            {renderNameFloatingTextInputForSelectionForColorPicker(
                                'SELECT COLOR',
                                productData.productColor,
                                'productColor',
                                true
                            )}
                        </View>
                    </View>
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
                            ></View>
                            {renderNameFloatingTextInput(
                                'SELECT FABRIC',
                                removeHash(productData?.inputFabric),
                                'inputFabric',
                                true,
                                false,
                                true
                            )}
                            {renderNameFloatingTextInput(
                                'SELECT TYPE',
                                removeHash(productData.inputType),
                                'inputType',
                                true,
                                false,
                                true
                            )}
                        </View>
                    </View>

                    {productData?.inputCategory?.toLowerCase() !== 'saree' ? (
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
                                    ></View>
                                    {renderNameFloatingTextInput(
                                        'S-QTY',
                                        productData.inputSquantity,
                                        'inputSquantity',
                                        true,
                                        false,
                                        false,
                                        true
                                    )}
                                    {renderNameFloatingTextInput(
                                        'S-QTY-PRICE',
                                        productData.inputSprice?.toString(),
                                        'inputSprice',
                                        true,
                                        false,
                                        false,
                                        true
                                    )}
                                </View>
                            </View>
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
                                    ></View>
                                    {renderNameFloatingTextInput(
                                        'M-QTY',
                                        productData.inputMquantity,
                                        'inputMquantity',
                                        true,
                                        false,
                                        false,
                                        true
                                    )}
                                    {renderNameFloatingTextInput(
                                        'M-QTY-PRICE',
                                        productData.inputMprice,
                                        'inputMprice',
                                        true,
                                        false,
                                        false,
                                        true
                                    )}
                                </View>
                            </View>
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
                                    ></View>
                                    {renderNameFloatingTextInput(
                                        'L-QTY',
                                        productData.inputLquantity,
                                        'inputLquantity',
                                        true,
                                        false,
                                        false,
                                        true
                                    )}
                                    {renderNameFloatingTextInput(
                                        'L-QTY-PRICE',
                                        productData.inputLprice,
                                        'inputLprice',
                                        true,
                                        false,
                                        false,
                                        true
                                    )}
                                </View>
                            </View>
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
                                    ></View>
                                    {renderNameFloatingTextInput(
                                        'XL-QTY',
                                        productData.inputXLquantity,
                                        'inputXLquantity',
                                        true,
                                        false,
                                        false,
                                        true
                                    )}
                                    {renderNameFloatingTextInput(
                                        'XL-QTY-PRICE',
                                        productData.inputXLprice,
                                        'inputXLprice',
                                        true,
                                        false,
                                        false,
                                        true
                                    )}
                                </View>
                            </View>
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
                                    ></View>
                                    {renderNameFloatingTextInput(
                                        'XXL-QTY',
                                        productData.inputXXLquantity,
                                        'inputXXLquantity',
                                        true,
                                        false,
                                        false,
                                        true
                                    )}
                                    {renderNameFloatingTextInput(
                                        'XXL-QTY-PRICE',
                                        productData.inputXXLprice,
                                        'inputXXLprice',
                                        true,
                                        false,
                                        false,
                                        true
                                    )}
                                </View>
                            </View>
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
                                    ></View>
                                    {renderNameFloatingTextInput(
                                        'XXXL-QTY',
                                        productData.inputXXXLquantity,
                                        'inputXXXLquantity',
                                        true,
                                        false,
                                        false,
                                        true
                                    )}
                                    {renderNameFloatingTextInput(
                                        'XXXL-QTY-PRICE',
                                        productData.inputXXXLprice,
                                        'inputXXXLprice',
                                        true,
                                        false,
                                        false,
                                        true
                                    )}
                                </View>
                            </View>
                        </View>
                    ) : (
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
                                ></View>
                                {renderNameFloatingTextInput(
                                    'TOTAL-QTY',
                                    productData.inputQuantity?.toString(),
                                    'inputQuantity',
                                    true,
                                    false,
                                    false,
                                    true
                                )}
                            </View>
                        </View>
                    )}

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
                            ></View>
                            {renderNameFloatingTextInput(
                                'DESCRIPTION',
                                productData.inputDescription,
                                'inputDescription',
                                true,
                                true
                            )}
                        </View>
                    </View>

                    <AppButton
                        containerStyle={{ marginTop: hp(1) }}
                        onPress={() => {
                            updateProductDetail();
                        }}
                        title={'UPDATE'}
                    />
                    <View style={{ height: hp(5) }} />
                </View>
            </KeyboardAwareScrollView>
        );
    };
  const setProductColor = async (value) => {
    productData.productColor = value;
  };

  const closeColorPicker = () => {
    setColorPickerFlag(false);
  };
  const closeColorPickerForExtraColor = () => {
    setColorPickerFlagForExtraColor(false);
  };
  const addNewBrandName = () => {
    if (productData.inputBrandName === '') {
      alert('please enter brand name');
      return;
    }
    setAddNewBrandFormFlag(false);
    dispatch(addNewBrand({ inputBrandName: productData.inputBrandName })).then((res) => {
      if (res) {
        dispatch(getAutoCompleteData()).then(async (data) => {
          if (data) {
            await setAutoCompleteData(data);
          }
        });
      } else {
        setProductData({ ...productData, inputBrandName: '' });
      }
    });
  };
  const addNewFabricName = () => {
    if (productData.inputFabric === '') {
      alert('please enter fabric name');
      return;
    }
    setAddNewFabricFormFlag(false);
    dispatch(addNewFabric({ inputFabric: productData.inputFabric })).then((res) => {
      if (res) {
        dispatch(getAutoCompleteData()).then(async (data) => {
          if (data) {
            await setAutoCompleteData(data);
          }
        });
      } else {
        setProductData({ ...productData, inputFabric: '' });
      }
    });
  };
  const getValueId = (value) => {
    console.log('input', value);
    if (value === '') {
      return value;
    } else if (value.indexOf('#') < 0) {
      console.log('called');
      return value;
    } else {
      return value.toString().substring(0, value.indexOf('#'));
    }
  };
  const uploadImage = (imageArray) => {
    return new Promise(async (resolve) => {
      let imageUrlArray = [];
      if (imageArray.length === 0) {
        resolve(false);
      } else {
        dispatch(setLoaderStatus(true));
        for (let i = 0; i < imageArray.length; i++) {
          console.log(imageArray[i].indexOf('http'));
          if (imageArray[i].indexOf('http') > -1) {
            imageUrlArray.push(imageArray[i]);
          } else {
            await uploadImageOnFirebase(imageArray[i]).then((imageUrl) => {
              if (imageUrl) {
                imageUrlArray.push(imageUrl);
              }
            });
          }

          if (i === imageArray.length - 1) {
            dispatch(setLoaderStatus(false));
            if (imageUrlArray.length > 0) {
              return resolve(imageUrlArray);
            } else {
              return resolve(false);
            }
          }
        }
      }
    });
  };
  const uploadExtraColorImages = (imageArray) => {
    return new Promise(async (resolve) => {
      let imageUrlArray = [];
      if (imageArray.length === 0) {
        resolve(false);
      } else {
        dispatch(setLoaderStatus(true));
        for (let i = 0; i < imageArray.length; i++) {
          await uploadImageOnFirebase(imageArray[i]?.image).then((imageUrl) => {
            if (imageUrl) {
              imageUrlArray.push({ color: imageArray[i]?.color, image: imageUrl });
            }
          });
          if (i === imageArray.length - 1) {
            dispatch(setLoaderStatus(false));
            if (imageUrlArray.length > 0) {
              return resolve(imageUrlArray);
            } else {
              return resolve(false);
            }
          }
        }
      }
    });
  };
  Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array) return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length) return false;

    for (var i = 0, l = this.length; i < l; i++) {
      // Check if we have nested arrays
      if (this[i] instanceof Array && array[i] instanceof Array) {
        // recurse into the nested arrays
        if (!this[i].equals(array[i])) return false;
      } else if (this[i] != array[i]) {
        // Warning - two different object instances will never be equal: {x:20} != {x:20}
        return false;
      }
    }
    return true;
  };
  const setStateValuesToDefault = () => {
    setProductData({ ...defaultProductDetail });
    setProductImages([...defaultImages]);
    setColorData([]);
  };

  const addNewProduct = async () => {
    if (productImages.equals(defaultImagesSetForValidation)) {
      alert('please select atlease one image for product');
      return;
    } else if (productData.inputName === '') {
      alert('please enter product name');
      return;
    } else if (productData.inputBrandName === '') {
      alert('please enter brand name');
      return;
    } else if (productData.inputCategory === '') {
      alert('please enter product category');
      return;
    } else if (productData.inputPrice === '' || isNaN(productData.inputPrice)) {
      alert('please enter product price');
      return;
    } else if (productData.inputColor === '') {
      alert('please select product color');
      return;
    } else if (productData.productColor === '') {
      alert('please select product color');
      return;
    } else if (productData.inputFabric === '') {
      alert('please select product fabric');
      return;
    } else if (productData.inputType === '') {
      alert('please select product type');
      return;
    } else if (
      removeHash(productData?.inputCategory) === 'SAREE' &&
      (productData.inputQuantity === '0' ||
        productData.inputQuantity === '' ||
        isNaN(productData.inputQuantity))
    ) {
      alert('please add atlease single quantity of product');
    } else if (
      removeHash(productData?.inputCategory).toString().toUpperCase() !== 'SAREE' &&
      (productData.inputSquantity === '' || isNaN(productData.inputSquantity))
    ) {
      alert('please enter 0 or more than 0 qty for S-Size');
    } else if (
      removeHash(productData?.inputCategory).toString().toUpperCase() !== 'SAREE' &&
      (productData.inputMquantity === '' || isNaN(productData.inputMquantity))
    ) {
      alert('please enter 0 or more than 0 qty for M-Size');
    } else if (
      removeHash(productData?.inputCategory).toString().toUpperCase() !== 'SAREE' &&
      (productData.inputLquantity === '' || isNaN(productData.inputLquantity))
    ) {
      alert('please enter 0 or more than 0 qty for L-Size');
    } else if (
      removeHash(productData?.inputCategory).toString().toUpperCase() !== 'SAREE' &&
      (productData.inputXLquantity === '' || isNaN(productData.inputXLquantity))
    ) {
      alert('please enter 0 or more than 0 qty for XL-Size');
    } else if (
      removeHash(productData?.inputCategory).toString().toUpperCase() !== 'SAREE' &&
      (productData.inputXXLquantity === '' || isNaN(productData.inputXXLquantity))
    ) {
      alert('please enter 0 or more than 0 qty for XXL-Size');
    } else if (
      removeHash(productData?.inputCategory).toString().toUpperCase() !== 'SAREE' &&
      (productData.inputXXXLquantity === '' || isNaN(productData.inputXXXLquantity))
    ) {
      alert('please enter 0 or more than 0 qty for XXXL-Size');
    } else if (
      removeHash(productData?.inputCategory).toString().toUpperCase() !== 'SAREE' &&
      (productData.inputSPrice === '' || isNaN(productData.inputSPrice))
    ) {
      alert('please enter product price for S-SIZE');
      return;
    } else if (
      removeHash(productData?.inputCategory).toString().toUpperCase() !== 'SAREE' &&
      (productData.inputMPrice === '' || isNaN(productData.inputMPrice))
    ) {
      alert('please enter product price for M-SIZE');
      return;
    } else if (
      removeHash(productData?.inputCategory).toString().toUpperCase() !== 'SAREE' &&
      (productData.inputLPrice === '' || isNaN(productData.inputLPrice))
    ) {
      alert('please enter product price for L-SIZE');
      return;
    } else if (
      removeHash(productData?.inputCategory).toString().toUpperCase() !== 'SAREE' &&
      (productData.inputXLPrice === '' || isNaN(productData.inputXLPrice))
    ) {
      alert('please enter product price for XL-SIZE');
      return;
    } else if (
      removeHash(productData?.inputCategory).toString().toUpperCase() !== 'SAREE' &&
      (productData.inputXXLPrice === '' || isNaN(productData.inputXXLPrice))
    ) {
      alert('please enter product price for XXL-SIZE');
      return;
    } else if (
      removeHash(productData?.inputCategory).toString().toUpperCase() !== 'SAREE' &&
      (productData.inputXXXLPrice === '' || isNaN(productData.inputXXXLPrice))
    ) {
      alert('please enter product price for XXXL-SIZE');
      return;
    } else if (
      removeHash(productData?.inputCategory) !== 'SAREE' &&
      parseInt(productData.inputQuantity) +
        parseInt(productData.inputSquantity) +
        parseInt(productData.inputMquantity) +
        parseInt(productData.inputLquantity) +
        parseInt(productData.inputXLquantity) +
        parseInt(productData.inputXXLquantity) ===
        0
    ) {
      alert('please add atleaset single quantity of product');
    } else if (productData.inputDescription === '') {
      alert('please add product description');
    } else {
      if (removeHash(productData?.inputCategory)?.toString()?.toUpperCase() !== 'SAREE') {
        let insNewProductObj = {
          inputProductId: data?._id,
          inputProductName: productData?.inputName ?? '',
          inputBrandId: removeHash(productData.inputBrandName),
          inputCategory: removeHash(productData.inputCategory),
          inputProductPrice: productData?.inputPrice,
          productColor: productData?.productColor,
          inputColorFlag: false,
          inputType: removeHash(productData.inputType),
          inputQuantity:
            parseInt(productData.inputSquantity) +
            parseInt(productData.inputMquantity) +
            parseInt(productData.inputLquantity) +
            parseInt(productData.inputXLquantity) +
            parseInt(productData.inputXXLquantity),
          inputFabric: removeHash(productData.inputFabric),
          inputDescription: productData.inputDescription,
          inputCatologue: 'not know',
          inputSquantity: productData?.inputSquantity ?? 0,
          inputMquantity: productData?.inputMquantity ?? 0,
          inputLquantity: productData?.inputLquantity ?? 0,
          inputXLquantity: productData?.inputXLquantity ?? 0,
          inputXXLquantity: productData?.inputXXLquantity ?? 0,
          inputXXXLquantity: productData?.inputXXXLquantity ?? 0,
          inputSprice: productData?.inputSPrice ?? 0,
          inputLprice: productData?.inputLPrice ?? 0,
          inputMprice: productData?.inputMPrice ?? 0,

          inputXLprice: productData?.inputXLPrice ?? 0,

          inputXXLprice: productData?.inputXXLPrice ?? 0,

          inputXXXLprice: productData?.inputXXLPrice ?? 0,
        };

        uploadImage(productImages).then(async (imageUrlArray) => {
          if (imageUrlArray) {
            insNewProductObj = { ...insNewProductObj, inputProductImages: imageUrlArray.join() };
          }
          console.log('--new prod from here', insNewProductObj);

          dispatch(updateStoreProductDetail({ ...insNewProductObj })).then((res) => {
            if (res) {
              dispatch(getStoreProductList()).then((res) => {
                if (res) {
                  alert('Your product details is updated added successfully...!');
                  props.navigation.goBack();
                } else {
                  alert('Fail to update');
                  setStateValuesToDefault();
                  setIsItemEditing(false);
                  setRightTitleText('Edit');
                }
              });
            }
          });
        });
      } else {
        let insNewProductObj = {
          inputProductId: data?._id,
          inputProductName: productData?.inputName ?? '',
          inputBrandId: removeHash(productData.inputBrandName),
          inputCategory: removeHash(productData.inputCategory),
          inputProductPrice: productData?.inputPrice,
          productColor: productData?.productColor,
          inputColorFlag: false,
          inputType: removeHash(productData.inputType),
          inputQuantity: productData.inputQuantity,

          inputFabric: removeHash(productData.inputFabric),
          inputDescription: productData.inputDescription,
          inputCatologue: 'not know',
        };

        uploadImage(productImages).then(async (imageUrlArray) => {
          if (imageUrlArray) {
            insNewProductObj = { ...insNewProductObj, inputProductImages: imageUrlArray.join() };
          }
          console.log('--new prod from here', insNewProductObj);

          dispatch(updateStoreProductDetail({ ...insNewProductObj })).then((res) => {
            if (res) {
              dispatch(getStoreProductList()).then((res) => {
                if (res) {
                  alert('Your product details is updated added successfully...!');
                  props.navigation.goBack();
                } else {
                  alert('Fail to update');
                  setStateValuesToDefault();
                  setIsItemEditing(false);
                  setRightTitleText('Edit');
                }
              });
            }
          });
        });
      }
    }
  };
  const onRightTitlePress = async () => {
    if (isItemEditing) {
      await setRightTitleText('Edit');
      await setIsItemEditing(!isItemEditing);
      await setIsTextInputEditable(false);
    } else {
      await setRightTitleText('Cancel');
      await setIsItemEditing(!isItemEditing);
      await setIsTextInputEditable(true);
    }
  };
  const addNewTypeName = () => {
    if (productData.inputType === '') {
      alert('please enter valid type name');
      return;
    }
    setAddNewTypeFormFlag(false);
    dispatch(addNewType({ inputType: productData.inputType })).then((res) => {
      if (res) {
        dispatch(getAutoCompleteData()).then(async (data) => {
          if (data) {
            await setAutoCompleteData(data);
          }
        });
      } else {
        setProductData({ ...productData, inputType: '' });
      }
    });
  };

  return (
    <View style={{ flex: 1 }}>
      {isLoading && <Loading isLoading={isLoading} />}
      {imagePreviewFlag && (
        <ImagePreview imgArray={currentImages} setPreviewClose={closeImagePreview} />
      )}
      {autoCompleteFlag && (
        <AutoCompleteModel
          allSearchData={autoCompleteData && autoCompleteData}
          _setIsAutoCompleteModel={_setIsAutoCompleteModel}
          _setAddNewBrandNameFlag={_setAddNewBrandNameFlag}
          _setAddNewFabricNameFlag={_setAddNewFabricNameFlag}
          _setAddNewTypeNameFlag={_setAddNewTypeNameFlag}
          SearchField={setValues}
          changeValue={changeValue}
          selectField={selectField}
          _setSelectedField={_setSelectedField}
          _setSelectedValues={_setSelectedValues}
          currentKey={currentKey}
          // selectedValue={User[currentKey]}
        />
      )}
      {addNewBrandFormFlag && (
        <Modal
          onRequestClose={() => setAddNewBrandFormFlag(false)}
          animated={true}
          transparent={false}
          visible={true}
        >
          <SafeAreaView style={{ flex: 1,width:wp(60), justifyContent: 'center', padding: hp(1) }}>
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
                  setAddNewBrandFormFlag(false);
                  setProductData({ ...productData, inputBrandName: '' });
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
                    'Brand Name',
                    productData.inputBrandName,
                    'inputBrandName',
                    true,
                    null,
                    false
                  )}
                </View>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  addNewBrandName();
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
                  <Text style={{ fontWeight: '900', fontSize: normalize(16), color: color.white }}>
                    ADD
                  </Text>
                </View>
              </TouchableOpacity>
            </KeyboardAwareScrollView>
          </SafeAreaView>
        </Modal>
      )}
      {addNewFarbricFormFlag && (
        <Modal
          onRequestClose={() => setAddNewFabricFormFlag(false)}
          animated={true}
          transparent={false}
          visible={true}
        >
          <SafeAreaView style={{ flex: 1,width:wp(60), justifyContent: 'center', padding: hp(1) }}>
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
                  setAddNewFabricFormFlag(false);
                  setProductData({ ...productData, inputFabric: '' });
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
                    'Fabric Name',
                    productData.inputFabric,
                    'inputFabric',
                    true,
                    null,
                    false
                  )}
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  addNewFabricName();
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
                  <Text style={{ fontWeight: '900', fontSize: normalize(16), color: color.white }}>
                    ADD
                  </Text>
                </View>
              </TouchableOpacity>
            </KeyboardAwareScrollView>
          </SafeAreaView>
        </Modal>
      )}
      {addNewTypeFormFlag && (
        <Modal
          onRequestClose={() => setAddNewTypeFormFlag(false)}
          animated={true}
          transparent={false}
          visible={true}
        >
          <SafeAreaView style={{ flex: 1,width:wp(60), justifyContent: 'center', padding: hp(1) }}>
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
                  setAddNewTypeFormFlag(false);
                  setProductData({ ...productData, inputType: '' });
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
                    'Type Name',
                    productData.inputType,
                    'inputType',
                    true,
                    null,
                    false
                  )}
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  addNewTypeName();
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
                  <Text style={{ fontWeight: '900', fontSize: normalize(16), color: color.white }}>
                    ADD
                  </Text>
                </View>
              </TouchableOpacity>
            </KeyboardAwareScrollView>
          </SafeAreaView>
        </Modal>
      )}
      <GoBackHeader
        rightTitle={rightTitleText}
        rightTitlePress={onRightTitlePress}
        title={'Detail'}
        onMenuPress={() => props.navigation.goBack()}
      />

      {isItemEditing ? (IsIOSOS || IsAndroidOS)?addNewProductFormForEditForMobileDevice():addNewProductFormForEdit() :(IsIOSOS || IsAndroidOS)?addNewProductFormForMobileDevice(): addNewProductForm()}

      {colorPickerFlag && (
        <CustomColorPicker
          closeColorPicker={closeColorPicker}
          setCurrentColor={(value) => setProductColor(value)}
        />
      )}
      {colorPickerFlagForExtraColor && (
        <CustomColorPicker
          closeColorPicker={closeColorPickerForExtraColor}
          setCurrentColor={(value) => setExtraProductColor(value)}
        />
      )}
    </View>
  );
};

const style = StyleSheet.create({
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
  center: {
    alignItems: 'center',
    justifyContent: 'center',
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
    // backgroundColor: color.creamDarkGray,
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
  productImage: {
    height: hp(50),
    width: wp(100),
  },
  imgView: {
    height: hp(15),
    width: wp(45),
    marginTop: hp(1),
    backgroundColor: color.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  validationStart: { position: 'absolute', color: 'red', marginLeft: wp(16), marginTop: hp(0.5) },
  radioButtonOutterCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(3),
    width: hp(3),
    borderRadius: hp(1.5),
    borderWidth: hp(0.2),
  },
  radioButtonInnerCircle: {
    height: hp(1.6),
    width: hp(1.6),
    borderRadius: hp(0.8),
    backgroundColor: color.themePurple,
  },
});
export default ProductDetailScreen;
