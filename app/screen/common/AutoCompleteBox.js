import {
  FlatList,
  Platform,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  KeyboardAvoidingView,
  View,
} from 'react-native';

import { color, wp, hp, normalize } from '../../helper/themeHelper';
import React, { useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { isIOS } from '../../helper/themeHelper';

let flatlistRef;
const BloodGroup = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const Zodiac = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Vigro',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];
const MARITAL_STATUS = ['SINGLE', 'MARRIED', 'ENGAGED'];

const PRODUCT_SIZE = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const AutoCompleteModel = (props) => {
  let {
    allSearchData,
    _setIsAutoCompleteModel,
    selectField,
    _setSelectedValues,
    _setSelectedField,
    changeValue,
    currentKey,
    selectedValue,
    currentCity = null,
    currentStateForHome = null,
    currentCountryForHome = null,
    currentCountryForOffice = null,
    currentStateForOffice = null,
    _setAddNewBrandNameFlag = null,
    _setAddNewFabricNameFlag = null,
    _setAddNewTypeNameFlag = null,
  } = props;

  const [searchBoxValue, setSearchBoxValue] = useState('');
  console.log('data----', currentKey);

  const [SearchField, setSearchField] = useState(
    searchBoxValue &&
      searchBoxValue !== null &&
      searchBoxValue.length > 0 &&
      searchBoxValue !== '-' &&
      searchBoxValue !== ''
      ? searchBoxValue
      : ''
  );
  const [searchData, setSearchData] = useState([]);
  console.log('cuurent key--', currentKey);
  // const userDetail = useSelector(state => state.UserReducer.userDetail);
  useEffect(() => {
    switch (currentKey) {
      case 'inputCategory':
        setSearchData(allSearchData?.category);
        break;
      case 'inputBrandName':
        setSearchData(allSearchData?.brand);
        break;
      case 'inputFabric':
        setSearchData(allSearchData?.fabric);
        break;
      case 'inputType':
        setSearchData(allSearchData.type);
        break;
      case 'size':
        setSearchData(PRODUCT_SIZE);
        break;
    }
  }, [allSearchData]);
  let tempData = [];
  console.log(currentKey);

  if (selectField.toLowerCase() === 'state') {
    let tempSeacrhValue = null;
    if (currentKey === 'homeState') {
      tempSeacrhValue = currentCountryForHome.toUpperCase();
    } else {
      tempSeacrhValue = currentCountryForOffice.toUpperCase();
    }
    if (
      currentCountryForHome !== null &&
      currentCountryForHome !== '-' &&
      currentCountryForHome.length > 0 &&
      currentCountryForHome !== ''
    ) {
      tempData =
        searchData &&
        searchData.country &&
        tempSeacrhValue !== null &&
        searchData.country[tempSeacrhValue].filter((member) => {
          return member.toLowerCase().includes(SearchField.toLowerCase());
        });
    } else {
      tempData =
        searchData &&
        searchData.country &&
        searchData.country['INDIA'].filter((member) => {
          return member.toLowerCase().includes(SearchField.toLowerCase());
        });
    }
  }

  const filterData =
    searchData &&
    searchData !== null &&
    (selectField.toLowerCase() === 'state' || selectField.toLowerCase() === 'city')
      ? typeof tempData !== 'undefined' && tempData
      : searchData.filter((member) => {
          return member.toString().toLowerCase().includes(SearchField.toLowerCase());
        });

  tempData = [];

  const FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#d0d0d0',
        }}
        keyboardShouldPersistTaps="handled"
      />
    );
  };
  const onTextChange = useCallback((value) => {
    setSearchField(value);
    setSearchBoxValue(value);
    _setSelectedValues(filterData.length > 0 && value !== '' ? filterData[0] : '');
  });

  return (
    <Modal
      onRequestClose={() => {
        _setIsAutoCompleteModel(false);
        _setSelectedField('');
      }}
      visible={true}
      animated={true}
      transparent={false}
      style={style.searchModal}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height padding'}
      >
        <View style={{ ...style.modalContainer }}>
          <View style={{ flexDirection: 'row' }}>
            <Text allowFontScaling={false} style={style.modalLabel}>
              {selectField}
            </Text>
            <TouchableWithoutFeedback
              onPress={() => {
                _setIsAutoCompleteModel(false);
                _setSelectedField('');
              }}
            >
              <Text>Close</Text>
            </TouchableWithoutFeedback>
          </View>
          {filterData.length > 0 ? (
            <FlatList
              ref={(ref) => (flatlistRef = ref)}
              style={{
                marginVertical: hp(2),
                transform: [{ scaleY: -1 }],
                paddingHorizontal: wp(1),
              }}
              keyboardShouldPersistTaps="always"
              keyboardDismissMode={'none'}
              horizontal={false}
              data={filterData}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={FlatListItemSeparator}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback
                  keyboardShouldPersistTaps="handled"
                  keyboardType={'default'}
                  onPress={() => {
                    setSearchField(item);
                    setSearchBoxValue(item.substring(item.indexOf('#') + 1, item.length));
                    _setSelectedValues(item);
                  }}
                >
                  <View style={{ ...style.filterList, transform: [{ scaleY: -1 }] }}>
                    <Text allowFontScaling={false} keyboardType={'default'}>
                      {item.substring(item.indexOf('#') + 1, item.length)}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              )}
            />
          ) : (
            <View style={style.lblNoRecord}>
              <Text
                allowFontScaling={false}
                style={{ alignSelf: 'center', fontSize: normalize(14), color: color.black }}
              >
                {'No Record Found'}
              </Text>
            </View>
          )}
          {currentKey === 'inputBrandName' && (
            <Text
              onPress={async () => {
                await _setIsAutoCompleteModel(false);
                await _setAddNewBrandNameFlag();
              }}
              style={{ fontSize: normalize(18), fontWeight: '700', marginBottom: hp(2) }}
            >
              Add New Brand
            </Text>
          )}
          {currentKey === 'inputFabric' && (
            <Text
              onPress={async () => {
                await _setIsAutoCompleteModel(false);
                await _setAddNewFabricNameFlag();
              }}
              style={{ fontSize: normalize(18), fontWeight: '700', marginBottom: hp(2) }}
            >
              Add New Fabric
            </Text>
          )}
          {currentKey === 'inputType' && (
            <Text
              onPress={async () => {
                await _setIsAutoCompleteModel(false);
                await _setAddNewTypeNameFlag();
              }}
              style={{ fontSize: normalize(18), fontWeight: '700', marginBottom: hp(2) }}
            >
              Add New Type
            </Text>
          )}

          <View style={style.searchView}>
            <TextInput
              allowFontScaling={false}
              style={{ ...style.searchContainer }}
              placeholder={selectField + '...'}
              placeholderTextColor={color.black}
              autoCapitalize={'none'}
              returnKeyType={'done'}
              value={
                searchBoxValue === '-' ||
                typeof searchBoxValue === 'undefined' ||
                searchBoxValue === null ||
                searchBoxValue === ''
                  ? ''
                  : searchBoxValue
              }
              autoFocus={true}
              onChangeText={onTextChange}
              keyboardType={'default'}
              onSubmitEditing={() => {
                _setIsAutoCompleteModel(false);
                _setSelectedField('');
                filterData.length > 0 || currentKey == 'officeAddress' ? changeValue() : '';
              }}
            />
            <TouchableOpacity style={style.btnDone}>
              <Text
                allowFontScaling={false}
                style={style.textDone}
                onPress={() => {
                  _setIsAutoCompleteModel(false);
                  _setSelectedField('');
                  filterData.length > 0 || currentKey == 'officeAddress' ? changeValue() : '';
                }}
              >
                {'DONE' + ' '}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
const style = StyleSheet.create({
  searchContainer: {
    fontSize: normalize(14),
    borderRadius: 10,
    borderColor: '#c8c5c5',
    borderWidth: 2,
    flex: 1,
    color: color.black,
    padding: wp(1.5),
    // fontFamily: font.robotoRegular,
  },
  filterList: {
    paddingVertical: hp(1.5),
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    flex: 1,
  },
  searchModal: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    padding: wp(5),
    marginTop: isIOS ? 50 : 5,
  },
  modalLabel: {
    fontSize: normalize(22),
    flex: 1,
    alignSelf: 'center',
    // fontFamily: font.robotoRegular,
  },
  searchView: {
    flexDirection: 'row',
    marginHorizontal: wp(1),
    // fontFamily: font.robotoRegular,
  },
  btnDone: {
    marginLeft: wp(2),
    backgroundColor: color.blue,
    borderRadius: 10,
    // fontFamily: font.robotoRegular,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  textDone: {
    color: color.white,
    fontWeight: 'bold',
    fontSize: normalize(14),
    // fontFamily: font.robotoRegular,
    paddingHorizontal: wp(2),
  },
  lblNoRecord: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    textAlign: 'center',
  },
});
export default AutoCompleteModel;
