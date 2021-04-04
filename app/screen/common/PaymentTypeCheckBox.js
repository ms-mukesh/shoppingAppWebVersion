import { FlatList, Text, View, Image, TouchableWithoutFeedback } from 'react-native';
import { font, hp, normalize, wp, color } from '../../helper/themeHelper';
import React from 'react';
import { check_icon } from '../../assets/images';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const PaymentTypes = [
  {
    id: 0,
    title: 'COD(Cash On Delivery)',
  },
  {
    id: 1,
    title: 'UPI',
  },
  {
    id: 2,
    title: 'NET Banking',
  },
  {
    id: 3,
    title: 'Credit Card',
  },
  {
    id: 4,
    title: 'Debit Card',
  },
];
export const PaymentTypeCheckBox = (props) => {
  const { selectedData = [], toggleCheckbox = null, disable = false } = props;
  const renderCheckBox = ({ item }) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
          marginHorizontal: wp(1),
          marginVertical: hp(1),
        }}
      >
        <TouchableWithoutFeedback disabled={disable} onPress={() => toggleCheckbox(item.id)}>
          <View
            style={{
              height: hp(3),
              width: hp(5),
              borderWidth: hp(0.1),
              borderColor: color.themeBtnColor,
            }}
          >
            {selectedData.includes(item.id) && (
              <Image style={{ height: hp(3), width: hp(3.5) }} source={check_icon} />
            )}
          </View>
        </TouchableWithoutFeedback>
        <Text
          allowFontScaling={false}
          style={{
            flex: 1,
            marginLeft: wp(3),
            fontSize: normalize(12),
            color: color.themeBtnColor,
          }}
        >
          {item.title}
        </Text>
      </View>
    );
  };
  return (
    <View style={{ flex: 1, marginTop: hp(1.5) }}>
      <FlatList
        horizontal={false}
        data={PaymentTypes}
        showsHorizontalScrollIndicator={false}
        extraData={[selectedData]}
        renderItem={renderCheckBox}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};
