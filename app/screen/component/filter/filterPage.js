import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

import RangeSlider, { Slider } from 'react-native-range-slider-expo';
import {color, font, hp, isANDROID, IsAndroidOS, IsIOSOS, normalize, wp} from '../../../helper/themeHelper';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  ScrollView,
  BackHandler,
  Modal,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { Loading, GoBackHeader } from '../../common';
import {
  // filterMembers,
  // filterMembersForCount,
  defaultFilterObject,
  colorArray,
} from '../../../helper/constant';
import { getAutoCompleteData } from '../../../redux/actions/userActions';
import { getFilterData } from '../../../redux/actions/homeScreenActions';

const defaultFilterObj = {
  ...defaultFilterObject,
  // foundResult:
};
let tempCategoiesList = [];
let tempBrandList = [];
let tempStoreList = [];
let tempColorList = [];
let tempTypeList = [];
let tempFabricList = [];
let tempIndex = 0;

Array.prototype.remove = function () {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};
const FilterPage = (props) => {
  const isLoading = useSelector((state) => state.appDefaultSettingReducer.isLoading);

  const {
    categories,
    stores,
    brandList,
    types,
    fabric,
    setFilter,
    currentFilter,
    setFlagForFilter,
    setDataForFilter,
  } = props.route.params;
  const [searchData, setSearchData] = useState({
    categories: categories,
    stores: stores,
    brandList: brandList,
    types: types,
    fabric: fabric,
    colorArray: colorArray,
  });

  const dispatch = useDispatch();
  const [filterObj, setFilterObj] = useState({ ...defaultFilterObj });
  const [maxPrice, setMaxPrice] = useState(10000);
  const [minPrice, setMinPrice] = useState(0);
  const [loader, setLoader] = useState(false);
  const [currentIndexToCallApi, setCurrentIndexToCallApi] = useState(0);
  const [initialIndexFlag, setInitialIndexFlag] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [resultItem, setResultItem] = useState({});
  const [fromValue, setFromValue] = useState(0);
  const [toValue, setToValue] = useState(10000);
  const [value, setValue] = useState(0);
  const [scrollEnabledFlag, setSrollEnabledFlag] = useState(true);

  useEffect(() => {
    if (_.isEqual(currentFilter, defaultFilterObj)) {
      tempFabricList = [];
      tempTypeList = [];
      tempColorList = [];
      tempBrandList = [];
      tempStoreList = [];
      tempCategoiesList = [];
      tempIndex = 0;
    }
  }, [currentIndexToCallApi, setCurrentIndexToCallApi]);
  const handleBackPress = () => {
    setDataForFilter([]);
    setFlagForFilter(false);
    setFilter({ ...defaultFilterObj });
    setDefaultTempArray();
    props.navigation.goBack();
    return true;
  };

  useEffect(() => {
    setArrayData(currentFilter);
    // BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    // return () => BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
  }, []);
  const [isShowDatePicker, setIsShowDatePicker] = useState(false);
  const [arrayData, setArrayData] = useState({
    ...defaultFilterObj,
    foundResult: 0,
  });
  const keyBoardViewRef = useRef(null);
  const flatListRef = useRef(null);
  const flatListRefCatogaries = useRef(null);
  const flatListRefStore = useRef(null);
  const flatListRefBrand = useRef(null);
  const flatListRefColor = useRef(null);
  const flatListRefFabric = useRef(null);
  const flatListRefType = useRef(null);

  const [dateForDatePicker, setDateForDatePicker] = useState({});
  const [currentKey, setCurrentKey] = useState();

  const {
    mainView,
    buttonStyle,
    buttonTextStyle,
    filterButton,
    filterText,
    headerText,
    backLine,
    closeIcon,
  } = style;

  const _setIsShowDatePicker = (value) => {
    setIsShowDatePicker(value);
  };
  const _setDateForDatePicker = (key) => {
    setDateForDatePicker(arrayData[key]);
    setCurrentKey(key);
  };

  const _setDateFromKey = (value) => {
    _setIsShowDatePicker(false);
    if (currentKey === 'maxDate') {
      // setArrayData({...arrayData, maxDateFlag: true});
      arrayData.maxDateFlag = true;
    }
    if (currentKey === 'minDate') {
      // setArrayData({...arrayData, minDateFlag: true});
      arrayData.minDateFlag = true;
    }
    setArrayData({ ...arrayData, [currentKey]: value });
    arrayData[currentKey] = value;
  };
  // const setToDefaultValue = () => {
  //   setDataForFilter([]);
  //   setFlagForFilter(false);
  //   setFilter({ ...defaultFilterObj });
  // };

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
  const setToDefaultValue = () => {
    setDataForFilter([]);
    setFlagForFilter(false);
    setFilter({ ...defaultFilterObj });
  };
  const fetchFilterData = async (filterObject) => {
    // setLoaderTrue();
    // setLoader(true);
    let filterFields = {};
    filterFields = { ...filterFields, inputStartPrice: fromValue, inputEndPrice: toValue };
    if (filterObject.brandList != null && filterObject.brandList.length > 0) {
      let tempDataArray = [];
      filterObject.brandList.map((item) => {
        tempDataArray.push(item?._id);
      });
      filterFields = { ...filterFields, inputBrandId: tempDataArray };
    }
    if (filterObject.categories != null && filterObject.categories.length > 0) {
      let tempDataArray = [];
      filterObject.categories.map((item) => {
        tempDataArray.push(item?._id);
      });
      filterFields = { ...filterFields, inputCategouryId: tempDataArray };
    }
    if (filterObject.stores != null && filterObject.stores.length > 0) {
      let tempDataArray = [];
      filterObject.stores.map((item) => {
        tempDataArray.push(item?._id);
      });
      filterFields = { ...filterFields, inputStoreId: tempDataArray };
    }
    if (filterObject.colorArray != null && filterObject.colorArray.length > 0) {
      let tempDataArray = [];
      filterObject.colorArray.map((item) => {
        tempDataArray.push(item?.colorName);
      });
      filterFields = { ...filterFields, inputColor: tempDataArray };
    }
    if (filterObject.fabric != null && filterObject.fabric.length > 0) {
      let tempDataArray = [];
      filterObject.fabric.map((item) => {
        tempDataArray.push(getValueId(item));
      });
      filterFields = { ...filterFields, inputFabricId: tempDataArray };
    }
    if (filterObject.types != null && filterObject.types.length > 0) {
      let tempDataArray = [];
      filterObject.types.map((item) => {
        tempDataArray.push(getValueId(item));
      });
      filterFields = { ...filterFields, inputTypeId: tempDataArray };
    }
      dispatch(getFilterData(filterFields))
      .then((res) => {
        if (res) {
          if (res.length > 0) {
            setFilter(arrayData);
            setFlagForFilter(true);
            setDataForFilter(res);
            if (res && typeof res !== 'undefined') {
              setArrayData({ ...arrayData, foundResult: res.length });
            }
            arrayData.foundResult = res.length;
            setLoader(false);
            setTimeout(() => {
              props.navigation.goBack();
            }, 200);
          } else {
            alert('No Product Found..');
            setToDefaultValue();
          }
        } else {
          alert('No Product Found..');
          setToDefaultValue();
        }
      })
      .catch((err) => {
        alert('No Product Found..');
        setToDefaultValue();
      });

    // console.log('filter obj', filterObject);
  };

  const createFilterObject = (filterObject) => {
    let filterFields = {};
    if (filterObject.maritalStatus != null && filterObject.maritalStatus.length > 0) {
      filterFields = { ...filterFields, MaritalStatus: filterObject.maritalStatus };
    }
    if (filterObject.familyDaughter != null && filterObject.familyDaughter.length > 0) {
      filterFields = { ...filterFields, IsDaughter: filterObject.familyDaughter };
    }
    if (filterObject.gender != null && filterObject.gender.length > 0) {
      filterFields = { ...filterFields, Gender: filterObject.gender };
    }

    if (filterObject.state != null && filterObject.state.length > 0) {
      filterFields = { ...filterFields, State: filterObject.state };
    }

    if (filterObject.country != null && filterObject.country.length > 0) {
      filterFields = { ...filterFields, Country: filterObject.country };
    }

    if (filterObject.nativePlace != null && filterObject.nativePlace.length > 0) {
      filterFields = { ...filterFields, NativePlace: filterObject.nativePlace };
    }
    if (filterObject.city != null && filterObject.city.length > 0) {
      filterFields = { ...filterFields, City: filterObject.city };
    }
    if (filterObject.familyHead != null && filterObject.familyHead.length > 0) {
      filterFields = { ...filterFields, FamilyHead: filterObject.familyHead };
    }
    if (filterObject.minDateFlag) {
      filterFields = { ...filterFields, MinDate: filterObject.minDate };
    }
    if (filterObject.maxDateFlag) {
      filterFields = { ...filterFields, MaxDate: filterObject.maxDate };
    }
    if (filterObject.MinAge !== 0) {
      filterFields = { ...filterFields, MinAge: filterObject.MinAge };
    }
    if (filterObject.MaxAge !== 100 && filterObject.MaxAge > 0) {
      filterFields = { ...filterFields, MaxAge: filterObject.MaxAge };
    }
    return filterFields;
  };
  const getItemLayout = (data, index) => {
    return {
      length: wp(30),
      offset: wp(30) * index,
      index,
    };
  };

  const renderRow = (
    dataArray,
    tempArray,
    key,
    label,
    selectedIndex = 0,
    firstRow = false,
    reference = null
  ) => {
    return (
      <View style={{ flex: 1, marginTop: firstRow ? hp(0) : hp(1.5) }}>
        <View>
          <View style={backLine} />
          <Text style={headerText}>{'  ' + label + '  '}</Text>
        </View>
        <FlatList
          ref={reference === null ? flatListRef : reference}
          horizontal={true}
          data={dataArray}
          showsVerticalScrollIndicator={false}
          initialScrollIndex={selectedIndex}
          getItemLayout={(data, index) => getItemLayout(data, index)}
          renderItem={({ item, index }) => (
            <TouchableWithoutFeedback
              style={{ flex: 1 }}
              onPress={() => {
                if (arrayData[key].indexOf(item) < 0) {
                  tempArray.push(item);
                } else {
                  tempArray.remove(item);
                }
                setArrayData({ ...arrayData, [key]: tempArray });
                arrayData[key] = tempArray;
              }}
            >
              <View
                style={[
                  buttonStyle,
                  {
                    backgroundColor:
                      tempArray.indexOf(item) > -1 ? color.themePurple : color.lightGray,
                    width: dataArray.length < 3 ? wp(44) : wp(30),
                    marginLeft: index !== 0 ? wp(1) : 0,
                  },
                ]}
              >
                <Text
                  style={[
                    buttonTextStyle,
                    {
                      color: tempArray.indexOf(item) > -1 ? color.white : color.black,
                    },
                  ]}
                >
                  {item}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  };

  const setDefaultTempArray = () => {
    tempBrandList = [];
    tempCategoiesList = [];
    tempStoreList = [];
    tempColorList = [];
  };
  const onRightPress = () => {
    // rangeSlider.setLowValue(0);
    // rangeSlider.setHighValue(100);
    setDefaultTempArray();
    setFilterObj({ ...defaultFilterObj });
    setArrayData({ ...defaultFilterObj });
    arrayData['MaxAge'] = 100;
    arrayData['MinAge'] = 0;
    arrayData['city'] = [];
    arrayData['state'] = [];
    arrayData['country'] = [];
    arrayData['familyDaughter'] = [];
    arrayData['familyHead'] = [];
    arrayData['gender'] = [];
    arrayData['maritalStatus'] = [];
    arrayData['maxDate'] = new Date();
    arrayData['minDate'] = new Date();
    arrayData['maxDateFlag'] = false;
    arrayData['minDateFlag'] = false;
    arrayData['nativePlace'] = [];
    setSrollEnabledFlag(true);
    setInitialIndexFlag(true);

    flatListRef &&
      flatListRef !== null &&
      flatListRef.current !== null &&
      flatListRef.current.scrollToOffset({ x: 0, y: 0, animated: false });

    flatListRefCountry &&
      flatListRefCountry !== null &&
      flatListRefCountry.current !== null &&
      flatListRefCountry.current.scrollToOffset({ x: 0, y: 0, animated: false });

    flatListRefMarital &&
      flatListRefMarital !== null &&
      flatListRefMarital.current !== null &&
      flatListRefMarital.current.scrollToOffset({ x: 0, y: 0, animated: false });

    flatListRefNative &&
      flatListRefNative !== null &&
      flatListRefNative.current !== null &&
      flatListRefNative.current.scrollToOffset({ x: 0, y: 0, animated: false });

    flatListRefState &&
      flatListRefState !== null &&
      flatListRefState.current !== null &&
      flatListRefState.current.scrollToOffset({ x: 0, y: 0, animated: false });

    flatListRefCity &&
      flatListRefCity !== null &&
      flatListRefCity.current !== null &&
      flatListRefCity.current.scrollToOffset({ x: 0, y: 0, animated: false });
    flatListRefCast &&
      flatListRefCast !== null &&
      flatListRefCast.current !== null &&
      flatListRefCast.current.scrollToOffset({ x: 0, y: 0, animated: false });

    flatListRefTrustFactor &&
      flatListRefTrustFactor !== null &&
      flatListRefTrustFactor.current !== null &&
      flatListRefTrustFactor.current.scrollToOffset({ x: 0, y: 0, animated: false });

    flatListRefDistrict &&
      flatListRefDistrict !== null &&
      flatListRefDistrict.current !== null &&
      flatListRefDistrict.current.scrollToOffset({ x: 0, y: 0, animated: false });

    setResultItem({});
  };
  const getSelectedIndex = (key, dataArray) => {
    let tempIndex = 0;
    if (arrayData[key].length > 0) {
      let selectedValue = arrayData[key][0];
      tempIndex = dataArray.indexOf(selectedValue);
    }
    return tempIndex;
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

  return (
    <View style={{ flex: 1 }}>
      {isLoading && <Loading isLoading={isLoading} />}
      {loader && (
        <Modal animated={false} style={{ flex: 1 }} visible={true} transparent={true}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator animating={loader} size={'large'} color={'gray'} />
          </View>
        </Modal>
      )}
      <GoBackHeader
        title={'Filter' + '  '}
        onMenuPress={() => {
          // setDataForFilter([]);
          // setFlagForFilter(false);
          // setFilter({ ...defaultFilterObj });
          // setArrayData({ ...defaultFilterObject, foundResult: 0 });
          // setDefaultTempArray();
          props.navigation.goBack();
        }}
        rightTitle={'Clear' + ' '}
        rightPress={onRightPress}
      />
      <View style={{ padding: wp(5), flex: 1 }}>
        <View style={[mainView]}>
          <ScrollView
            ref={keyBoardViewRef}
            scrollEnabled={scrollEnabledFlag}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            <View style={{ flex: 1, marginTop: hp(1.5), }}>
              <View>
                <View style={backLine} />
                <Text style={headerText}>{'Categoires'}</Text>
              </View>
              <View style={{ height: hp(2) }} />
              <FlatList
                ref={flatListRefCatogaries}
                horizontal={true}
                data={searchData.categories}
                showsVerticalScrollIndicator={true}
                initialScrollIndex={0}
                getItemLayout={(data, index) => getItemLayout(data, index)}
                renderItem={({ item, index }) => (
                  <TouchableWithoutFeedback
                    style={{ flex: 1 }}
                    onPress={() => {
                      if (arrayData['categories'].indexOf(item) < 0) {
                        tempCategoiesList.push(item);
                      } else {
                        tempCategoiesList.remove(item);
                      }
                      setArrayData({ ...arrayData, ['categories']: tempCategoiesList });
                      arrayData['categories'] = tempCategoiesList;
                    }}
                  >
                    <View
                      style={[
                        buttonStyle,
                        {
                          backgroundColor:
                            tempCategoiesList.indexOf(item) > -1
                              ? color.themePurple
                              : color.lightGray,
                          marginLeft: index !== 0 ? wp(2) : 0,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          buttonTextStyle,
                          {
                            color: tempCategoiesList.indexOf(item) > -1 ? color.white : color.black,
                          },
                        ]}
                      >
                        {item?.name}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            <View style={{ height: hp(1) }} />
            <View style={{ flex: 1, marginTop: hp(1.5) }}>
              <View>
                <View style={backLine} />
                <Text style={headerText}>{'Stores'}</Text>
              </View>
              <View style={{ height: hp(2) }} />
              <FlatList
                ref={flatListRefStore}
                horizontal={true}
                data={searchData.stores}
                showsVerticalScrollIndicator={true}
                initialScrollIndex={0}
                getItemLayout={(data, index) => getItemLayout(data, index)}
                renderItem={({ item, index }) => (
                  <TouchableWithoutFeedback
                    style={{ flex: 1 }}
                    onPress={() => {
                      if (arrayData['stores'].indexOf(item) < 0) {
                        tempStoreList.push(item);
                      } else {
                        tempStoreList.remove(item);
                      }
                      setArrayData({ ...arrayData, ['stores']: tempStoreList });
                      arrayData['stores'] = tempStoreList;
                    }}
                  >
                    <View
                      style={[
                        buttonStyle,
                        {
                          backgroundColor:
                            tempStoreList.indexOf(item) > -1 ? color.themePurple : color.lightGray,
                          marginLeft: index !== 0 ? wp(2) : 0,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          buttonTextStyle,
                          {
                            color: tempStoreList.indexOf(item) > -1 ? color.white : color.black,
                          },
                        ]}
                      >
                        {item?.companyName}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            <View style={{ height: hp(1) }} />
            <View style={{ flex: 1, marginTop: hp(1.5) }}>
              <View>
                <View style={backLine} />
                <Text style={headerText}>{'Brands'}</Text>
              </View>
              <View style={{ height: hp(2) }} />
              <FlatList
                ref={flatListRefBrand}
                horizontal={true}
                data={searchData.brandList}
                showsVerticalScrollIndicator={true}
                initialScrollIndex={0}
                getItemLayout={(data, index) => getItemLayout(data, index)}
                renderItem={({ item, index }) => (
                  <TouchableWithoutFeedback
                    style={{ flex: 1 }}
                    onPress={() => {
                      if (arrayData['brandList'].indexOf(item) < 0) {
                        tempBrandList.push(item);
                      } else {
                        tempBrandList.remove(item);
                      }
                      setArrayData({ ...arrayData, ['brandList']: tempBrandList });
                      arrayData['brandList'] = tempBrandList;
                    }}
                  >
                    <View
                      style={[
                        buttonStyle,
                        {
                          backgroundColor:
                            tempBrandList.indexOf(item) > -1 ? color.themePurple : color.lightGray,
                          marginLeft: index !== 0 ? wp(2) : 0,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          buttonTextStyle,
                          {
                            color: tempBrandList.indexOf(item) > -1 ? color.white : color.black,
                          },
                        ]}
                      >
                        {item?.brandName}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>

            <View style={{ height: hp(1) }} />
            <View style={{ flex: 1, marginTop: hp(1.5) }}>
              <View>
                <View style={backLine} />
                <Text style={headerText}>{'Colors'}</Text>
              </View>
              <View style={{ height: hp(2) }} />
              <FlatList
                ref={flatListRefColor}
                horizontal={true}
                data={searchData.colorArray}
                showsVerticalScrollIndicator={true}
                initialScrollIndex={0}
                getItemLayout={(data, index) => getItemLayout(data, index)}
                renderItem={({ item, index }) => (
                  <TouchableWithoutFeedback
                    style={{ flex: 1 }}
                    onPress={() => {
                      if (arrayData['colorArray'].indexOf(item) < 0) {
                        tempColorList.push(item);
                      } else {
                        tempColorList.remove(item);
                      }
                      setArrayData({ ...arrayData, ['colorArray']: tempColorList });
                      arrayData['colorArray'] = tempColorList;
                    }}
                  >
                    <View
                      style={[
                        buttonStyle,
                        {
                          backgroundColor: item?.colorName,
                          borderColor:
                            tempColorList.indexOf(item) > -1 ? color.themePurple : item?.colorName,
                          borderWidth: tempColorList.indexOf(item) > -1 ? hp(0.5) : 0,
                          marginLeft: index !== 0 ? wp(2) : 0,
                        },
                      ]}
                    />
                  </TouchableWithoutFeedback>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>

            <View style={{ height: hp(1) }} />
            <View style={{ flex: 1, marginTop: hp(1.5) }}>
              <View>
                <View style={backLine} />
                <Text style={headerText}>{'Types'}</Text>
              </View>
              <View style={{ height: hp(2) }} />
              <FlatList
                ref={flatListRefType}
                horizontal={true}
                data={searchData.types}
                showsVerticalScrollIndicator={true}
                initialScrollIndex={0}
                getItemLayout={(data, index) => getItemLayout(data, index)}
                renderItem={({ item, index }) => (
                  <TouchableWithoutFeedback
                    style={{ flex: 1 }}
                    onPress={() => {
                      if (arrayData['types'].indexOf(item) < 0) {
                        tempTypeList.push(item);
                      } else {
                        tempTypeList.remove(item);
                      }
                      setArrayData({ ...arrayData, ['types']: tempTypeList });
                      arrayData['types'] = tempTypeList;
                    }}
                  >
                    <View
                      style={[
                        buttonStyle,
                        {
                          backgroundColor:
                            tempTypeList.indexOf(item) > -1 ? color.themePurple : color.lightGray,
                          marginLeft: index !== 0 ? wp(2) : 0,

                        },
                      ]}
                    >
                      <Text
                        style={[
                          buttonTextStyle,
                          {
                            color: tempTypeList.indexOf(item) > -1 ? color.white : color.black,
                          },
                        ]}
                      >
                        {removeHash(item)}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            <View style={{ height: hp(1) }} />
            <View style={{ flex: 1, marginTop: hp(1.5) }}>
              <View>
                <View style={backLine} />
                <Text style={headerText}>{'Fabric'}</Text>
              </View>
              <View style={{ height: hp(2) }} />
              <FlatList
                ref={flatListRefFabric}
                horizontal={true}
                data={searchData.fabric}
                showsVerticalScrollIndicator={true}
                initialScrollIndex={0}
                getItemLayout={(data, index) => getItemLayout(data, index)}
                renderItem={({ item, index }) => (
                  <TouchableWithoutFeedback
                    style={{ flex: 1 }}
                    onPress={() => {
                      if (arrayData['fabric'].indexOf(item) < 0) {
                        tempFabricList.push(item);
                      } else {
                        tempFabricList.remove(item);
                      }
                      setArrayData({ ...arrayData, ['fabric']: tempFabricList });
                      arrayData['fabric'] = tempFabricList;
                    }}
                  >
                    <View
                      style={[
                        buttonStyle,
                        {
                          backgroundColor:
                            tempFabricList.indexOf(item) > -1 ? color.themePurple : color.lightGray,
                          marginLeft: index !== 0 ? wp(2) : 0,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          buttonTextStyle,
                          {
                            color: tempFabricList.indexOf(item) > -1 ? color.white : color.black,
                          },
                        ]}
                      >
                        {removeHash(item)}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>

            <View
              style={{
                flex: 1,
                paddingHorizontal: wp(1),
                justifyContent: 'center',
                marginTop: hp(1),
              }}
            >
              <RangeSlider
                min={1}
                max={10000}
                fromValueOnChange={(value) => setFromValue(value)}
                toValueOnChange={(value) => setToValue(value)}
                initialFromValue={1}
                fromKnobColor={color.themePurple}
                toKnobColor={color.themePurple}
                valueLabelsBackgroundColor={color.themePurple}
                inRangeBarColor={color.themePurple}
                outOfRangeBarColor={color.lightGray}
              />
              <Text style={style.textStyle}>
                PRICE FROM {fromValue} TO {toValue}{' '}
              </Text>
            </View>

            <View style={{ flex: 0.1, padding: wp(1), marginTop: hp(4) }}>
              <TouchableOpacity onPress={() => fetchFilterData(arrayData)}>
                <View style={filterButton}>
                  <Text style={filterText}>FILTER</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  mainView: {
    flex: 1.52,
    marginTop: hp(-1.5),

    padding: wp(1),
    // paddingBottom:hp(1)
  },
  floatingInputStyle: {
    borderWidth: 0,
    fontSize: normalize(12),
    fontFamily: font.robotoRegular,
    height: isANDROID ? hp(6) : hp(4),
    marginTop: isANDROID ? hp(3) : hp(2),
  },
  textStyle: {
    fontSize: normalize(14),
    color: color.blue,
    fontWeight: 'bold',
  },
  radioButton: {
    height: hp(3),
    width: hp(3),
    borderWidth: hp(0.2),
    borderRadius: hp(1.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonForHead: {
    height: hp(2),
    width: hp(2),
    borderWidth: hp(0.2),
    borderRadius: hp(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    height: hp(1.7),
    width: hp(1.7),
    borderRadius: hp(0.85),
    backgroundColor: color.blue,
  },
  checkBoxStyle: {
    height: hp(2.5),
    width: hp(2.5),
    borderWidth: hp(0.2),
    borderColor: color.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    height:(IsAndroidOS || IsIOSOS)?hp(5): hp(7),
    width: (IsAndroidOS || IsIOSOS)?wp(23):wp(15),
    backgroundColor: color.blue,
    marginTop: hp(1),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp(1),
  },
  buttonTextStyle: {
    fontSize: normalize(11),
    color: color.white,
    fontWeight: 'bold',
  },
  filterButton: {
    height: hp(7),
    width:(IsAndroidOS || IsIOSOS)?wp(80):wp(30),
    alignSelf:'center',
    backgroundColor: color.themePurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterText: {
    fontSize: normalize(15),
    fontWeight: 'bold',
    color: color.white,
  },
  backLine: {
    alignSelf: 'center',
    position: 'absolute',
    borderBottomColor:color.lightGray,
    height: '50%',
    width: '100%',
  },
  headerText: {
    alignSelf: 'center',
    paddingHorizontal: wp(8),
    backgroundColor: color.white,
    fontSize: (IsAndroidOS || IsIOSOS)?normalize(14):normalize(12),
    color: color.blue,
    fontWeight: 'bold',
  },
  sliderThumb: {
    height: hp(1),
    width: hp(1),
    borderRadius: hp(0.5),
    backgroundColor: color.blue,
  },
  closeIcon: {
    position: 'absolute',
    alignSelf: 'flex-end',
    marginTop: hp(0.5),
    padding: hp(1.2),
  },
});
export default FilterPage;
